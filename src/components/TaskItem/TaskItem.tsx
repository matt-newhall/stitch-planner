import { useEffect, useRef } from 'react'
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native'
import { Swipeable } from 'react-native-gesture-handler'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { COLORS, FONTS } from '../../constants/theme'
import type { Task } from '../../types'

type Props = {
  readonly task: Task
  readonly onToggle: () => void
  readonly onDelete: () => void
}

/**
 * Renders a pill-shaped task card with right-aligned checkbox and swipe-to-delete
 */
const TaskItem = ({ task, onToggle, onDelete }: Props) => {
  const checkScale = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (task.completed) {
      Animated.sequence([
        Animated.spring(checkScale, { toValue: 1.35, useNativeDriver: true, tension: 300, friction: 5 }),
        Animated.spring(checkScale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 6 }),
      ]).start()
    }
  }, [task.completed])
  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const opacity = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    })

    return (
      <Animated.View style={[styles.deleteAction, { opacity }]}>
        <Pressable onPress={onDelete} style={styles.deleteButton}>
          <MaterialCommunityIcons name="trash-can-outline" color={COLORS.text} size={22} />
        </Pressable>
      </Animated.View>
    )
  }

  return (
    <View style={styles.wrapper}>
      <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
        <View style={styles.pill}>
          <Text style={[styles.title, task.completed && styles.completed]}>
            {task.title}
          </Text>
          <Pressable onPress={onToggle} hitSlop={8}>
            <Animated.View style={{ transform: [{ scale: checkScale }] }}>
              <MaterialCommunityIcons
                name={task.completed ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                color={task.completed ? COLORS.accent : COLORS.textSecondary}
                size={26}
              />
            </Animated.View>
          </Pressable>
        </View>
      </Swipeable>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: COLORS.navbar,
    borderRadius: 12,
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    fontFamily: FONTS.regular,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  deleteAction: {
    justifyContent: 'center',
    backgroundColor: '#E53935',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  deleteButton: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    height: '100%',
  },
})

export default TaskItem
