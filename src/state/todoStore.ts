import { create } from 'zustand'
import type { Task } from '../types'

type TodoState = {
  readonly tasks: Task[]
  addTask: (title: string) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
}

/**
 * Zustand store for managing todo tasks
 */
const useTodoStore = create<TodoState>((set) => ({
  tasks: [],

  addTask: (title) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          id: Date.now().toString(),
          title,
          completed: false,
          createdAt: Date.now(),
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
}))

export default useTodoStore
