import { StyleSheet, Text, View } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { colors, fonts } from '../../constants'
import type { HabitStack } from '../../types'

type Props = {
  readonly habitStack: HabitStack
}

/**
 * Renders a habit stack as a card showing the anchor habit and any stacked habits
 */
const HabitCard = ({ habitStack }: Props) => {
  const [anchor, ...stacked] = habitStack.habits

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <View style={styles.row}>
          <MaterialCommunityIcons
            name="lightning-bolt"
            color={colors.accent}
            size={20}
          />
          <Text style={styles.sentence}>
            I will{' '}
            <Text style={styles.highlight}>{anchor.behaviour}</Text>
            {' '}at{' '}
            <Text style={styles.highlight}>{anchor.time}</Text>
            {' '}in{' '}
            <Text style={styles.highlight}>{anchor.location}</Text>
          </Text>
        </View>

        {stacked.map((habit, index) => (
          <View key={habit.id} style={styles.stackedRow}>
            <MaterialCommunityIcons
              name="link-variant"
              color={colors.textSecondary}
              size={16}
            />
            <Text style={styles.stackedSentence}>
              After{' '}
              <Text style={styles.highlight}>
                {habitStack.habits[index].behaviour}
              </Text>
              , I will{' '}
              <Text style={styles.highlight}>{habit.behaviour}</Text>
            </Text>
          </View>
        ))}
      </View>
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
