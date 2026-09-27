import { AccuracyClass } from '../../models';
import { calculateMpeValue, getMpeStepThresholds } from '../../calculations';

export interface MpeBandDescription {
  bandIndex: 1 | 2 | 3;
  mpeInE: string;
  loadRangeInE: string;
  loadRangeInUnit: string;
  mpeValueInUnit: number;
}

export function getMpeTableBandsForInstrument(
  accuracyClass: AccuracyClass,
  e: number,
  maxCapacity: number,
  unit: string,
  inServiceMultiplier = 1
): MpeBandDescription[] {
  const { step1MaxE, step2MaxE } = getMpeStepThresholds(accuracyClass);
  const step1Load = Number((step1MaxE * e).toFixed(4));
  const step2Load = Number((step2MaxE * e).toFixed(4));

  return [
    {
      bandIndex: 1,
      mpeInE: `± ${(0.5 * inServiceMultiplier).toFixed(1)} e`,
      loadRangeInE: `0 ≤ m ≤ ${step1MaxE.toLocaleString()} e`,
      loadRangeInUnit: `0 to ${Math.min(step1Load, maxCapacity)} ${unit}`,
      mpeValueInUnit: Number((0.5 * inServiceMultiplier * e).toFixed(6)),
    },
    {
      bandIndex: 2,
      mpeInE: `± ${(1.0 * inServiceMultiplier).toFixed(1)} e`,
      loadRangeInE: `${step1MaxE.toLocaleString()} e < m ≤ ${step2MaxE.toLocaleString()} e`,
      loadRangeInUnit: `${step1Load} to ${Math.min(step2Load, maxCapacity)} ${unit}`,
      mpeValueInUnit: Number((1.0 * inServiceMultiplier * e).toFixed(6)),
    },
    {
      bandIndex: 3,
      mpeInE: `± ${(1.5 * inServiceMultiplier).toFixed(1)} e`,
      loadRangeInE: `m > ${step2MaxE.toLocaleString()} e`,
      loadRangeInUnit: `> ${step2Load} to ${maxCapacity} ${unit}`,
      mpeValueInUnit: Number((1.5 * inServiceMultiplier * e).toFixed(6)),
    },
  ];
}

export function checkErrorWithinMpe(
  errorValue: number,
  appliedLoad: number,
  e: number,
  accuracyClass: AccuracyClass,
  inServiceMultiplier = 1
): { mpeLimit: number; passed: boolean } {
  const mpeLimit = calculateMpeValue(appliedLoad, e, accuracyClass, inServiceMultiplier);
  const passed = Math.abs(errorValue) <= mpeLimit + 1e-9;
  return { mpeLimit, passed };
}
