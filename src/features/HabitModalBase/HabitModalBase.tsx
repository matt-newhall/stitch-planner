import { useEffect, useRef, useState } from 'react'
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { COLORS, FONTS } from '../../constants/theme'
import { SCREEN_HEIGHT } from '../../constants/layout'
import type { HabitCadenceOption, HabitDraft } from '../../types/habit'
import HabitDetails from './HabitDetails'
import HabitCadence from './HabitCadence'

const ANIM_DURATION = 300
const STEP_DURATION = 180

type Props = {
  readonly visible: boolean
  readonly title: string
  readonly doneLabel: string
  readonly onClose: () => void
  readonly onSubmit: () => void
  readonly onFullReset: () => void
  readonly habits: HabitDraft[]
  readonly cadenceType: HabitCadenceOption
  readonly selectedDays: readonly number[]
  readonly canStack: boolean
  readonly onUpdateBehaviour: (index: number, value: string) => void
  readonly onUpdateTime: (value: string) => void
  readonly onUpdateLocation: (value: string) => void
  readonly onAddStack: () => void
  readonly onRemoveStack: (index: number) => void
  readonly onPresetPress: (type: HabitCadenceOption) => void
  readonly onDayToggle: (day: number) => void
}

/**
 * Shared modal shell for creating and editing habit stacks.
 * Handles entry/exit animation, two-step flow, and step transition animation.
 * Form state is managed by the consumer via the passed props.
 */
const HabitModalBase = ({
  visible,
  title,
  doneLabel,
  onClose,
  onSubmit,
  onFullReset,
  habits,
  cadenceType,
  selectedDays,
  canStack,
  onUpdateBehaviour,
  onUpdateTime,
  onUpdateLocation,
  onAddStack,
  onRemoveStack,
  onPresetPress,
  onDayToggle,
}: Props) => {
  const [step, setStep] = useState<1 | 2>(1)
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current
  const contentFade = useRef(new Animated.Value(1)).current
  const contentSlide = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: ANIM_DURATION, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: ANIM_DURATION, useNativeDriver: true }),
      ]).start()
    } else {
      fadeAnim.setValue(0)
      slideAnim.setValue(SCREEN_HEIGHT)
    }
  }, [visible, fadeAnim, slideAnim])

  const fullReset = () => {
    setStep(1)
    onFullReset()
    contentFade.setValue(1)
    contentSlide.setValue(0)
  }

  const transitionStep = (target: 1 | 2) => {
    const outDir = target === 2 ? -24 : 24
    const inDir = target === 2 ? 24 : -24
    Animated.parallel([
      Animated.timing(contentFade, { toValue: 0, duration: STEP_DURATION, useNativeDriver: true }),
      Animated.timing(contentSlide, { toValue: outDir, duration: STEP_DURATION, useNativeDriver: true }),
    ]).start(() => {
      setStep(target)
      contentSlide.setValue(inDir)
      Animated.parallel([
        Animated.timing(contentFade, { toValue: 1, duration: STEP_DURATION, useNativeDriver: true }),
        Animated.timing(contentSlide, { toValue: 0, duration: STEP_DURATION, useNativeDriver: true }),
      ]).start()
    })
  }

  const animateClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: ANIM_DURATION, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: SCREEN_HEIGHT, duration: ANIM_DURATION, useNativeDriver: true }),
    ]).start(() => {
      fullReset()
      onClose()
    })
  }

  const handleNext = () => {
    const anchor = habits[0]
    if (!anchor.behaviour?.trim() || !anchor.time?.trim() || !anchor.location?.trim()) return
    if (habits.slice(1).some((h) => !h.behaviour?.trim())) return
    transitionStep(2)
  }

  const handleDone = () => {
    onSubmit()
    fullReset()
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
          style={[styles.sheet, { transform: [{ translateY: slideAnim }], opacity: fadeAnim }]}
        >
          <View style={styles.header}>
            {step === 2 ? (
              <Pressable onPress={() => transitionStep(1)} hitSlop={8}>
                <MaterialCommunityIcons name="chevron-left" color={COLORS.text} size={28} />
              </Pressable>
            ) : (
              <View style={styles.headerSpacer} />
            )}
            <Text style={styles.headerTitle}>{step === 1 ? title : 'Repeat'}</Text>
            <Pressable onPress={animateClose} hitSlop={8}>
              <MaterialCommunityIcons name="close" color={COLORS.text} size={24} />
            </Pressable>
          </View>

          <Animated.View
            style={{ opacity: contentFade, transform: [{ translateX: contentSlide }] }}
          >
            {step === 1 ? (
              <HabitDetails
                habits={habits}
                canStack={canStack}
                onUpdateBehaviour={onUpdateBehaviour}
                onUpdateTime={onUpdateTime}
                onUpdateLocation={onUpdateLocation}
                onAddStack={onAddStack}
                onRemoveStack={onRemoveStack}
              />
            ) : (
              <HabitCadence
                cadenceType={cadenceType}
                selectedDays={selectedDays}
                onPresetPress={onPresetPress}
                onDayToggle={onDayToggle}
              />
            )}
          </Animated.View>

          <Pressable style={styles.actionButton} onPress={step === 1 ? handleNext : handleDone}>
            <Text style={styles.actionText}>{step === 1 ? 'Next' : doneLabel}</Text>
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
    backgroundColor: COLORS.surface,
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
  headerSpacer: {
    width: 28,
  },
  headerTitle: {
    fontSize: 18,
    color: COLORS.text,
    fontFamily: FONTS.bold,
  },
  actionButton: {
    backgroundColor: COLORS.accent,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 32,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 16,
    color: COLORS.background,
    fontFamily: FONTS.bold,
  },
})

export default HabitModalBase
