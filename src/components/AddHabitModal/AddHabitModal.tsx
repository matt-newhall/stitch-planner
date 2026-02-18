import { useEffect, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { colors, fonts } from '../../constants'

const MAX_STACK_SIZE = 5
const SCREEN_HEIGHT = Dimensions.get('window').height
const ANIM_DURATION = 300

type HabitDraft = {
  behaviour: string
  time: string
  location: string
}

type Props = {
  readonly visible: boolean
  readonly onClose: () => void
  readonly onSubmit: (habits: HabitDraft[]) => void
}

const emptyAnchor = (): HabitDraft => ({ behaviour: '', time: '', location: '' })
const emptyStacked = (): HabitDraft => ({ behaviour: '', time: '', location: '' })

/**
 * Modal for creating a new habit or habit stack
 */
const AddHabitModal = ({ visible, onClose, onSubmit }: Props) => {
  const [habits, setHabits] = useState<HabitDraft[]>([emptyAnchor()])
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      fadeAnim.setValue(0)
      slideAnim.setValue(SCREEN_HEIGHT)
    }
  }, [visible, fadeAnim, slideAnim])

  const updateHabit = (index: number, field: keyof HabitDraft, value: string) => {
    setHabits((prev) =>
      prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)),
    )
  }

  const addStackedHabit = () => {
    if (habits.length >= MAX_STACK_SIZE) return
    setHabits((prev) => [...prev, emptyStacked()])
  }

  const removeStackedHabit = (index: number) => {
    setHabits((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDone = () => {
    const anchor = habits[0]
    if (!anchor.behaviour.trim() || !anchor.time.trim() || !anchor.location.trim()) return

    const hasInvalidStacked = habits
      .slice(1)
      .some((h) => !h.behaviour.trim())
    if (hasInvalidStacked) return

    onSubmit(habits)
    setHabits([emptyAnchor()])
  }

  const animateClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: ANIM_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: ANIM_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setHabits([emptyAnchor()])
      onClose()
    })
  }

  return (
    <Modal visible={visible} animationType="none" transparent>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={animateClose}>
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.7)']}
              style={StyleSheet.absoluteFill}
            />
          </Pressable>
        </Animated.View>

        <Animated.View
          style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>New Habit</Text>
            <Pressable onPress={animateClose} hitSlop={8}>
              <MaterialCommunityIcons name="close" color={colors.text} size={24} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.label}>I will...</Text>
            <TextInput
              style={styles.input}
              placeholder="Behaviour (e.g. read for 10 minutes)"
              placeholderTextColor={colors.textSecondary}
              value={habits[0].behaviour}
              onChangeText={(v) => updateHabit(0, 'behaviour', v)}
            />

            <Text style={styles.label}>At...</Text>
            <TextInput
              style={styles.input}
              placeholder="Time (e.g. when I wake up)"
              placeholderTextColor={colors.textSecondary}
              value={habits[0].time}
              onChangeText={(v) => updateHabit(0, 'time', v)}
            />

            <Text style={styles.label}>In...</Text>
            <TextInput
              style={styles.input}
              placeholder="Location (e.g. my bedroom)"
              placeholderTextColor={colors.textSecondary}
              value={habits[0].location}
              onChangeText={(v) => updateHabit(0, 'location', v)}
            />

            {habits.slice(1).map((habit, i) => {
              const index = i + 1
              return (
                <View key={index} style={styles.stackedSection}>
                  <View style={styles.stackedHeader}>
                    <Text style={styles.stackedLabel}>
                      After {habits[index - 1].behaviour || '...'}, I will...
                    </Text>
                    <Pressable onPress={() => removeStackedHabit(index)} hitSlop={8}>
                      <MaterialCommunityIcons
                        name="minus-circle-outline"
                        color={colors.textSecondary}
                        size={20}
                      />
                    </Pressable>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Behaviour (e.g. make my bed)"
                    placeholderTextColor={colors.textSecondary}
                    value={habit.behaviour}
                    onChangeText={(v) => updateHabit(index, 'behaviour', v)}
                  />
                </View>
              )
            })}

            {habits.length < MAX_STACK_SIZE && (
              <Pressable style={styles.addStackButton} onPress={addStackedHabit}>
                <MaterialCommunityIcons
                  name="plus-circle-outline"
                  color={colors.accent}
                  size={20}
                />
                <Text style={styles.addStackText}>Stack another habit</Text>
              </Pressable>
            )}
          </ScrollView>

          <Pressable style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.doneText}>Done</Text>
          </Pressable>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    color: colors.text,
    fontFamily: fonts.bold,
  },
  body: {
    paddingHorizontal: 20,
  },
  bodyContent: {
    paddingBottom: 8,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: fonts.semiBold,
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.navbar,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.text,
    fontFamily: fonts.regular,
  },
  stackedSection: {
    marginTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.navbar,
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
    color: colors.textSecondary,
    fontFamily: fonts.semiBold,
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
    color: colors.accent,
    fontFamily: fonts.semiBold,
  },
  doneButton: {
    backgroundColor: colors.accent,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 32,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneText: {
    fontSize: 16,
    color: colors.background,
    fontFamily: fonts.bold,
  },
})

export default AddHabitModal
