import { useEffect, useRef } from 'react'
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { colors, fonts } from '../../constants'
import { getDayOptions } from '../../utils'

type DayOption = {
  readonly label: string
  readonly date: string
}

type Props = {
  readonly selectedDate: string
  readonly onSelect: (date: string) => void
  readonly options?: readonly DayOption[]
  readonly contentContainerStyle?: StyleProp<ViewStyle>
}

/**
 * Horizontal scrollable row of day chips.
 * Defaults to the next 7 days; pass `options` to override (e.g. 14 days).
 * Automatically scrolls to keep the selected chip visible.
 */
const DaySelector = ({ selectedDate, onSelect, options: optionsProp, contentContainerStyle }: Props) => {
  const options = optionsProp ?? getDayOptions()
  const scrollRef = useRef<ScrollView>(null)
  const chipRectsRef = useRef<Map<string, { x: number; width: number }>>(new Map())
  const scrollWidthRef = useRef(0)

  useEffect(() => {
    const rect = chipRectsRef.current.get(selectedDate)
    if (rect && scrollWidthRef.current > 0) {
      const x = Math.max(0, rect.x + rect.width - scrollWidthRef.current + 24)
      scrollRef.current?.scrollTo({ x, animated: true })
    }
  }, [selectedDate])

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={[styles.container, contentContainerStyle]}
      onLayout={(e) => { scrollWidthRef.current = e.nativeEvent.layout.width }}
    >
      {options.map(({ label, date }) => (
        <Pressable
          key={date}
          onLayout={(e) => chipRectsRef.current.set(date, { x: e.nativeEvent.layout.x, width: e.nativeEvent.layout.width })}
          style={[styles.chip, selectedDate === date && styles.chipActive]}
          onPress={() => onSelect(date)}
        >
          <Text style={[styles.label, selectedDate === date && styles.labelActive]}>
            {label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 8,
  },
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.navbar,
  },
  chipActive: {
    backgroundColor: colors.accent,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: fonts.semiBold,
  },
  labelActive: {
    color: colors.background,
  },
})

export default DaySelector
