import { useEffect, useRef } from 'react'
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { COLORS, FONTS } from '../../constants/theme'
import type { HabitStack } from '../../types/habit'

type Props = {
  readonly habitStack: HabitStack
  readonly isCompleted: boolean
  readonly isExpanded: boolean
  readonly onToggle: () => void
  readonly onExpand: () => void
  readonly onEditPress: () => void
  readonly onDeletePress: () => void
  readonly onLongPress?: () => void
}

/**
 * Renders a habit stack as a card showing the anchor habit and any stacked habits.
 * Tap the card body to reveal Edit and Delete actions below with an animated expand.
 * The checkbox toggles completion for the day without expanding.
 */
const HabitCard = ({ habitStack, isCompleted, isExpanded, onToggle, onExpand, onEditPress, onDeletePress, onLongPress }: Props) => {
  const [anchor, ...stacked] = habitStack.habits

  const expandAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current
  const fadeAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current

  useEffect(() => {
    const duration = isExpanded ? 220 : 160
    Animated.timing(expandAnim, { toValue: isExpanded ? 1 : 0, duration, useNativeDriver: false }).start()
    Animated.timing(fadeAnim, { toValue: isExpanded ? 1 : 0, duration, useNativeDriver: true }).start()
  }, [isExpanded])

  const actionHeight = expandAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 44] })
  const actionTranslateY = fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [8, 0] })

  return (
    <View style={styles.wrapper}>
      <Pressable style={[styles.card, isCompleted && styles.cardCompleted]} onPress={onExpand} onLongPress={onLongPress} delayLongPress={400}>
        <View style={styles.row}>
          <MaterialCommunityIcons
            name="lightning-bolt"
            color={isCompleted ? COLORS.textSecondary : COLORS.accent}
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
        </View>

        {stacked.map((habit, index) => (
          <View key={habit.id} style={styles.stackedRow}>
            <MaterialCommunityIcons
              name="link-variant"
              color={COLORS.textSecondary}
              size={16}
            />
            <Text style={[styles.stackedSentence, isCompleted && styles.completedText]}>
              After{' '}
              <Text style={[styles.highlight, isCompleted && styles.completedHighlight]}>
                {habitStack.habits[index].behaviour}
              </Text>
              , I will{' '}
              <Text style={[styles.highlight, isCompleted && styles.completedHighlight]}>
                {habit.behaviour}
              </Text>
            </Text>
          </View>
        ))}

        <Pressable onPress={onToggle} hitSlop={8} style={styles.checkbox}>
          <MaterialCommunityIcons
            name={isCompleted ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
            color={isCompleted ? COLORS.accent : COLORS.textSecondary}
            size={20}
          />
        </Pressable>
      </Pressable>

      <Animated.View style={[styles.actionsContainer, { height: actionHeight, overflow: 'hidden' }]}>
        <Animated.View
          style={[styles.actions, { opacity: fadeAnim, transform: [{ translateY: actionTranslateY }] }]}
        >
          <Pressable style={styles.actionButton} onPress={onEditPress}>
            <MaterialCommunityIcons name="pencil-outline" color={COLORS.textSecondary} size={15} />
            <Text style={styles.actionText}>Edit</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={onDeletePress}>
            <MaterialCommunityIcons name="trash-can-outline" color={COLORS.textSecondary} size={15} />
            <Text style={styles.actionText}>Delete</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 7,
    paddingBottom: 0,
  },
  card: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: COLORS.navbar,
    borderRadius: 12,
    gap: 10,
    paddingRight: 40,
  },
  cardCompleted: {
    backgroundColor: COLORS.surface,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  sentence: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    fontFamily: FONTS.regular,
    lineHeight: 22,
  },
  highlight: {
    color: COLORS.accent,
    fontFamily: FONTS.semiBold,
  },
  completedText: {
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
  },
  completedHighlight: {
    color: COLORS.textSecondary,
  },
  checkbox: {
    position: 'absolute',
    right: 12,
    top: '50%',
    paddingVertical: 14,
    transform: [{ translateY: -10 }],
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
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    lineHeight: 20,
  },
  actionsContainer: {
    overflow: 'hidden',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 6,
    paddingBottom: 6,
    height: 44,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
  },
  actionText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontFamily: FONTS.semiBold,
  },
})

export default HabitCard
