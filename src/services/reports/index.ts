import { EvaluationRecord } from '../../models';
import { validateCompleteEvaluation } from '../../rules';
import { downloadTextFile, formatMassValue, formatSignedError } from '../../utils/formatters';

/**
 * Official Departmental Report & Export Service
 */
export class ReportExportService {
  static exportEvaluationJson(record: EvaluationRecord): void {
    const validation = validateCompleteEvaluation(record);
    const payload = {
      schemaVersion: 'METRISENSE-OIML-R76-v2.0',
      exportedAt: new Date().toISOString(),
      authority: 'Government of India - Department of Consumer Affairs - Legal Metrology Division',
      evaluation: record,
      complianceValidation: validation,
    };
    const safeId = record.id.replace(/[^a-zA-Z0-9_-]/g, '_');
    downloadTextFile(
      `${safeId}_OIML_R76_Dossier.json`,
      JSON.stringify(payload, null, 2),
      'application/json'
    );
  }

  static exportObservationsCsv(record: EvaluationRecord): void {
    const e = record.instrument.verificationScaleInterval;
    const unit = record.instrument.unit;

    const lines: string[] = [
      `# METRISENSE — OIML R 76-1 OFFICIAL OBSERVATION SHEET`,
      `# Evaluation ID,${record.id}`,
      `# File Reference,${record.fileReferenceNo}`,
      `# Manufacturer,${record.instrument.manufacturer}`,
      `# Model,${record.instrument.modelDesignation}`,
      `# Serial Number,${record.instrument.serialNumber}`,
      `# Accuracy Class,${record.instrument.accuracyClass}`,
      `# Max (${unit}),${record.instrument.maxCapacity}`,
      `# e (${unit}),${e}`,
      `# n,${record.instrument.verificationIntervalsN}`,
      ``,
      `SECTION 1: WEIGHING PERFORMANCE (CLAUSE 3.5.1)`,
      `Step,Load Stage,Direction,Applied Load L (${unit}),Indicated I (${unit}),Delta L (${unit}),Characteristic P (${unit}),Error E (${unit}),Corrected Error Ec (${unit}),MPE Limit (${unit}),Status`,
    ];

    record.errorObservations.forEach((r) => {
      lines.push(
        [
          r.stepIndex,
          `"${r.loadLabel}"`,
          r.direction,
          formatMassValue(r.appliedLoad, e),
          formatMassValue(r.indicatedValue, e),
          formatMassValue(r.deltaLoad, e),
          formatMassValue(r.characteristicValueP, e),
          formatSignedError(r.uncorrectedErrorE, e),
          formatSignedError(r.correctedErrorEc, e),
          `±${formatMassValue(r.mpeLimit, e)}`,
          r.status,
        ].join(',')
      );
    });

    lines.push('');
    lines.push(`SECTION 2: ECCENTRICITY TEST (CLAUSE 3.6.2)`);
    lines.push(
      `Position,Quadrant Description,Applied Load (${unit}),Indicated (${unit}),Delta L (${unit}),Corrected Error Ec (${unit}),MPE Limit (${unit}),Status`
    );
    record.eccentricityObservations.forEach((r) => {
      lines.push(
        [
          r.positionNumber,
          `"${r.positionName}"`,
          formatMassValue(r.appliedLoad, e),
          formatMassValue(r.indicatedValue, e),
          formatMassValue(r.deltaLoad, e),
          formatSignedError(r.correctedErrorEc, e),
          `±${formatMassValue(r.mpeLimit, e)}`,
          r.status,
        ].join(',')
      );
    });

    lines.push('');
    lines.push(`SECTION 3: TEMPERATURE & ZERO DRIFT (CLAUSE 3.9.2)`);
    lines.push(
      `Seq,Chamber Temp (C),Soak (h),Zero Error E0 (${unit}),Test Load (${unit}),Span Error Ec (${unit}),MPE Limit (${unit}),Zero Drift (e/step),Span Status,Drift Status`
    );
    record.temperatureObservations.forEach((r) => {
      lines.push(
        [
          r.sequenceOrder,
          r.chamberTempC,
          r.soakDurationHours,
          formatSignedError(r.zeroIndicationE0, e),
          formatMassValue(r.referenceTestLoad, e),
          formatSignedError(r.correctedSpanErrorEc, e),
          `±${formatMassValue(r.mpeAtLoad, e)}`,
          r.zeroDriftFromPrevE.toFixed(3),
          r.spanStatus,
          r.zeroDriftStatus,
        ].join(',')
      );
    });

    const safeId = record.id.replace(/[^a-zA-Z0-9_-]/g, '_');
    downloadTextFile(`${safeId}_Observations.csv`, lines.join('\n'), 'text/csv;charset=utf-8');
  }
}
