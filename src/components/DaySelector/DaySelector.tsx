import { useEffect, useRef } from 'react'
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { colors, fonts } from '../../constants'
import { getDayOptions } from '../../utils'

type Props = {
  readonly selectedDate: string
  readonly onSelect: (date: string) => void
  readonly contentContainerStyle?: StyleProp<ViewStyle>
}

/**
 * Horizontal scrollable row of day chips covering the next 7 days.
 * Displays "Today", "Tomorrow", then short weekday names for subsequent days.
 * Automatically scrolls to keep the selected chip visible.
 */
const DaySelector = ({ selectedDate, onSelect, contentContainerStyle }: Props) => {
  const options = getDayOptions()
  const scrollRef = useRef<ScrollView>(null)
  const offsetsRef = useRef<Map<string, number>>(new Map())

  useEffect(() => {
    const x = offsetsRef.current.get(selectedDate)
    if (x !== undefined) {
      scrollRef.current?.scrollTo({ x: Math.max(0, x - 24), animated: true })
    }
  }, [selectedDate])

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={[styles.container, contentContainerStyle]}
    >
      {options.map(({ label, date }) => (
        <Pressable
          key={date}
          onLayout={(e) => offsetsRef.current.set(date, e.nativeEvent.layout.x)}
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
