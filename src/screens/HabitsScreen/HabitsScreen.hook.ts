import { useEffect, useState } from 'react'
import useHabitStore from '../../state/habitStore'
import { todayISO } from '../../utils/date'
import { isHabitStackDueOnDate } from '../../utils/habit'
import type { Habit, HabitCadence, HabitDraft, HabitStack } from '../../types/habit'

let nextId = 0
const genId = () => `habit-${Date.now()}-${nextId++}`

/**
 * Manages habit state, modal visibility, and card expansion for HabitsScreen.
 * Persists stacks via Zustand and filters to habits due on the selected date.
 * Expanded card collapses automatically on date change.
 */
const useHabitsScreen = () => {
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [deleteSheetVisible, setDeleteSheetVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState(todayISO())
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null)
  const [editingStack, setEditingStack] = useState<HabitStack | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const { stacks, addHabit, removeHabit, reorderHabits, completedHabits, toggleHabitCompletion } = useHabitStore()

  const selectedDateStacks = stacks.filter((s) => isHabitStackDueOnDate(s, selectedDate))
  const completedHabitIds = completedHabits[selectedDate] ?? []

  useEffect(() => {
    setExpandedCardId(null)
  }, [selectedDate])

  const openAddModal = () => setAddModalVisible(true)
  const closeAddModal = () => setAddModalVisible(false)
  const closeEditModal = () => setEditModalVisible(false)

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
    closeAddModal()
  }

  const handleCardExpand = (id: string) => {
    setExpandedCardId((prev) => (prev === id ? null : id))
  }

  const handleEditPress = (stack: HabitStack) => {
    setEditingStack(stack)
    setEditModalVisible(true)
    setExpandedCardId(null)
  }

  const handleDeletePress = (id: string) => {
    setDeleteTargetId(id)
    setDeleteSheetVisible(true)
    setExpandedCardId(null)
  }

  const handleDeleteConfirm = () => {
    if (deleteTargetId) removeHabit(deleteTargetId)
    setDeleteTargetId(null)
    setDeleteSheetVisible(false)
  }

  const handleDeleteCancel = () => {
    setDeleteTargetId(null)
    setDeleteSheetVisible(false)
  }

  /**
   * Applies a new order for the currently visible (filtered) stacks back into the global
   * stacks array using the interleave approach: non-visible stacks stay at their original
   * positions; visible stacks are replaced in-place with the new filtered order.
   */
  const handleReorderHabits = (newFilteredOrder: HabitStack[]) => {
    const filteredIds = new Set(selectedDateStacks.map((s) => s.id))
    const filteredIndices: number[] = []
    stacks.forEach((s, i) => {
      if (filteredIds.has(s.id)) filteredIndices.push(i)
    })
    const newStacks = [...stacks]
    filteredIndices.forEach((globalIdx, filteredIdx) => {
      newStacks[globalIdx] = newFilteredOrder[filteredIdx]
    })
    reorderHabits(newStacks)
  }

  return {
    selectedDateStacks,
    selectedDate,
    setSelectedDate,
    addModalVisible,
    editModalVisible,
    deleteSheetVisible,
    openAddModal,
    closeAddModal,
    closeEditModal,
    addHabit: handleAddHabit,
    completedHabitIds,
    toggleCompletion: handleToggleCompletion,
    expandedCardId,
    editingStack,
    handleCardExpand,
    handleEditPress,
    handleDeletePress,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleReorderHabits,
  }
}

export default useHabitsScreen
