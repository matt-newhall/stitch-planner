import { todayISO } from '../../utils/date'
import type { HabitCadence, HabitDraft } from '../../types/habit'
import { HabitModalBase, useHabitModal } from '../../features'

type Props = {
  readonly visible: boolean
  readonly onClose: () => void
  readonly onSubmit: (habits: HabitDraft[], cadence: HabitCadence, startDate: string) => void
}

/**
 * Modal for creating a new habit stack.
 * Delegates form state to useHabitModal and shell/animation to HabitModalBase.
 */
const AddHabitModal = ({ visible, onClose, onSubmit }: Props) => {
  const {
    habits,
    cadenceType,
    selectedDays,
    canStack,
    reset,
    updateBehaviour,
    updateTime,
    updateLocation,
    addStackedHabit,
    removeStackedHabit,
    handlePresetPress,
    handleDayToggle,
  } = useHabitModal()

  const handleSubmit = () => {
    onSubmit(habits, { type: cadenceType, days: selectedDays }, todayISO())
  }

  return (
    <HabitModalBase
      visible={visible}
      title="New Habit"
      doneLabel="Add Habit"
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

export default AddHabitModal
