import { AccuracyClass, EccentricityPositionRow } from '../../models';
import {
  calculateCharacteristicValueP,
  calculateCorrectedErrorEc,
  calculateMpeValue,
  calculateUncorrectedErrorE,
} from '../../calculations';

/**
 * OIML R 76-1 Clause 3.6.2 & A.4.7: Eccentric Loading Rule
 * A load corresponding to 1/3 of the sum of Max and maximal additive tare effect
 * is applied at the 5 standard load receptor positions (1: Centre, 2: Front-Left, 3: Back-Left, 4: Back-Right, 5: Front-Right).
 * For each position, the corrected error |Ec| shall not exceed the MPE for the applied load.
 */
export function evaluateEccentricityPositions(
  rows: EccentricityPositionRow[],
  e: number,
  accuracyClass: AccuracyClass,
  zeroErrorE0 = 0,
  inServiceMultiplier = 1
): EccentricityPositionRow[] {
  return rows.map((row) => {
    const P = calculateCharacteristicValueP(row.indicatedValue, row.deltaLoad, e);
    const E = calculateUncorrectedErrorE(row.indicatedValue, row.appliedLoad, row.deltaLoad, e);
    const Ec = calculateCorrectedErrorEc(E, zeroErrorE0);
    const mpeLimit = calculateMpeValue(row.appliedLoad, e, accuracyClass, inServiceMultiplier);
    const passed = Math.abs(Ec) <= mpeLimit + 1e-9;

    return {
      ...row,
      characteristicValueP: P,
      errorE: E,
      correctedErrorEc: Ec,
      mpeLimit,
      status: passed ? 'PASS' : 'FAIL',
    };
  });
}

export function generateDefaultEccentricityRows(
  maxCapacity: number,
  e: number,
  accuracyClass: AccuracyClass
): EccentricityPositionRow[] {
  // Standard 1/3 Max rounded to nearest scale interval e
  const rawThird = maxCapacity / 3;
  const thirdLoad =
    e > 0 ? Number((Math.round(rawThird / e) * e).toFixed(4)) : Number(rawThird.toFixed(4));
  const halfE = Number((0.5 * e).toFixed(6));

  const positions: Array<{ num: 1 | 2 | 3 | 4 | 5; name: string }> = [
    { num: 1, name: 'Position 1 — Centre of Load Receptor' },
    { num: 2, name: 'Position 2 — Front-Left Quadrant' },
    { num: 3, name: 'Position 3 — Back-Left Quadrant' },
    { num: 4, name: 'Position 4 — Back-Right Quadrant' },
    { num: 5, name: 'Position 5 — Front-Right Quadrant' },
  ];

  const initial: EccentricityPositionRow[] = positions.map((pos) => ({
    id: `ecc-pos-${pos.num}`,
    positionNumber: pos.num,
    positionName: pos.name,
    appliedLoad: thirdLoad,
    indicatedValue: thirdLoad,
    deltaLoad: halfE,
    characteristicValueP: thirdLoad,
    errorE: 0,
    correctedErrorEc: 0,
    mpeLimit: 0,
    status: 'PASS',
  }));

  return evaluateEccentricityPositions(initial, e, accuracyClass, 0, 1);
}
