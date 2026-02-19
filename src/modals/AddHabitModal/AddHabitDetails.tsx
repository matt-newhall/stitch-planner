import { ScrollView, StyleSheet, Text, TextInput, Pressable, View } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { COLORS, FONTS } from '../../constants/theme'
import type { HabitDraft } from '../../types/habit'

type Props = {
  readonly habits: HabitDraft[]
  readonly canStack: boolean
  readonly onUpdateBehaviour: (index: number, value: string) => void
  readonly onUpdateTime: (value: string) => void
  readonly onUpdateLocation: (value: string) => void
  readonly onAddStack: () => void
  readonly onRemoveStack: (index: number) => void
}

/**
 * Step 1 of AddHabitModal — anchor habit inputs (behaviour, time, location)
 * plus optional habit stacking.
 */
const AddHabitDetails = ({
  habits,
  canStack,
  onUpdateBehaviour,
  onUpdateTime,
  onUpdateLocation,
  onAddStack,
  onRemoveStack,
}: Props) => (
  <ScrollView
    style={styles.body}
    contentContainerStyle={styles.bodyContent}
    keyboardShouldPersistTaps="handled"
  >
    <Text style={styles.label}>I will...</Text>
    <TextInput
      style={styles.input}
      placeholder="Behaviour (e.g. read for 10 minutes)"
      placeholderTextColor={COLORS.textSecondary}
      value={habits[0].behaviour ?? ''}
      onChangeText={(v) => onUpdateBehaviour(0, v)}
    />

    <Text style={styles.label}>At...</Text>
    <TextInput
      style={styles.input}
      placeholder="Time (e.g. when I wake up)"
      placeholderTextColor={COLORS.textSecondary}
      value={habits[0].time ?? ''}
      onChangeText={onUpdateTime}
    />

    <Text style={styles.label}>In...</Text>
    <TextInput
      style={styles.input}
      placeholder="Location (e.g. my bedroom)"
      placeholderTextColor={COLORS.textSecondary}
      value={habits[0].location ?? ''}
      onChangeText={onUpdateLocation}
    />

    {habits.slice(1).map((habit, i) => {
      const index = i + 1
      return (
        <View key={index} style={styles.stackedSection}>
          <View style={styles.stackedHeader}>
            <Text style={styles.stackedLabel}>
              After {habits[index - 1].behaviour || '...'}, I will...
            </Text>
            <Pressable onPress={() => onRemoveStack(index)} hitSlop={8}>
              <MaterialCommunityIcons
                name="minus-circle-outline"
                color={COLORS.textSecondary}
                size={20}
              />
            </Pressable>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Behaviour (e.g. make my bed)"
            placeholderTextColor={COLORS.textSecondary}
            value={habit.behaviour ?? ''}
            onChangeText={(v) => onUpdateBehaviour(index, v)}
          />
        </View>
      )
    })}

    {canStack && (
      <Pressable style={styles.addStackButton} onPress={onAddStack}>
        <MaterialCommunityIcons name="plus-circle-outline" color={COLORS.accent} size={20} />
        <Text style={styles.addStackText}>Stack another habit</Text>
      </Pressable>
    )}
  </ScrollView>
)

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 20,
  },
  bodyContent: {
    paddingBottom: 8,
  },
  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: FONTS.semiBold,
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.navbar,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: COLORS.text,
    fontFamily: FONTS.regular,
  },
  stackedSection: {
    marginTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.navbar,
    paddingTop: 16,
  },
  stackedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stackedLabel: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: FONTS.semiBold,
  },
  addStackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    alignSelf: 'center',
  },
  addStackText: {
    fontSize: 14,
    color: COLORS.accent,
    fontFamily: FONTS.semiBold,
  },
})

export default AddHabitDetails
