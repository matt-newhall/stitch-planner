export enum EmptyStateVariant {
  Empty = 'empty',
  AllDone = 'allDone',
}

export type Task = {
  readonly id: string
  readonly title: string
  readonly completed: boolean
  readonly createdAt: number
  readonly scheduledDate: string
}
