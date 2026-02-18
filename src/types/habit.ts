export type Habit = {
  readonly id: string
  readonly behaviour: string
  readonly time: string
  readonly location: string
}

export type HabitStack = {
  readonly id: string
  readonly habits: readonly Habit[]
}
