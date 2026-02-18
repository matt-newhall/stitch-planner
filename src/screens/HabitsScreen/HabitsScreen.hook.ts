import { useState } from 'react'
import type { Habit, HabitStack } from '../../types'

type HabitDraft = {
  behaviour: string
  time: string
  location: string
}

let nextId = 0
const genId = () => `habit-${Date.now()}-${nextId++}`

/**
 * Manages local habit stack state and modal visibility for the HabitsScreen
 */
const useHabitsScreen = () => {
  const [stacks, setStacks] = useState<HabitStack[]>([])
  const [modalVisible, setModalVisible] = useState(false)

  const openModal = () => setModalVisible(true)
  const closeModal = () => setModalVisible(false)

  const addStack = (drafts: HabitDraft[]) => {
    const habits: Habit[] = drafts.map((d) => ({
      id: genId(),
      behaviour: d.behaviour.trim(),
      time: d.time.trim(),
      location: d.location.trim(),
    }))

    const stack: HabitStack = {
      id: genId(),
      habits,
    }

    setStacks((prev) => [stack, ...prev])
    closeModal()
  }

  return { stacks, modalVisible, openModal, closeModal, addStack }
}

export default useHabitsScreen
