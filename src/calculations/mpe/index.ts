import { AccuracyClass } from '../../models';

/**
 * OIML R 76-1 Table 6: Maximum Permissible Errors (MPE) for Loads m (in verification scale intervals e)
 *
 * Initial Verification MPE:
 * - ± 0.5 e : Class I (0 <= m <= 50,000), Class II (0 <= m <= 5,000), Class III (0 <= m <= 500), Class IIII (0 <= m <= 50)
 * - ± 1.0 e : Class I (50,000 < m <= 200,000), Class II (5,000 < m <= 20,000), Class III (500 < m <= 2,000), Class IIII (50 < m <= 200)
 * - ± 1.5 e : Class I (200,000 < m), Class II (20,000 < m), Class III (2,000 < m <= 10,000), Class IIII (200 < m <= 1,000)
 *
 * Note: For In-Service Inspection (Clause 3.5.2), MPE limits are twice the initial verification limits.
 */
export interface MpeStepThresholds {
  step1MaxE: number; // ±0.5e upper bound in e
  step2MaxE: number; // ±1.0e upper bound in e
}

export function getMpeStepThresholds(accuracyClass: AccuracyClass): MpeStepThresholds {
  switch (accuracyClass) {
    case 'Class I':
      return { step1MaxE: 50000, step2MaxE: 200000 };
    case 'Class II':
      return { step1MaxE: 5000, step2MaxE: 20000 };
    case 'Class III':
      return { step1MaxE: 500, step2MaxE: 2000 };
    case 'Class IIII':
      return { step1MaxE: 50, step2MaxE: 200 };
  }
}

export function calculateMpeFactorInE(
  appliedLoad: number,
  e: number,
  accuracyClass: AccuracyClass,
  inServiceMultiplier = 1
): number {
  if (e <= 0 || appliedLoad < 0) return 0;
  const m = appliedLoad / e;
  const { step1MaxE, step2MaxE } = getMpeStepThresholds(accuracyClass);

  let baseFactor: number;
  if (m <= step1MaxE + 1e-9) {
    baseFactor = 0.5;
  } else if (m <= step2MaxE + 1e-9) {
    baseFactor = 1.0;
  } else {
    baseFactor = 1.5;
  }

  return Number((baseFactor * inServiceMultiplier).toFixed(4));
}

export function calculateMpeValue(
  appliedLoad: number,
  e: number,
  accuracyClass: AccuracyClass,
  inServiceMultiplier = 1
): number {
  if (e <= 0 || appliedLoad < 0) return 0;
  const factor = calculateMpeFactorInE(appliedLoad, e, accuracyClass, inServiceMultiplier);
  return Number((factor * e).toFixed(6));
}
