import { AccuracyClass, TemperatureTestRow } from '../../models';
import {
  calculateCorrectedErrorEc,
  calculateMpeValue,
  calculateNormalizedZeroDriftInE,
  calculateUncorrectedErrorE,
} from '../../calculations';

/**
 * OIML R 76-1 Clause 3.9.2.1 / 3.9.2.2 / 3.9.2.3: Static Temperature & Zero Drift Rules
 * - Instruments must respect MPE across their rated temperature limits (typically -10 °C to +40 °C for Class III/IIII).
 * - Zero indication shall not vary by more than 1 e per 5 °C (Class II, III, IIII) or per 1 °C (Class I).
 */
export function evaluateTemperatureTestRows(
  rows: TemperatureTestRow[],
  e: number,
  accuracyClass: AccuracyClass
): TemperatureTestRow[] {
  const stepIntervalC = accuracyClass === 'Class I' ? 1 : 5;

  return rows.map((row, idx) => {
    const rawE = calculateUncorrectedErrorE(
      row.indicatedValueAtLoad,
      row.referenceTestLoad,
      row.deltaLoadAtLoad,
      e
    );
    const Ec = calculateCorrectedErrorEc(rawE, row.zeroIndicationE0);
    const mpeAtLoad = calculateMpeValue(row.referenceTestLoad, e, accuracyClass, 1);
    const spanPassed = Math.abs(Ec) <= mpeAtLoad + 1e-9;

    let zeroDriftInE = 0;
    if (idx > 0) {
      const prev = rows[idx - 1];
      zeroDriftInE = calculateNormalizedZeroDriftInE(
        prev.zeroIndicationE0,
        row.zeroIndicationE0,
        prev.chamberTempC,
        row.chamberTempC,
        e,
        stepIntervalC
      );
    }
    const zeroDriftPassed = zeroDriftInE <= 1.0 + 1e-9;

    return {
      ...row,
      sequenceOrder: idx + 1,
      correctedSpanErrorEc: Ec,
      mpeAtLoad,
      zeroDriftFromPrevE: zeroDriftInE,
      maxPermissibleZeroDriftE: 1.0,
      spanStatus: spanPassed ? 'PASS' : 'FAIL',
      zeroDriftStatus: zeroDriftPassed ? 'PASS' : 'FAIL',
    };
  });
}

export function generateDefaultTemperatureRows(
  maxCapacity: number,
  e: number,
  accuracyClass: AccuracyClass,
  ratedMinC = -10,
  ratedMaxC = 40
): TemperatureTestRow[] {
  const refLoad = Number((maxCapacity * 0.5).toFixed(4));
  const halfE = Number((0.5 * e).toFixed(6));

  const stages = [
    { temp: 20, soak: 2 },
    { temp: ratedMaxC, soak: 2 },
    { temp: ratedMinC, soak: 2 },
    { temp: 20, soak: 2 },
  ];

  const rows: TemperatureTestRow[] = stages.map((st, idx) => ({
    id: `temp-st-${idx + 1}`,
    sequenceOrder: idx + 1,
    chamberTempC: st.temp,
    soakDurationHours: st.soak,
    zeroIndicationE0: 0,
    referenceTestLoad: refLoad,
    indicatedValueAtLoad: refLoad,
    deltaLoadAtLoad: halfE,
    correctedSpanErrorEc: 0,
    mpeAtLoad: 0,
    zeroDriftFromPrevE: 0,
    maxPermissibleZeroDriftE: 1.0,
    spanStatus: 'PASS',
    zeroDriftStatus: 'PASS',
  }));

  return evaluateTemperatureTestRows(rows, e, accuracyClass);
}
