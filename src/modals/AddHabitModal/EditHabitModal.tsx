import { useEffect } from 'react'
import useHabitStore from '../../state/habitStore'
import type { HabitStack } from '../../types/habit'
import HabitModalBase from './HabitModalBase'
import useHabitModal from './HabitModalBase.hook'

type Props = {
  readonly visible: boolean
  readonly habitStack: HabitStack | null
  readonly onClose: () => void
}

/**
 * Modal for editing an existing habit stack.
 * Pre-populates form from the stack on open and persists changes via updateHabit.
 * Historical completions are preserved — only the stack definition is updated.
 */
const EditHabitModal = ({ visible, habitStack, onClose }: Props) => {
  const { updateHabit } = useHabitStore()

  const {
    habits,
    cadenceType,
    selectedDays,
    canStack,
    reset,
    populate,
    updateBehaviour,
    updateTime,
    updateLocation,
    addStackedHabit,
    removeStackedHabit,
    handlePresetPress,
    handleDayToggle,
  } = useHabitModal()

  useEffect(() => {
    if (visible && habitStack) populate(habitStack)
  }, [visible, habitStack])

  const handleSubmit = () => {
    if (!habitStack) return
    updateHabit(habitStack.id, {
      habits: habits.map((h, i) => ({
        id: habitStack.habits[i]?.id ?? `${habitStack.id}-${i}-${Date.now()}`,
        behaviour: h.behaviour?.trim() ?? '',
        time: h.time?.trim() ?? '',
        location: h.location?.trim() ?? '',
      })),
      cadence: { type: cadenceType, days: selectedDays },
    })
  }

  return (
    <HabitModalBase
      visible={visible}
      title="Edit Habit"
      doneLabel="Save Changes"
      onClose={onClose}
      onSubmit={handleSubmit}
      onFullReset={reset}
      habits={habits}
      cadenceType={cadenceType}
      selectedDays={selectedDays}
      canStack={canStack}
      onUpdateBehaviour={updateBehaviour}
      onUpdateTime={updateTime}
      onUpdateLocation={updateLocation}
      onAddStack={addStackedHabit}
      onRemoveStack={removeStackedHabit}
      onPresetPress={handlePresetPress}
      onDayToggle={handleDayToggle}
    />
  )
}

export default EditHabitModal
