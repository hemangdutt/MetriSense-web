import { AccuracyClass, ErrorObservationRow } from '../../models';
import {
  calculateCharacteristicValueP,
  calculateCorrectedErrorEc,
  calculateMpeValue,
  calculateUncorrectedErrorE,
} from '../../calculations';

/**
 * Recalculates an array of Weighing Performance (Error of Indication) rows per OIML R 76-1 Clause 3.5.1 & A.4.4
 */
export function evaluateErrorObservationRows(
  rows: ErrorObservationRow[],
  e: number,
  accuracyClass: AccuracyClass,
  inServiceMultiplier = 1
): ErrorObservationRow[] {
  // Find initial zero error E0 (first row where appliedLoad === 0)
  const zeroRow = rows.find((r) => r.appliedLoad === 0);
  const zeroErrorE0 = zeroRow
    ? calculateUncorrectedErrorE(zeroRow.indicatedValue, 0, zeroRow.deltaLoad, e)
    : 0;

  return rows.map((row, idx) => {
    const P = calculateCharacteristicValueP(row.indicatedValue, row.deltaLoad, e);
    const E = calculateUncorrectedErrorE(row.indicatedValue, row.appliedLoad, row.deltaLoad, e);
    const Ec = row.appliedLoad === 0 ? E : calculateCorrectedErrorEc(E, zeroErrorE0);
    const mpeLimit =
      row.appliedLoad === 0
        ? Number((0.25 * e).toFixed(6)) // Clause 4.5.2 Zero-setting accuracy ≤ ±0.25e
        : calculateMpeValue(row.appliedLoad, e, accuracyClass, inServiceMultiplier);

    const passed = Math.abs(Ec) <= mpeLimit + 1e-9;

    return {
      ...row,
      stepIndex: idx + 1,
      characteristicValueP: P,
      uncorrectedErrorE: E,
      correctedErrorEc: Ec,
      mpeLimit,
      status: passed ? 'PASS' : 'FAIL',
    };
  });
}

/**
 * Generates standard OIML R 76-1 Annex A.4.4.1 load stages (Increasing + Decreasing) for a given instrument
 */
export function generateStandardErrorLoadSchedule(
  minCapacity: number,
  maxCapacity: number,
  e: number,
  accuracyClass: AccuracyClass
): ErrorObservationRow[] {
  const halfDelta = Number((0.5 * e).toFixed(6));

  let step1Load = 500 * e;
  let step2Load = 2000 * e;
  if (accuracyClass === 'Class I') {
    step1Load = 50000 * e;
    step2Load = 200000 * e;
  } else if (accuracyClass === 'Class II') {
    step1Load = 5000 * e;
    step2Load = 20000 * e;
  } else if (accuracyClass === 'Class IIII') {
    step1Load = 50 * e;
    step2Load = 200 * e;
  }

  const candidateLoads = [
    { label: 'Zero (0 e)', load: 0 },
    { label: `Min (${minCapacity})`, load: minCapacity },
    { label: `Step 1 MPE Boundary (${step1Load})`, load: Math.min(step1Load, maxCapacity * 0.4) },
    { label: `0.5 Max (${Number((maxCapacity * 0.5).toFixed(4))})`, load: Number((maxCapacity * 0.5).toFixed(4)) },
    { label: `Step 2 MPE Boundary (${step2Load})`, load: Math.min(step2Load, Number((maxCapacity * 0.8).toFixed(4))) },
    { label: `Max (${maxCapacity})`, load: maxCapacity },
  ];

  // Deduplicate ascending loads
  const uniqueIncreasing: { label: string; load: number }[] = [];
  for (const item of candidateLoads) {
    if (
      item.load <= maxCapacity &&
      !uniqueIncreasing.some((u) => Math.abs(u.load - item.load) < 1e-9)
    ) {
      uniqueIncreasing.push(item);
    }
  }
  uniqueIncreasing.sort((a, b) => a.load - b.load);

  const rows: ErrorObservationRow[] = [];

  uniqueIncreasing.forEach((pt, idx) => {
    rows.push({
      id: `err-inc-${idx + 1}`,
      stepIndex: rows.length + 1,
      loadLabel: pt.label,
      direction: 'INCREASING',
      appliedLoad: pt.load,
      indicatedValue: pt.load,
      deltaLoad: halfDelta,
      characteristicValueP: pt.load,
      uncorrectedErrorE: 0,
      correctedErrorEc: 0,
      mpeLimit: 0,
      status: 'PASS',
    });
  });

  // Decreasing loads (excluding Max, down to Zero)
  const decreasingPoints = [...uniqueIncreasing].reverse().slice(1);
  decreasingPoints.forEach((pt, idx) => {
    rows.push({
      id: `err-dec-${idx + 1}`,
      stepIndex: rows.length + 1,
      loadLabel: `${pt.label} (Unloading)`,
      direction: 'DECREASING',
      appliedLoad: pt.load,
      indicatedValue: pt.load,
      deltaLoad: halfDelta,
      characteristicValueP: pt.load,
      uncorrectedErrorE: 0,
      correctedErrorEc: 0,
      mpeLimit: 0,
      status: 'PASS',
    });
  });

  return evaluateErrorObservationRows(rows, e, accuracyClass, 1);
}
