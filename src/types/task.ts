export enum EmptyStateVariant {
  TodoEmpty = 'todoEmpty',
  TodoAllDone = 'todoAllDone',
  HabitsEmpty = 'habitsEmpty',
}

export type Task = {
  readonly id: string
  readonly title: string
  readonly completed: boolean
  readonly createdAt: number
  readonly scheduledDate: string
}
