import {
  ClauseComplianceItem,
  ComplianceResult,
  EvaluationRecord,
  EvaluationValidationReport,
} from '../../models';
import { evaluateInstrumentClassification } from '../classification';
import { evaluateRepeatabilityTrials } from '../repeatability';

/**
 * Full OIML R 76-1 Clause-by-Clause Validation & Disposition Engine
 */
export function validateCompleteEvaluation(
  record: EvaluationRecord
): EvaluationValidationReport {
  const { instrument, environment, errorObservations, repeatabilityTrials, eccentricityObservations, temperatureObservations } = record;
  const e = instrument.verificationScaleInterval;
  const unit = instrument.unit;

  // 1. Instrument Classification (Cl. 3.1 / Table 3)
  const classResult = evaluateInstrumentClassification(instrument);

  // 2. Environmental Conditions (Annex A.4.1 / Cl. 3.9.2)
  const envWarnings: string[] = [];
  const tempExcursion = Math.abs(environment.tempEndC - environment.tempStartC);
  if (tempExcursion > 2.0) {
    envWarnings.push(
      `Ambient temperature variation during test (${tempExcursion.toFixed(1)} °C) exceeds recommended ±2.0 °C laboratory stability.`
    );
  }
  if (environment.humidityStartPct < 30 || environment.humidityEndPct > 85) {
    envWarnings.push('Relative humidity outside standard reference envelope (30% to 85% RH).');
  }
  if (!environment.levelIndicatorVerified) {
    envWarnings.push('Instrument level indicator verification not confirmed prior to loading.');
  }
  const isEnvironmentValid = envWarnings.length === 0;

  // 3. Weighing Performance & Error of Indication (Cl. 3.5.1 / Table 6)
  let weighingStatus: ComplianceResult = 'PENDING';
  let maxObservedAbsError = 0;
  if (errorObservations.length > 0) {
    maxObservedAbsError = Math.max(
      ...errorObservations.map((r) => Math.abs(r.correctedErrorEc))
    );
    const anyFailed = errorObservations.some((r) => r.status === 'FAIL');
    weighingStatus = anyFailed ? 'FAIL' : 'PASS';
  }

  // 4. Repeatability (Cl. 3.6.1)
  const { summaries: repSummaries } = evaluateRepeatabilityTrials(
    repeatabilityTrials,
    e,
    instrument.accuracyClass,
    record.laboratory.inspectionStage === 'In-Service Inspection' ? 2 : 1
  );
  let repeatabilityStatus: ComplianceResult = 'PENDING';
  let maxRepeatabilitySpread = 0;
  if (repSummaries.length > 0 && repSummaries.some((s) => s.trials.length > 0)) {
    maxRepeatabilitySpread = Math.max(
      ...repSummaries.map((s) => s.spreadPMaxMinusPMin)
    );
    const anyFailed = repSummaries.some((s) => s.status === 'FAIL');
    repeatabilityStatus = anyFailed ? 'FAIL' : 'PASS';
  }

  // 5. Eccentricity (Cl. 3.6.2)
  let eccentricityStatus: ComplianceResult = 'PENDING';
  let maxEccentricityAbsError = 0;
  if (eccentricityObservations.length > 0) {
    maxEccentricityAbsError = Math.max(
      ...eccentricityObservations.map((r) => Math.abs(r.correctedErrorEc))
    );
    const anyFailed = eccentricityObservations.some((r) => r.status === 'FAIL');
    eccentricityStatus = anyFailed ? 'FAIL' : 'PASS';
  }

  // 6. Static Temperature & Thermal Zero Drift (Cl. 3.9.2)
  let temperatureStatus: ComplianceResult = 'PENDING';
  let maxThermalDriftPerStepE = 0;
  if (temperatureObservations.length > 0) {
    maxThermalDriftPerStepE = Math.max(
      ...temperatureObservations.map((r) => r.zeroDriftFromPrevE)
    );
    const anyFailed = temperatureObservations.some(
      (r) => r.spanStatus === 'FAIL' || r.zeroDriftStatus === 'FAIL'
    );
    temperatureStatus = anyFailed ? 'FAIL' : 'PASS';
  }

  const stepIntervalC = instrument.accuracyClass === 'Class I' ? 1 : 5;

  const clauseMatrix: ClauseComplianceItem[] = [
    {
      clauseRef: 'OIML R 76-1 Cl. 3.1.1 & Table 3',
      clauseTitle: 'Metrological Classification & Scale Intervals (n = Max / e)',
      requirementSummary: `${instrument.accuracyClass}: n within Table 3 limits, Min ≥ lower threshold`,
      observedSummary: `n = ${classResult.calculatedN.toLocaleString()}, Min = ${classResult.calculatedMinInE} e (${instrument.minCapacity} ${unit})`,
      status: classResult.isValid ? 'PASS' : 'FAIL',
    },
    {
      clauseRef: 'OIML R 76-1 Cl. 4.5.2 & A.4.2',
      clauseTitle: 'Zero-Setting & Zero-Tracking Accuracy',
      requirementSummary: '|E₀| ≤ 0.25 e at initial zero indication',
      observedSummary:
        errorObservations.length > 0
          ? `E₀ = ${errorObservations[0].uncorrectedErrorE.toFixed(4)} ${unit} (Limit: ±${(0.25 * e).toFixed(4)} ${unit})`
          : 'No zero observation recorded',
      status:
        errorObservations.length === 0
          ? 'PENDING'
          : Math.abs(errorObservations[0].uncorrectedErrorE) <= 0.25 * e + 1e-9
            ? 'PASS'
            : 'FAIL',
    },
    {
      clauseRef: 'OIML R 76-1 Cl. 3.5.1 & Table 6',
      clauseTitle: 'Weighing Performance — Error of Indication (Increasing & Decreasing)',
      requirementSummary: '|Ec| ≤ MPE across all load stages from Min to Max',
      observedSummary: `Max |Ec| = ${maxObservedAbsError.toFixed(4)} ${unit} across ${errorObservations.length} stages`,
      status: weighingStatus,
    },
    {
      clauseRef: 'OIML R 76-1 Cl. 3.6.1 & A.4.10',
      clauseTitle: 'Repeatability at ~0.5 Max and ~Max',
      requirementSummary: '|E_max − E_min| ≤ |MPE| for repeated loadings',
      observedSummary: `Max Spread (E_max − E_min) = ${maxRepeatabilitySpread.toFixed(4)} ${unit}`,
      status: repeatabilityStatus,
    },
    {
      clauseRef: 'OIML R 76-1 Cl. 3.6.2 & A.4.7',
      clauseTitle: 'Eccentric Loading Test (Load Receptor Quadrants)',
      requirementSummary: '|Ec| ≤ MPE at L ≈ Max / 3 across 5 load receptor positions',
      observedSummary: `Max |Ec| = ${maxEccentricityAbsError.toFixed(4)} ${unit}`,
      status: eccentricityStatus,
    },
    {
      clauseRef: 'OIML R 76-1 Cl. 3.9.2.2 & 3.9.2.3',
      clauseTitle: 'Static Temperature & No-Load Thermal Zero Drift',
      requirementSummary: `Span |Ec| ≤ MPE; Zero variation ≤ 1.0 e per ${stepIntervalC} °C`,
      observedSummary: `Max Zero Drift = ${maxThermalDriftPerStepE.toFixed(2)} e / ${stepIntervalC} °C`,
      status: temperatureStatus,
    },
  ];

  const anyClauseFailed = clauseMatrix.some((c) => c.status === 'FAIL');
  const anyClausePending = clauseMatrix.some((c) => c.status === 'PENDING');

  const overallDisposition: 'COMPLIANT' | 'NON-COMPLIANT' | 'INCOMPLETE' = anyClauseFailed
    ? 'NON-COMPLIANT'
    : anyClausePending
      ? 'INCOMPLETE'
      : 'COMPLIANT';

  return {
    evaluationId: record.id,
    isInstrumentSpecValid: classResult.isValid,
    instrumentSpecErrors: classResult.errors,
    isEnvironmentValid,
    environmentWarnings: envWarnings,
    weighingPerformanceStatus: weighingStatus,
    maxObservedAbsError,
    repeatabilityStatus,
    maxRepeatabilitySpread,
    eccentricityStatus,
    maxEccentricityAbsError,
    temperatureStatus,
    maxThermalDriftPerStepE,
    clauseMatrix,
    overallDisposition,
  };
}
