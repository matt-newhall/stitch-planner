import { ScrollView, StyleSheet, Text, Pressable, View } from 'react-native'
import { COLORS, FONTS } from '../../constants/theme'
import { HabitCadenceOption } from '../../types/habit'

const CADENCE_PRESETS: { label: string; type: HabitCadenceOption }[] = [
  { label: 'Daily', type: HabitCadenceOption.Daily },
  { label: 'Weekdays', type: HabitCadenceOption.Weekdays },
  { label: 'Weekends', type: HabitCadenceOption.Weekends },
  { label: 'Weekly', type: HabitCadenceOption.Weekly },
  { label: 'Fortnightly', type: HabitCadenceOption.Fortnightly },
]

// Mon–Sun display order; day values match JS getDay() (0=Sun)
const DOW_OPTIONS = [
  { label: 'Mon', day: 1 },
  { label: 'Tue', day: 2 },
  { label: 'Wed', day: 3 },
  { label: 'Thu', day: 4 },
  { label: 'Fri', day: 5 },
  { label: 'Sat', day: 6 },
  { label: 'Sun', day: 0 },
]

const isDayDisabled = (type: HabitCadenceOption, day: number): boolean => {
  if (type === HabitCadenceOption.Weekdays) return day === 0 || day === 6
  if (type === HabitCadenceOption.Weekends) return day >= 1 && day <= 5
  return false
}

type Props = {
  readonly cadenceType: HabitCadenceOption
  readonly selectedDays: readonly number[]
  readonly onPresetPress: (type: HabitCadenceOption) => void
  readonly onDayToggle: (day: number) => void
}

/**
 * Step 2 of HabitModalBase — cadence preset chips and day-of-week multi-select.
 */
const HabitCadence = ({ cadenceType, selectedDays, onPresetPress, onDayToggle }: Props) => (
  <View style={styles.body}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetRow}>
      {CADENCE_PRESETS.map(({ label, type }) => (
        <Pressable
          key={type}
          style={[styles.presetChip, cadenceType === type && styles.presetChipActive]}
          onPress={() => onPresetPress(type)}
        >
          <Text style={[styles.presetChipText, cadenceType === type && styles.presetChipTextActive]}>
            {label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>

    <View style={styles.dowRow}>
      {DOW_OPTIONS.map(({ label, day }) => {
        const isSelected = selectedDays.includes(day)
        const isDisabled = isDayDisabled(cadenceType, day)
        return (
          <Pressable
            key={day}
            style={[
              styles.dowChip,
              isSelected && styles.dowChipActive,
              isDisabled && styles.dowChipDisabled,
            ]}
            onPress={() => onDayToggle(day)}
            disabled={isDisabled}
          >
            <Text style={[styles.dowChipText, isSelected && styles.dowChipTextActive]}>
              {label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  </View>
)

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  presetChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: COLORS.navbar,
  },
  presetChipActive: {
    backgroundColor: COLORS.accent,
  },
  presetChipText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontFamily: FONTS.semiBold,
  },
  presetChipTextActive: {
    color: COLORS.background,
  },
  dowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  dowChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.navbar,
  },
  dowChipActive: {
    backgroundColor: COLORS.accent,
  },
  dowChipDisabled: {
    opacity: 0.3,
  },
  dowChipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: FONTS.semiBold,
  },
  dowChipTextActive: {
    color: COLORS.background,
  },
})

export default HabitCadence
