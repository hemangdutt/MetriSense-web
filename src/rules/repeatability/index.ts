import {
  AccuracyClass,
  RepeatabilitySeriesSummary,
  RepeatabilityTrialRow,
} from '../../models';
import {
  calculateCharacteristicValueP,
  calculateMpeValue,
  calculateRange,
  calculateStandardDeviation,
  calculateUncorrectedErrorE,
} from '../../calculations';

/**
 * OIML R 76-1 Clause 3.6.1: Repeatability Rule
 * The difference between the largest and the smallest results of several weightings of the same load
 * shall not be greater than the absolute value of the MPE of the instrument for that load:
 *   |E_max - E_min| <= |MPE|
 */
export function evaluateRepeatabilityTrials(
  trials: RepeatabilityTrialRow[],
  e: number,
  accuracyClass: AccuracyClass,
  inServiceMultiplier = 1
): {
  updatedTrials: RepeatabilityTrialRow[];
  summaries: RepeatabilitySeriesSummary[];
} {
  const updatedTrials = trials.map((t) => {
    const P = calculateCharacteristicValueP(t.loadIndicationI, t.deltaLoad, e);
    const E = calculateUncorrectedErrorE(t.loadIndicationI, t.appliedLoad, t.deltaLoad, e);
    return {
      ...t,
      characteristicValueP: P,
      errorE: E,
    };
  });

  const seriesNames: Array<'Half Max (~0.5 Max)' | 'Near Max (~Max)'> = [
    'Half Max (~0.5 Max)',
    'Near Max (~Max)',
  ];

  const summaries: RepeatabilitySeriesSummary[] = seriesNames.map((label) => {
    const group = updatedTrials.filter((t) => t.seriesLabel === label);
    const appliedLoad = group[0]?.appliedLoad ?? 0;
    const errors = group.map((g) => g.errorE);
    const { min, max, spread } = calculateRange(errors);
    const stdDev = calculateStandardDeviation(errors);
    const mpeAbs = calculateMpeValue(appliedLoad, e, accuracyClass, inServiceMultiplier);
    const passed = group.length >= 3 && spread <= mpeAbs + 1e-9;

    return {
      seriesLabel: label,
      appliedLoad,
      trials: group,
      maxError: max,
      minError: min,
      spreadPMaxMinusPMin: spread,
      standardDeviation: stdDev,
      mpeAbsolute: mpeAbs,
      status: group.length === 0 ? 'PENDING' : passed ? 'PASS' : 'FAIL',
    };
  });

  return { updatedTrials, summaries };
}

export function generateDefaultRepeatabilityTrials(
  maxCapacity: number,
  e: number
): RepeatabilityTrialRow[] {
  const halfMax = Number((maxCapacity * 0.5).toFixed(4));
  const nearMax = Number((maxCapacity * 0.95).toFixed(4));
  const halfE = Number((0.5 * e).toFixed(6));

  const trials: RepeatabilityTrialRow[] = [];
  for (let i = 1; i <= 3; i++) {
    trials.push({
      id: `rep-half-${i}`,
      trialNumber: i,
      seriesLabel: 'Half Max (~0.5 Max)',
      appliedLoad: halfMax,
      zeroIndicationI0: 0,
      loadIndicationI: halfMax,
      deltaLoad: halfE,
      characteristicValueP: halfMax,
      errorE: 0,
    });
  }
  for (let i = 1; i <= 3; i++) {
    trials.push({
      id: `rep-max-${i}`,
      trialNumber: i,
      seriesLabel: 'Near Max (~Max)',
      appliedLoad: nearMax,
      zeroIndicationI0: 0,
      loadIndicationI: nearMax,
      deltaLoad: halfE,
      characteristicValueP: nearMax,
      errorE: 0,
    });
  }
  return trials;
}
