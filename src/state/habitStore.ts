import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { HabitStack } from '../types/habit'
import storageAdapter from './storage'

type HabitState = {
  readonly stacks: HabitStack[]
  readonly completedHabits: Record<string, string[]>
  addHabit: (stack: HabitStack) => void
  updateHabit: (id: string, updates: Partial<Pick<HabitStack, 'habits' | 'cadence'>>) => void
  removeHabit: (id: string) => void
  reorderHabits: (newStacks: HabitStack[]) => void
  toggleHabitCompletion: (stackId: string, isoDate: string) => void
}

const useHabitStore = create<HabitState>()(
  persist(
    (set) => ({
      stacks: [],
      completedHabits: {},
      addHabit: (stack) => set((state) => ({ stacks: [stack, ...state.stacks] })),
      updateHabit: (id, updates) =>
        set((state) => ({
          stacks: state.stacks.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        })),
      removeHabit: (id) => set((state) => ({ stacks: state.stacks.filter((s) => s.id !== id) })),
      reorderHabits: (newStacks) => set({ stacks: newStacks }),
      toggleHabitCompletion: (stackId, isoDate) =>
        set((state) => {
          const existing = state.completedHabits[isoDate] ?? []
          const isCompleted = existing.includes(stackId)
          return {
            completedHabits: {
              ...state.completedHabits,
              [isoDate]: isCompleted
                ? existing.filter((id) => id !== stackId)
                : [...existing, stackId],
            },
          }
        }),
    }),
    {
      name: 'habit-storage',
      storage: createJSONStorage(() => storageAdapter),
    },
  ),
)

export default useHabitStore
