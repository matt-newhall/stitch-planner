import { HabitCadenceOption } from '../types'
import type { HabitStack } from '../types'

/**
 * Returns true if a habit stack is due on the given ISO date.
 * Will not fire before the stack's startDate.
 * For fortnightly cadence, only fires on even-numbered weeks since startDate.
 */
export const isHabitStackDueOnDate = (stack: HabitStack, isoDate: string): boolean => {
  if (isoDate < stack.startDate) return false

  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const dayOfWeek = date.getDay()  // 0=Sun, 1=Mon, …, 6=Sat

  if (!stack.cadence.days.includes(dayOfWeek)) return false

  if (stack.cadence.type === HabitCadenceOption.Fortnightly) {
    const [sy, sm, sd] = stack.startDate.split('-').map(Number)
    const start = new Date(sy, sm - 1, sd)
    const msPerWeek = 7 * 24 * 60 * 60 * 1000
    const weeksDiff = Math.floor((date.getTime() - start.getTime()) / msPerWeek)
    return weeksDiff % 2 === 0
  }

  return true
}
