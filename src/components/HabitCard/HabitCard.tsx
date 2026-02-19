import { Pressable, StyleSheet, Text, View } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { colors, fonts } from '../../constants'
import type { HabitStack } from '../../types'

type Props = {
  readonly habitStack: HabitStack
  readonly isCompleted: boolean
  readonly onToggle: () => void
}

/**
 * Renders a habit stack as a card showing the anchor habit and any stacked habits.
 * Tapping the card toggles its completed state for the day.
 */
const HabitCard = ({ habitStack, isCompleted, onToggle }: Props) => {
  const [anchor, ...stacked] = habitStack.habits

  return (
    <View style={styles.wrapper}>
      <Pressable style={[styles.card, isCompleted && styles.cardCompleted]} onPress={onToggle}>
        <View style={styles.row}>
          <MaterialCommunityIcons
            name="lightning-bolt"
            color={isCompleted ? colors.textSecondary : colors.accent}
            size={20}
          />
          <Text style={[styles.sentence, isCompleted && styles.completedText]}>
            I will{' '}
            <Text style={[styles.highlight, isCompleted && styles.completedHighlight]}>{anchor.behaviour}</Text>
            {' '}at{' '}
            <Text style={[styles.highlight, isCompleted && styles.completedHighlight]}>{anchor.time}</Text>
            {' '}in{' '}
            <Text style={[styles.highlight, isCompleted && styles.completedHighlight]}>{anchor.location}</Text>
          </Text>
          <MaterialCommunityIcons
            name={isCompleted ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
            color={isCompleted ? colors.accent : colors.textSecondary}
            size={20}
          />
        </View>

        {stacked.map((habit, index) => (
          <View key={habit.id} style={styles.stackedRow}>
            <MaterialCommunityIcons
              name="link-variant"
              color={colors.textSecondary}
              size={16}
            />
            <Text style={[styles.stackedSentence, isCompleted && styles.completedText]}>
              After{' '}
              <Text style={[styles.highlight, isCompleted && styles.completedHighlight]}>
                {habitStack.habits[index].behaviour}
              </Text>
              , I will{' '}
              <Text style={[styles.highlight, isCompleted && styles.completedHighlight]}>{habit.behaviour}</Text>
            </Text>
          </View>
        ))}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  card: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.navbar,
    borderRadius: 12,
    gap: 10,
  },
  cardCompleted: {
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  sentence: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    fontFamily: fonts.regular,
    lineHeight: 22,
  },
  highlight: {
    color: colors.accent,
    fontFamily: fonts.semiBold,
  },
  completedText: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  completedHighlight: {
    color: colors.textSecondary,
  },
  stackedRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingLeft: 6,
  },
  stackedSentence: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    lineHeight: 20,
  },
})

export default HabitCard
