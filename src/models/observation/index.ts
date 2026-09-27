export type ComplianceResult = 'PASS' | 'FAIL' | 'PENDING';

export type LoadDirection = 'INCREASING' | 'DECREASING';

/**
 * OIML R 76-1 Clause 3.5 / A.4.4 Weighing Performance & Error of Indication Row
 */
export interface ErrorObservationRow {
  id: string;
  stepIndex: number;
  loadLabel: string; // e.g., "Zero (0e)", "Min (20e)", "500e", "2000e", "Max"
  direction: LoadDirection;
  appliedLoad: number; // L
  indicatedValue: number; // I
  deltaLoad: number; // ΔL (additional small weights of 0.1e to find changeover point)
  characteristicValueP: number; // P = I + 0.5e - ΔL
  uncorrectedErrorE: number; // E = P - L
  correctedErrorEc: number; // Ec = E - E0
  mpeLimit: number; // ± MPE
  status: ComplianceResult;
}

/**
 * OIML R 76-1 Clause 3.6.1 / A.4.10 Repeatability Observation
 */
export interface RepeatabilityTrialRow {
  id: string;
  trialNumber: number;
  seriesLabel: 'Half Max (~0.5 Max)' | 'Near Max (~Max)';
  appliedLoad: number; // L
  zeroIndicationI0: number;
  loadIndicationI: number;
  deltaLoad: number; // ΔL
  characteristicValueP: number;
  errorE: number; // E = P - L
}

export interface RepeatabilitySeriesSummary {
  seriesLabel: 'Half Max (~0.5 Max)' | 'Near Max (~Max)';
  appliedLoad: number;
  trials: RepeatabilityTrialRow[];
  maxError: number;
  minError: number;
  spreadPMaxMinusPMin: number; // |E_max - E_min|
  standardDeviation: number;
  mpeAbsolute: number; // |MPE| at this load
  status: ComplianceResult;
}

/**
 * OIML R 76-1 Clause 3.6.2 / A.4.7 Eccentricity Loading Observation
 */
export interface EccentricityPositionRow {
  id: string;
  positionNumber: 1 | 2 | 3 | 4 | 5;
  positionName: string; // 1: Centre, 2: Front-Left, 3: Back-Left, 4: Back-Right, 5: Front-Right
  appliedLoad: number; // Typically Max / 3
  indicatedValue: number;
  deltaLoad: number;
  characteristicValueP: number;
  errorE: number;
  correctedErrorEc: number;
  mpeLimit: number;
  status: ComplianceResult;
}

/**
 * OIML R 76-1 Clause 3.9.2 / A.5.3 Static Temperature & Zero Drift Effect
 */
export interface TemperatureTestRow {
  id: string;
  sequenceOrder: number;
  chamberTempC: number; // e.g., 20, 40, -10, 20
  soakDurationHours: number;
  zeroIndicationE0: number; // Zero error at temperature
  referenceTestLoad: number; // e.g., 0.5 Max or Max
  indicatedValueAtLoad: number;
  deltaLoadAtLoad: number;
  correctedSpanErrorEc: number;
  mpeAtLoad: number;
  zeroDriftFromPrevE: number; // ΔE0 in units of e per 5 °C (or 1 °C for Class I)
  maxPermissibleZeroDriftE: number; // 1.0 e per 5 °C (or 1 °C)
  spanStatus: ComplianceResult;
  zeroDriftStatus: ComplianceResult;
}
