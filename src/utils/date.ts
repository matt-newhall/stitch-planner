type DayOption = {
  readonly label: string
  readonly date: string
}

/**
 * Formats a Date as an ISO date string (YYYY-MM-DD) using local time,
 * avoiding UTC offset issues from toISOString().
 */
export const toISODateString = (date: Date): string => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Returns today's ISO date string (YYYY-MM-DD).
 */
export const todayISO = (): string => toISODateString(new Date())

/**
 * Returns 7 day options starting from today.
 * Labels: "Today", "Tomorrow", then short weekday names (Mon, Tue, etc.)
 */
export const getDayOptions = (): DayOption[] => {
  const today = new Date()
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const date = toISODateString(d)
    const label =
      i === 0 ? 'Today'
      : i === 1 ? 'Tomorrow'
      : d.toLocaleDateString('en-GB', { weekday: 'short' })
    return { label, date }
  })
}

/**
 * Returns a display label for an ISO date string.
 * Returns "Today", "Tomorrow", or the short weekday name.
 */
export const getDayLabel = (isoDate: string): string => {
  const today = new Date()
  const todayStr = toISODateString(today)
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const tomorrowStr = toISODateString(tomorrow)

  if (isoDate === todayStr) return 'Today'
  if (isoDate === tomorrowStr) return 'Tomorrow'

  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', { weekday: 'short' })
}
