import { useCallback, useMemo, useRef } from 'react'
import { Animated, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import ConfettiCannon from 'react-native-confetti-cannon'
import { DaySelector, HabitCard } from '../../components'
import { AddHabitModal } from '../../modals'
import { colors, fonts } from '../../constants'
import { getDayOptions } from '../../utils'
import type { HabitStack } from '../../types'
import useHabitsScreen from './HabitsScreen.hook'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const CONFETTI_COLORS = [colors.accent, '#F3E5F5', '#CE93D8', '#E1BEE7', '#FFFFFF']
const EMOJI_X_FRACTIONS = [0.15, 0.32, 0.5, 0.68, 0.85]

const HabitsScreen = () => {
  const {
    selectedDateStacks,
    selectedDate,
    setSelectedDate,
    modalVisible,
    openModal,
    closeModal,
    addHabit,
    completedHabitIds,
    toggleCompletion,
  } = useHabitsScreen()

  const dayOptions = useMemo(() => getDayOptions(14), [])

  const confettiRef = useRef<ConfettiCannon>(null)
  const emojiAnims = useRef(
    EMOJI_X_FRACTIONS.map(() => ({
      y: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current

  const fireEmojis = useCallback(() => {
    emojiAnims.forEach((anim) => {
      anim.y.setValue(0)
      anim.opacity.setValue(1)
      Animated.parallel([
        Animated.timing(anim.y, { toValue: -150, duration: 1200, useNativeDriver: true }),
        Animated.sequence([
          Animated.delay(800),
          Animated.timing(anim.opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]),
      ]).start(() => {
      anim.opacity.setValue(0)
    })
    })
  }, [emojiAnims])

  const handleToggleWithCelebration = useCallback((stackId: string) => {
    if (!completedHabitIds.includes(stackId)) {
      confettiRef.current?.start()
      fireEmojis()
    }
    toggleCompletion(stackId)
  }, [completedHabitIds, toggleCompletion, fireEmojis])

  const renderItem = ({ item }: { item: HabitStack }) => (
    <HabitCard
      habitStack={item}
      isCompleted={completedHabitIds.includes(item.id)}
      onToggle={() => handleToggleWithCelebration(item.id)}
    />
  )

  return (
    <View style={styles.container}>
      <View style={styles.listWrapper}>
        <DaySelector selectedDate={selectedDate} onSelect={setSelectedDate} options={dayOptions} />
        <View style={[styles.divider, styles.dividerTop]} />

        {selectedDateStacks.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No habits today</Text>
          </View>
        ) : (
          <FlashList
            data={selectedDateStacks}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            extraData={completedHabitIds}
          />
        )}
      </View>

      <Pressable style={styles.fab} onPress={openModal}>
        <MaterialCommunityIcons name="plus" color={colors.background} size={28} />
      </Pressable>

      <AddHabitModal
        visible={modalVisible}
        onClose={closeModal}
        onSubmit={addHabit}
      />

      {EMOJI_X_FRACTIONS.map((xFraction, i) => (
        <Animated.View
          key={i}
          pointerEvents="none"
          style={[
            styles.floatingEmoji,
            {
              left: SCREEN_WIDTH * xFraction - 16,
              transform: [{ translateY: emojiAnims[i].y }],
              opacity: emojiAnims[i].opacity,
            },
          ]}
        >
          <Text style={styles.emojiText}>🥳</Text>
        </Animated.View>
      ))}

      <ConfettiCannon
        ref={confettiRef}
        count={80}
        origin={{ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT }}
        autoStart={false}
        fadeOut
        colors={CONFETTI_COLORS}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listWrapper: {
    flex: 1,
  },
  list: {
    paddingVertical: 8,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },
  divider: {
    width: '70%',
    alignSelf: 'center',
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.textSecondary,
    opacity: 0.4,
  },
  dividerTop: {
    marginVertical: 2,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  floatingEmoji: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.35,
    zIndex: 10,
  },
  emojiText: {
    fontSize: 32,
  },
})

export default HabitsScreen
