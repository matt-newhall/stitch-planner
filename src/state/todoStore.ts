import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Task } from '../types'
import storageAdapter from './storage'
import { todayISO } from '../utils'

type TodoState = {
  readonly tasks: Task[]
  addTask: (title: string, scheduledDate?: string) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
}

const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      tasks: [],

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
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        })),

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
