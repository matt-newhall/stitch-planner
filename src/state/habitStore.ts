import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { HabitStack } from '../types'
import storageAdapter from './storage'

type HabitState = {
  readonly stacks: HabitStack[]
  addHabit: (stack: HabitStack) => void
  removeHabit: (id: string) => void
}

const useHabitStore = create<HabitState>()(
  persist(
    (set) => ({
      stacks: [],
      addHabit: (stack) => set((state) => ({ stacks: [stack, ...state.stacks] })),
      removeHabit: (id) => set((state) => ({ stacks: state.stacks.filter((s) => s.id !== id) })),
    }),
    {
      name: 'habit-storage',
      storage: createJSONStorage(() => storageAdapter),
    },
  ),
)

export default useHabitStore
