import { useState } from 'react'
import { useHabitStore } from '../../state'
import { isHabitStackDueOnDate, todayISO } from '../../utils'
import type { Habit, HabitCadence, HabitDraft, HabitStack } from '../../types'

let nextId = 0
const genId = () => `habit-${Date.now()}-${nextId++}`

/**
 * Manages habit state and modal visibility for the HabitsScreen.
 * Persists stacks via Zustand and filters to habits due on the selected date.
 */
const useHabitsScreen = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState(todayISO())
  const { stacks, addHabit, completedHabits, toggleHabitCompletion } = useHabitStore()

  const selectedDateStacks = stacks.filter((s) => isHabitStackDueOnDate(s, selectedDate))
  const completedHabitIds = completedHabits[selectedDate] ?? []

  const openModal = () => setModalVisible(true)
  const closeModal = () => setModalVisible(false)

  const handleToggleCompletion = (stackId: string) => {
    toggleHabitCompletion(stackId, selectedDate)
  }

  const handleAddHabit = (drafts: HabitDraft[], cadence: HabitCadence, startDate: string) => {
    const habits: Habit[] = drafts.map((d) => ({
      id: genId(),
      behaviour: d.behaviour?.trim() ?? '',
      time: d.time?.trim() ?? '',
      location: d.location?.trim() ?? '',
    }))

    const stack: HabitStack = {
      id: genId(),
      habits,
      cadence,
      startDate,
    }

    addHabit(stack)
    closeModal()
  }

  return {
    selectedDateStacks,
    selectedDate,
    setSelectedDate,
    modalVisible,
    openModal,
    closeModal,
    addHabit: handleAddHabit,
    completedHabitIds,
    toggleCompletion: handleToggleCompletion,
  }
}

export default useHabitsScreen
