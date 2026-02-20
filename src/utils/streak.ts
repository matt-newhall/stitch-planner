import { todayISO, shiftDate } from './date'
import { isHabitStackDueOnDate } from './habit'
import type { HabitStack } from '../types/habit'

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

/**
 * Computes the current streak for a single habit stack.
 * Days the habit isn't scheduled are neutral and don't affect the streak.
 * Past days where the habit was due but not completed break the streak.
 * Today is never counted as a break even if not yet completed.
 */
export const computeHabitStreak = (
  stackId: string,
  stack: HabitStack,
  completedHabits: Record<string, string[]>,
): number => {
  const today = todayISO()
  let streak = 0
  let d = today

  while (d >= stack.startDate) {
    if (isHabitStackDueOnDate(stack, d)) {
      const completed = (completedHabits[d] ?? []).includes(stackId)
      if (completed) {
        streak++
      } else if (d < today) {
        break
      }
    }
    d = shiftDate(d, -1)
  }

  return streak
}
