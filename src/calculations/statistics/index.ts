/**
 * Metrological Statistical & Thermal Drift Calculations
 */

export function calculateRange(values: number[]): {
  min: number;
  max: number;
  spread: number;
} {
  if (values.length === 0) {
    return { min: 0, max: 0, spread: 0 };
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = Number(Math.abs(max - min).toFixed(6));
  return {
    min: Number(min.toFixed(6)),
    max: Number(max.toFixed(6)),
    spread,
  };
}

export function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, v) => acc + v, 0);
  return Number((sum / values.length).toFixed(6));
}

export function calculateStandardDeviation(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = calculateMean(values);
  const sumSqDiff = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0);
  const variance = sumSqDiff / (values.length - 1);
  return Number(Math.sqrt(variance).toFixed(6));
}

/**
 * OIML R 76-1 Clause 3.9.2.3 Temperature effect on no-load indication:
 * Zero indication shall not vary by more than 1 e for a difference in ambient temperature of:
 * - 1 °C for Class I instruments
 * - 5 °C for Class II, III and IIII instruments
 *
 * Returns normalized zero drift in units of e per reference temperature interval (5 °C or 1 °C).
 */
export function calculateNormalizedZeroDriftInE(
  prevZeroError: number,
  currZeroError: number,
  prevTempC: number,
  currTempC: number,
  e: number,
  tempIntervalStepC: number // 1 for Class I, 5 for Class II/III/IIII
): number {
  const deltaT = Math.abs(currTempC - prevTempC);
  if (deltaT <= 0 || e <= 0) return 0;
  const deltaE0 = Math.abs(currZeroError - prevZeroError);
  const driftPerStepInMass = (deltaE0 / deltaT) * tempIntervalStepC;
  const driftInE = driftPerStepInMass / e;
  return Number(driftInE.toFixed(4));
}
