import { EvaluationRecord, InstrumentModel } from '../../models';
import { calculateVerificationIntervals } from '../../calculations';
import {
  evaluateEccentricityPositions,
  evaluateErrorObservationRows,
  evaluateRepeatabilityTrials,
  evaluateTemperatureTestRows,
  generateDefaultEccentricityRows,
  generateDefaultRepeatabilityTrials,
  generateDefaultTemperatureRows,
  generateStandardErrorLoadSchedule,
  validateCompleteEvaluation,
} from '../../rules';

/**
 * Pure Evaluation Domain Service
 * Orchestrates creation, recalculation, and standard test schedule generation
 */
export class EvaluationService {
  static recalculateEvaluation(record: EvaluationRecord): EvaluationRecord {
    const { instrument, laboratory } = record;
    const e = instrument.verificationScaleInterval;
    const n = calculateVerificationIntervals(instrument.maxCapacity, e);
    const multiplier = laboratory.inspectionStage === 'In-Service Inspection' ? 2 : 1;

    const updatedInstrument: InstrumentModel = {
      ...instrument,
      verificationIntervalsN: n,
    };

    const updatedErrorObs = evaluateErrorObservationRows(
      record.errorObservations,
      e,
      instrument.accuracyClass,
      multiplier
    );

    const zeroErrorE0 =
      updatedErrorObs.find((r) => r.appliedLoad === 0)?.uncorrectedErrorE ?? 0;

    const { updatedTrials } = evaluateRepeatabilityTrials(
      record.repeatabilityTrials,
      e,
      instrument.accuracyClass,
      multiplier
    );

    const updatedEccentricity = evaluateEccentricityPositions(
      record.eccentricityObservations,
      e,
      instrument.accuracyClass,
      zeroErrorE0,
      multiplier
    );

    const updatedTemperature = evaluateTemperatureTestRows(
      record.temperatureObservations,
      e,
      instrument.accuracyClass
    );

    const draft: EvaluationRecord = {
      ...record,
      instrument: updatedInstrument,
      errorObservations: updatedErrorObs,
      repeatabilityTrials: updatedTrials,
      eccentricityObservations: updatedEccentricity,
      temperatureObservations: updatedTemperature,
      updatedAt: new Date().toISOString(),
    };

    const validation = validateCompleteEvaluation(draft);
    return {
      ...draft,
      disposition: validation.overallDisposition,
    };
  }

  static regenerateAllStandardTestSchedules(record: EvaluationRecord): EvaluationRecord {
    const { instrument } = record;
    const e = instrument.verificationScaleInterval;
    const max = instrument.maxCapacity;
    const min = instrument.minCapacity;
    const cls = instrument.accuracyClass;

    const errorObservations = generateStandardErrorLoadSchedule(min, max, e, cls);
    const repeatabilityTrials = generateDefaultRepeatabilityTrials(max, e);
    const eccentricityObservations = generateDefaultEccentricityRows(max, e, cls);
    const temperatureObservations = generateDefaultTemperatureRows(
      max,
      e,
      cls,
      instrument.ratedTempMin,
      instrument.ratedTempMax
    );

    return this.recalculateEvaluation({
      ...record,
      errorObservations,
      repeatabilityTrials,
      eccentricityObservations,
      temperatureObservations,
    });
  }

  static createNewEvaluationRecord(
    nextId: string,
    fileRef: string,
    defaultLabName = 'Regional Reference Standard Laboratory (RRSL), Ahmedabad',
    defaultLabCode = 'RRSL-WR-AHM-01',
    defaultOfficerName = 'Sh. R. K. Kulkarni',
    defaultOfficerDesignation = 'Deputy Director (Legal Metrology)',
    defaultOfficerId = 'LM-GOI-4418'
  ): EvaluationRecord {
    const today = new Date().toISOString().slice(0, 10);
    const instrument: InstrumentModel = {
      manufacturer: 'Essae-Teraoka Pvt. Ltd.',
      manufacturerAddress: 'Plot No. 41, Bommasandra Industrial Area, Bengaluru - 560099',
      modelDesignation: 'DS-252-30',
      serialNumber: `ET-2026-${Math.floor(10000 + Math.random() * 89999)}`,
      typeApprovalRef: 'IND/09/26/412',
      softwareVersion: 'v4.12.0-LM (Checksum: 8A4F)',
      instrumentType: 'Electronic Bench Scale',
      loadReceptorGeometry: 'Square / Rectangular (4 Corner + Centre — 5 Points)',
      accuracyClass: 'Class III',
      unit: 'kg',
      maxCapacity: 30,
      minCapacity: 0.2,
      verificationScaleInterval: 0.01,
      actualScaleInterval: 0.01,
      verificationIntervalsN: 3000,
      subtractiveTareMax: 15,
      ratedTempMin: -10,
      ratedTempMax: 40,
      zeroSettingDevice: 'Semi-automatic',
      zeroTrackingEnabled: true,
    };

    const base: EvaluationRecord = {
      id: nextId,
      fileReferenceNo: fileRef,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'IN PROGRESS',
      disposition: 'COMPLIANT',
      instrument,
      laboratory: {
        laboratoryName: defaultLabName,
        laboratoryCode: defaultLabCode,
        regionalDirectorate: 'Western Region Directorate, Department of Consumer Affairs',
        testBayLocation: 'Mass Metrology Laboratory — Bay M-02',
        testingOfficerName: defaultOfficerName,
        testingOfficerDesignation: defaultOfficerDesignation,
        testingOfficerId: defaultOfficerId,
        supervisingOfficerName: 'Dr. S. V. Deshpande, Director (RRSL)',
        referenceWeightSetId: 'NPL-F1-SET-2024-09',
        referenceWeightClass: 'OIML Class F1',
        calibrationCertRef: 'CSIR-NPL/MASS/2025/0881',
        calibrationValidUntil: '2027-08-31',
        testDate: today,
        inspectionStage: 'Initial Type Evaluation',
      },
      environment: {
        tempStartC: 20.4,
        tempEndC: 20.8,
        humidityStartPct: 48.0,
        humidityEndPct: 50.5,
        pressureHpa: 1012.6,
        mainsVoltageV: 230.2,
        mainsFrequencyHz: 50.0,
        thermalStabilizationHours: 6,
        vibrationIsolationVerified: true,
        levelIndicatorVerified: true,
        warmupTimeMinutes: 30,
        environmentalRemarks: 'Controlled laboratory chamber conditions maintained within ±0.5 °C/h.',
      },
      errorObservations: [],
      repeatabilityTrials: [],
      eccentricityObservations: [],
      temperatureObservations: [],
      officerRemarks: 'Initial pattern examination under Legal Metrology (General) Rules, 2011 & OIML R 76-1 (2006).',
      reviewerRemarks: '',
    };

    return this.regenerateAllStandardTestSchedules(base);
  }
}
