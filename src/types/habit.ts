export enum HabitCadenceOption {
  Daily = 'daily',
  Weekdays = 'weekdays',
  Weekends = 'weekends',
  Weekly = 'weekly',
  Fortnightly = 'fortnightly',
}

export type HabitCadence = {
  readonly type: HabitCadenceOption
  readonly days: readonly number[]  // 0=Sun, 1=Mon, ..., 6=Sat
}

export type HabitDraft = {
  behaviour?: string
  time?: string
  location?: string
}

export type Habit = {
  readonly id: string
  readonly behaviour: string
  readonly time: string
  readonly location: string
}

export type HabitStack = {
  readonly id: string
  readonly habits: readonly Habit[]
  readonly cadence: HabitCadence
  readonly startDate: string  // ISO date — only show on/after this date
}
