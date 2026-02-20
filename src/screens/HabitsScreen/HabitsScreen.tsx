import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { scheduleOnRN } from 'react-native-worklets'
import DraggableFlatList, { ScaleDecorator, type RenderItemParams } from 'react-native-draggable-flatlist'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import ConfettiCannon from 'react-native-confetti-cannon'
import * as Haptics from 'expo-haptics'
import { DaySelector, EmptyState, HabitCard } from '../../components'
import { AddHabitModal, EditHabitModal, DeleteConfirmSheet } from '../../modals'
import { COLORS } from '../../constants/theme'
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../constants/layout'
import { getDayOptions, shiftDate, todayISO } from '../../utils/date'
import type { HabitStack } from '../../types/habit'
import { EmptyStateVariant } from '../../types/task'
import useHabitsScreen from './HabitsScreen.hook'

const CONFETTI_COLORS = [COLORS.accent, '#F3E5F5', '#CE93D8', '#E1BEE7', '#FFFFFF']
const EMOJI_X_FRACTIONS = [0.15, 0.32, 0.5, 0.68, 0.85]

const HabitsScreen = () => {
  const {
    selectedDateStacks,
    selectedDate,
    setSelectedDate,
    addModalVisible,
    editModalVisible,
    deleteSheetVisible,
    openAddModal,
    closeAddModal,
    closeEditModal,
    addHabit,
    completedHabitIds,
    habitStreaks,
    toggleCompletion,
    expandedCardId,
    editingStack,
    handleCardExpand,
    handleEditPress,
    handleDeletePress,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleReorderHabits,
  } = useHabitsScreen()

  const dayOptions = useMemo(() => getDayOptions(14), [])

  const slideAnim = useRef(new Animated.Value(0)).current
  const opacityAnim = useRef(new Animated.Value(1)).current
  const swipeDirectionRef = useRef(0)
  const selectedDateRef = useRef(selectedDate)

  selectedDateRef.current = selectedDate

  const swipeGesture = useMemo(() => {
    const handleSwipeEnd = (translationX: number, velocityX: number) => {
      if (Math.abs(velocityX) > 300 && Math.abs(translationX) > 30) {
        const direction = translationX > 0 ? -1 : 1
        const next = shiftDate(selectedDateRef.current, direction)
        const today = todayISO()
        const max = shiftDate(today, 13)
        if (next < today || next > max) return
        swipeDirectionRef.current = direction
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        setSelectedDate(next)
      }
    }
    return Gesture.Pan()
      .activeOffsetX([-15, 15])
      .failOffsetY([-20, 20])
      .onEnd((event) => {
        scheduleOnRN(handleSwipeEnd, event.translationX, event.velocityX)
      })
  }, [])

  useEffect(() => {
    if (swipeDirectionRef.current === 0) return
    slideAnim.stopAnimation()
    slideAnim.setValue(swipeDirectionRef.current * SCREEN_WIDTH * 0.3)
    opacityAnim.setValue(0)
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 180, friction: 22 }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 160, useNativeDriver: true }),
    ]).start()
  }, [selectedDate])

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

  const renderItem = useCallback(({ item, drag }: RenderItemParams<HabitStack>) => (
    <ScaleDecorator>
      <HabitCard
        habitStack={item}
        isCompleted={completedHabitIds.includes(item.id)}
        isExpanded={expandedCardId === item.id}
        streak={habitStreaks[item.id]}
        onToggle={() => handleToggleWithCelebration(item.id)}
        onExpand={() => handleCardExpand(item.id)}
        onEditPress={() => handleEditPress(item)}
        onDeletePress={() => handleDeletePress(item.id)}
        onLongPress={expandedCardId === null ? drag : undefined}
      />
    </ScaleDecorator>
  ), [completedHabitIds, expandedCardId, habitStreaks, handleToggleWithCelebration, handleCardExpand, handleEditPress, handleDeletePress])

  return (
    <View style={styles.container}>
      <View style={styles.listWrapper}>
        <DaySelector selectedDate={selectedDate} onSelect={setSelectedDate} options={dayOptions} />
        <View style={[styles.divider, styles.dividerTop]} />

        <GestureDetector gesture={swipeGesture}>
          <Animated.View style={[styles.gestureArea, { transform: [{ translateX: slideAnim }], opacity: opacityAnim }]}>
            {selectedDateStacks.length === 0 ? (
              <EmptyState variant={EmptyStateVariant.HabitsEmpty} />
            ) : (
              <DraggableFlatList
                data={selectedDateStacks}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                onDragEnd={({ data }) => handleReorderHabits(data)}
              />
            )}
          </Animated.View>
        </GestureDetector>
      </View>

      <Pressable style={styles.fab} onPress={openAddModal}>
        <MaterialCommunityIcons name="plus" color={COLORS.background} size={28} />
      </Pressable>

      <AddHabitModal
        visible={addModalVisible}
        onClose={closeAddModal}
        onSubmit={addHabit}
      />

      <EditHabitModal
        visible={editModalVisible}
        habitStack={editingStack}
        onClose={closeEditModal}
      />

      <DeleteConfirmSheet
        visible={deleteSheetVisible}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
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
    backgroundColor: COLORS.background,
  },
  listWrapper: {
    flex: 1,
  },
  gestureArea: {
    flex: 1,
  },
  list: {
    paddingVertical: 8,
  },
  divider: {
    width: '70%',
    alignSelf: 'center',
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.textSecondary,
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
    backgroundColor: COLORS.accent,
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
