import { AccuracyClass, InstrumentModel } from '../../models';
import {
  calculateMinimumCapacityInE,
  calculateVerificationIntervals,
} from '../../calculations';

/**
 * OIML R 76-1 Table 3: Accuracy Classes & Verification Intervals Rules
 */
export interface ClassRuleConstraints {
  accuracyClass: AccuracyClass;
  minN: number;
  maxN: number | null; // null for Class I (unlimited upper bound)
  minCapacityInE: number; // Minimum capacity (Min) lower limit in units of e
  description: string;
}

export const OIML_TABLE_3_RULES: Record<AccuracyClass, ClassRuleConstraints> = {
  'Class I': {
    accuracyClass: 'Class I',
    minN: 50000,
    maxN: null,
    minCapacityInE: 100,
    description: 'Special Accuracy (e ≥ 0.001 g, n ≥ 50,000, Min ≥ 100 e)',
  },
  'Class II': {
    accuracyClass: 'Class II',
    minN: 100,
    maxN: 100000,
    minCapacityInE: 20,
    description: 'High Accuracy (n: 100 to 100,000, Min ≥ 20 e or 50 e)',
  },
  'Class III': {
    accuracyClass: 'Class III',
    minN: 100,
    maxN: 10000,
    minCapacityInE: 20,
    description: 'Medium Accuracy (n: 100 to 10,000, Min ≥ 20 e)',
  },
  'Class IIII': {
    accuracyClass: 'Class IIII',
    minN: 100,
    maxN: 1000,
    minCapacityInE: 10,
    description: 'Ordinary Accuracy (n: 100 to 1,000, Min ≥ 10 e)',
  },
};

export interface ClassificationValidationResult {
  isValid: boolean;
  calculatedN: number;
  calculatedMinInE: number;
  errors: string[];
}

export function evaluateInstrumentClassification(
  instrument: InstrumentModel
): ClassificationValidationResult {
  const errors: string[] = [];
  const rules = OIML_TABLE_3_RULES[instrument.accuracyClass];
  const n = calculateVerificationIntervals(
    instrument.maxCapacity,
    instrument.verificationScaleInterval
  );
  const minInE = calculateMinimumCapacityInE(
    instrument.minCapacity,
    instrument.verificationScaleInterval
  );

  if (!instrument.manufacturer.trim()) {
    errors.push('Manufacturer name is mandatory per OIML R 76-1 Clause 7.1.');
  }
  if (!instrument.modelDesignation.trim()) {
    errors.push('Model / pattern designation is mandatory.');
  }
  if (!instrument.serialNumber.trim()) {
    errors.push('Serial number is mandatory for evaluation dossier.');
  }
  if (instrument.maxCapacity <= 0) {
    errors.push('Maximum capacity (Max) must be strictly positive.');
  }
  if (instrument.verificationScaleInterval <= 0) {
    errors.push('Verification scale interval (e) must be strictly positive.');
  }
  if (instrument.minCapacity >= instrument.maxCapacity) {
    errors.push('Minimum capacity (Min) must be less than Maximum capacity (Max).');
  }

  if (n < rules.minN) {
    errors.push(
      `Verification scale intervals n = ${n} is below OIML Table 3 minimum (${rules.minN}) for ${instrument.accuracyClass}.`
    );
  }
  if (rules.maxN !== null && n > rules.maxN) {
    errors.push(
      `Verification scale intervals n = ${n} exceeds OIML Table 3 maximum (${rules.maxN}) for ${instrument.accuracyClass}.`
    );
  }
  if (minInE < rules.minCapacityInE - 1e-6) {
    errors.push(
      `Minimum capacity Min = ${minInE} e is below OIML Table 3 lower limit (${rules.minCapacityInE} e) for ${instrument.accuracyClass}.`
    );
  }

  return {
    isValid: errors.length === 0,
    calculatedN: n,
    calculatedMinInE: minInE,
    errors,
  };
}
