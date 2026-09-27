/**
 * OIML R 76-1 Annex A.4.4.3 / Clause 3.5 Error of Indication Calculations
 *
 * Prior to rounding (changeover point method with ΔL):
 *   P = I + 0.5 * e - ΔL
 *   E = P - L = I + 0.5 * e - ΔL - L
 *
 * When direct high-resolution reading is used (ΔL === 0):
 *   P = I
 *   E = I - L
 *
 * Corrected Error (accounting for error at zero E0):
 *   Ec = E - E0
 */

export function calculateCharacteristicValueP(
  indicatedValue: number,
  deltaLoad: number,
  e: number
): number {
  if (deltaLoad > 0 && e > 0) {
    return Number((indicatedValue + 0.5 * e - deltaLoad).toFixed(6));
  }
  return Number(indicatedValue.toFixed(6));
}

export function calculateUncorrectedErrorE(
  indicatedValue: number,
  appliedLoad: number,
  deltaLoad: number,
  e: number
): number {
  const P = calculateCharacteristicValueP(indicatedValue, appliedLoad >= 0 ? deltaLoad : 0, e);
  return Number((P - appliedLoad).toFixed(6));
}

export function calculateCorrectedErrorEc(
  uncorrectedErrorE: number,
  zeroErrorE0: number
): number {
  return Number((uncorrectedErrorE - zeroErrorE0).toFixed(6));
}

export function calculateHysteresis(
  increasingErrorEc: number,
  decreasingErrorEc: number
): number {
  return Number(Math.abs(decreasingErrorEc - increasingErrorEc).toFixed(6));
}
