import { todayISO, shiftDate } from './date'

/**
 * Computes the current streak from completed and failed day records.
 * Iterates backwards from today, counting days in completedDays and stopping
 * at the first failed day. Days in neither set are treated as neutral (no tasks).
 */
export const computeStreak = (
  completedDays: readonly string[],
  failedDays: readonly string[],
): number => {
  const completedSet = new Set(completedDays)
  const failedSet = new Set(failedDays)
  const allDays = [...completedDays, ...failedDays]
  if (allDays.length === 0) return 0

  const earliest = allDays.reduce((a, b) => (a < b ? a : b))
  let streak = 0
  let d = todayISO()

  while (d >= earliest) {
    if (failedSet.has(d)) break
    if (completedSet.has(d)) streak++
    d = shiftDate(d, -1)
  }

  return streak
}
