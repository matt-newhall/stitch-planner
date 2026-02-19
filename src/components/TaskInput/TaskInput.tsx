import { useEffect, useRef, useState } from 'react'
import { Animated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { COLORS, FONTS } from '../../constants/theme'
import { getDayLabel } from '../../utils'
import DaySelector from '../DaySelector/DaySelector'

type Props = {
  readonly onSubmit: (title: string, scheduledDate: string) => void
  readonly defaultDate: string
}

/**
 * Inline text input pinned to the bottom of the task list for adding new tasks.
 * Includes a tappable date chip that reveals an animated day selector above it.
 */
const TaskInput = ({ onSubmit, defaultDate }: Props) => {
  const [text, setText] = useState('')
  const [scheduledDate, setScheduledDate] = useState(defaultDate)
  const [pickerVisible, setPickerVisible] = useState(false)
  const pickerAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    setScheduledDate(defaultDate)
  }, [defaultDate])

  const openPicker = () => {
    setPickerVisible(true)
    pickerAnim.setValue(0)
    Animated.timing(pickerAnim, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start()
  }

  const closePicker = () => {
    Animated.timing(pickerAnim, {
      toValue: 0,
      duration: 160,
      useNativeDriver: true,
    }).start(() => setPickerVisible(false))
  }

  const handleSubmit = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onSubmit(trimmed, scheduledDate)
    setText('')
    if (pickerVisible) closePicker()
  }

  const handleDateSelect = (date: string) => {
    setScheduledDate(date)
    closePicker()
  }

  const translateY = pickerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  })

  return (
    <View>
      <View style={styles.pickerPanel}>
        <View style={styles.divider} />
        {pickerVisible && (
          <Animated.View style={[{ opacity: pickerAnim, transform: [{ translateY }] }]}>
            <DaySelector
              selectedDate={scheduledDate}
              onSelect={handleDateSelect}
              contentContainerStyle={styles.dateSelectorContent}
            />
          </Animated.View>
        )}
      </View>
      <View style={styles.wrapper}>
        <View style={styles.pill}>
          <MaterialCommunityIcons name="plus" color={COLORS.textSecondary} size={22} />
          <TextInput
            style={styles.input}
            placeholder="Add a task..."
            placeholderTextColor={COLORS.textSecondary}
            value={text}
            onChangeText={setText}
            onSubmitEditing={handleSubmit}
            submitBehavior="submit"
            returnKeyType="done"
          />
          <Pressable
            style={styles.dateChip}
            onPress={() => (pickerVisible ? closePicker() : openPicker())}
            hitSlop={8}
          >
            <Text style={styles.dateChipText}>{getDayLabel(scheduledDate)}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  pickerPanel: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
  },
  divider: {
    width: '70%',
    alignSelf: 'center',
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.textSecondary,
    opacity: 0.4,
    marginTop: 16,
  },
  dateSelectorContent: {
    paddingBottom: 2,
  },
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.background,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.navbar,
    borderRadius: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    fontFamily: FONTS.regular,
  },
  dateChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
  },
  dateChipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: FONTS.semiBold,
  },
})

export default TaskInput
