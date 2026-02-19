import { useMemo } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { DaySelector, HabitCard } from '../../components'
import { AddHabitModal } from '../../modals'
import { colors, fonts } from '../../constants'
import { getDayOptions } from '../../utils'
import type { HabitStack } from '../../types'
import useHabitsScreen from './HabitsScreen.hook'

const HabitsScreen = () => {
  const {
    selectedDateStacks,
    selectedDate,
    setSelectedDate,
    modalVisible,
    openModal,
    closeModal,
    addHabit,
  } = useHabitsScreen()

  const dayOptions = useMemo(() => getDayOptions(14), [])

  const renderItem = ({ item }: { item: HabitStack }) => (
    <HabitCard habitStack={item} />
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
})

export default HabitsScreen
