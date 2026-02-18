import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Dimensions, Keyboard, Platform, StyleSheet, View } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import ConfettiCannon from 'react-native-confetti-cannon'
import { TaskItem, TaskInput, DaySelector, EmptyState } from '../../components'
import { colors } from '../../constants'
import { shiftDate } from '../../utils'
import type { Task } from '../../types'
import useToDoScreen from './ToDoScreen.hook'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height
const CONFETTI_COLORS = [colors.accent, '#F3E5F5', '#CE93D8', '#E1BEE7', '#FFFFFF']

const ToDoScreen = () => {
  const { tasks, emptyStateVariant, selectedDate, setSelectedDate, handleAdd, handleToggle, handleDelete } = useToDoScreen()
  const [bottomPadding, setBottomPadding] = useState(0)
  const confettiRef = useRef<ConfettiCannon>(null)
  const slideAnim = useRef(new Animated.Value(0)).current
  const opacityAnim = useRef(new Animated.Value(1)).current
  const swipeDirectionRef = useRef(0)
  const selectedDateRef = useRef(selectedDate)
  selectedDateRef.current = selectedDate

  const swipeGesture = useMemo(() =>
    Gesture.Pan()
      .activeOffsetX([-15, 15])
      .failOffsetY([-10, 10])
      .onEnd((event) => {
        const { translationX, velocityX } = event
        if (Math.abs(velocityX) > 500 && Math.abs(translationX) > 60) {
          const direction = translationX > 0 ? -1 : 1
          swipeDirectionRef.current = direction
          setSelectedDate(shiftDate(selectedDateRef.current, direction))
        }
      })
  , [])

  useEffect(() => {
    if (swipeDirectionRef.current === 0) return
    slideAnim.setValue(swipeDirectionRef.current * SCREEN_WIDTH * 0.3)
    opacityAnim.setValue(0)
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 180, friction: 22 }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 160, useNativeDriver: true }),
    ]).start()
  }, [selectedDate])

  const handleToggleWithConfetti = useCallback((id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (task && !task.completed) {
      confettiRef.current?.start()
    }
    handleToggle(id)
  }, [tasks, handleToggle])

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setBottomPadding(e.endCoordinates.height - 48)
    })
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setBottomPadding(0)
    })

    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [])

  const renderItem = ({ item }: { item: Task }) => (
    <TaskItem
      task={item}
      onToggle={() => handleToggleWithConfetti(item.id)}
      onDelete={() => handleDelete(item.id)}
    />
  )

  return (
    <View style={[styles.container, { paddingBottom: bottomPadding }]}>
      <View style={styles.listWrapper}>
        <DaySelector selectedDate={selectedDate} onSelect={setSelectedDate} />
        <View style={[styles.divider, styles.dividerTop]} />
        <GestureDetector gesture={swipeGesture}>
          <Animated.View style={[styles.gestureArea, { transform: [{ translateX: slideAnim }], opacity: opacityAnim }]}>
            {emptyStateVariant !== null ? (
              <EmptyState variant={emptyStateVariant} />
            ) : (
              <FlashList
                data={tasks}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                style={styles.flashList}
                keyboardShouldPersistTaps="always"
              />
            )}
          </Animated.View>
        </GestureDetector>
      </View>
      <View style={[styles.divider, styles.dividerBottom]} />
      <TaskInput onSubmit={handleAdd} defaultDate={selectedDate} />
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
  gestureArea: {
    flex: 1,
  },
  flashList: {
    flex: 1,
    paddingTop: 8
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
  dividerBottom: {
    marginBottom: 2,
    marginTop: 16,
  },
})

export default ToDoScreen
