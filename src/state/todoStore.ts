import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Task } from '../types/task'
import storageAdapter from './storage'
import { todayISO } from '../utils/date'

type TodoState = {
  readonly tasks: Task[]
  readonly completedDays: readonly string[]
  readonly failedDays: readonly string[]
  readonly lastActiveDate: string | null
  addTask: (title: string, scheduledDate?: string) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  reconcileDay: () => void
}

const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      tasks: [],
      completedDays: [],
      failedDays: [],
      lastActiveDate: null,

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
          completedDays: state.completedDays.filter((d) => d !== scheduledDate),
        })),

      toggleTask: (id) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === id)
          if (!task) return state

          const nowCompleting = !task.completed
          const updatedTasks = state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          )

          if (nowCompleting) {
            const allDoneForDate = updatedTasks
              .filter((t) => t.scheduledDate === task.scheduledDate)
              .every((t) => t.completed)
            const completedDays = allDoneForDate && !state.completedDays.includes(task.scheduledDate)
              ? [...state.completedDays, task.scheduledDate]
              : state.completedDays
            return { tasks: updatedTasks, completedDays }
          } else {
            return {
              tasks: updatedTasks,
              completedDays: state.completedDays.filter((d) => d !== task.scheduledDate),
            }
          }
        }),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      reconcileDay: () =>
        set((state) => {
          const today = todayISO()
          if (state.lastActiveDate === today) return state

          const incompletePast = state.tasks.filter(
            (t) => t.scheduledDate < today && !t.completed
          )

          if (incompletePast.length === 0) {
            return { lastActiveDate: today }
          }

          const failedDates = [...new Set(incompletePast.map((t) => t.scheduledDate))]
          return {
            tasks: state.tasks.map((t) =>
              t.scheduledDate < today && !t.completed ? { ...t, scheduledDate: today } : t
            ),
            failedDays: [...new Set([...state.failedDays, ...failedDates])],
            completedDays: state.completedDays.filter((d) => !failedDates.includes(d)),
            lastActiveDate: today,
          }
        }),
    }),
    {
      name: 'todo-storage',
      storage: createJSONStorage(() => storageAdapter),
    },
  ),
)

export default useTodoStore
