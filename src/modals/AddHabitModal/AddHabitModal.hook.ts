import { useState } from 'react'
import { HabitCadenceOption, type HabitDraft } from '../../types/habit'

const MAX_STACK_SIZE = 5

const defaultDaysForType = (type: HabitCadenceOption): number[] => {
  switch (type) {
    case HabitCadenceOption.Daily:
      return [0, 1, 2, 3, 4, 5, 6]
    case HabitCadenceOption.Weekdays:
      return [1, 2, 3, 4, 5]
    case HabitCadenceOption.Weekends:
      return [0, 6]
    case HabitCadenceOption.Weekly:
    case HabitCadenceOption.Fortnightly:
      return [new Date().getDay()]
  }
}

/**
 * Manages form state for AddHabitModal — habits, cadence, and day selection.
 * Animation and step state live in the component.
 */
const useAddHabitModal = () => {
  const [habits, setHabits] = useState<HabitDraft[]>([{}])
  const [cadenceType, setCadenceType] = useState<HabitCadenceOption>(HabitCadenceOption.Daily)
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6])

  const reset = () => {
    setHabits([{}])
    setCadenceType(HabitCadenceOption.Daily)
    setSelectedDays([0, 1, 2, 3, 4, 5, 6])
  }

  const updateField = (index: number, field: keyof HabitDraft, value: string) =>
    setHabits((prev) => prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)))

  const updateBehaviour = (index: number, value: string) => updateField(index, 'behaviour', value)
  const updateTime = (value: string) => updateField(0, 'time', value)
  const updateLocation = (value: string) => updateField(0, 'location', value)

  const addStackedHabit = () => {
    if (habits.length >= MAX_STACK_SIZE) return
    setHabits((prev) => [...prev, {}])
  }

  const removeStackedHabit = (index: number) =>
    setHabits((prev) => prev.filter((_, i) => i !== index))

  const handlePresetPress = (type: HabitCadenceOption) => {
    setCadenceType(type)
    setSelectedDays(defaultDaysForType(type))
  }

  const handleDayToggle = (day: number) => {
    const nextType = (
      cadenceType === HabitCadenceOption.Daily ||
      cadenceType === HabitCadenceOption.Weekdays ||
      cadenceType === HabitCadenceOption.Weekends
    ) ? HabitCadenceOption.Weekly : cadenceType

    const isSelected = selectedDays.includes(day)
    const nextDays = isSelected
      ? selectedDays.length > 1 ? selectedDays.filter((d) => d !== day) : selectedDays
      : [...selectedDays, day]

    setCadenceType(nextType)
    setSelectedDays(nextDays)
  }

  return {
    habits,
    cadenceType,
    selectedDays,
    canStack: habits.length < MAX_STACK_SIZE,
    reset,
    updateBehaviour,
    updateTime,
    updateLocation,
    addStackedHabit,
    removeStackedHabit,
    handlePresetPress,
    handleDayToggle,
  }
}

export default useAddHabitModal
