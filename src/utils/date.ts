/**
 * Convert JS weekday (0-6, Sunday = 0)
 * to backend weekday (Monday = 2 ... Sunday = 8)
 */
export function getCurrentWeekdayCustom(date: Date = new Date()): number {
  const jsDay = date.getDay(); // 0 (Sun) -> 6 (Sat)

  // Sunday (0) -> 8
  if (jsDay === 0) return 8;

  // Monday (1) -> 2 ... Saturday (6) -> 7
  return jsDay + 1;
}
