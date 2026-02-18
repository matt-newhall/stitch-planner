import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Task } from '../types'
import storageAdapter from './storage'
import { todayISO } from '../utils'

type TodoState = {
  readonly tasks: Task[]
  readonly lastCompletionDate: string | null
  addTask: (title: string, scheduledDate?: string) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
}

const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      tasks: [],
      lastCompletionDate: null,

      addTask: (title, scheduledDate = todayISO()) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: Date.now().toString(),
              title,
              completed: false,
              createdAt: Date.now(),
              scheduledDate,
            },
          ],
        })),

      toggleTask: (id) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === id)
          const nowCompleting = task && !task.completed
          const isNotFuture = task && task.scheduledDate <= todayISO()
          return {
            tasks: state.tasks.map((t) =>
              t.id === id ? { ...t, completed: !t.completed } : t
            ),
            lastCompletionDate:
              nowCompleting && isNotFuture ? task.scheduledDate : state.lastCompletionDate,
          }
        }),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
    }),
    {
      name: 'todo-storage',
      storage: createJSONStorage(() => storageAdapter),
    },
  ),
)

export default useTodoStore
