/**
 * OIML R 76-1 Clause 3.1 / Table 3 Classification Calculations
 */

/**
 * Calculate number of verification scale intervals: n = Max / e
 */
export function calculateVerificationIntervals(maxCapacity: number, e: number): number {
  if (e <= 0 || maxCapacity <= 0) return 0;
  return Math.round((maxCapacity / e) * 10000) / 10000;
}

/**
 * Calculate Minimum Capacity expressed in verification scale intervals: m_min = Min / e
 */
export function calculateMinimumCapacityInE(minCapacity: number, e: number): number {
  if (e <= 0 || minCapacity < 0) return 0;
  return Math.round((minCapacity / e) * 10000) / 10000;
}

/**
 * Convert any load L into verification scale intervals: m = L / e
 */
export function calculateLoadInE(appliedLoad: number, e: number): number {
  if (e <= 0 || appliedLoad < 0) return 0;
  return Number((appliedLoad / e).toFixed(6));
}
