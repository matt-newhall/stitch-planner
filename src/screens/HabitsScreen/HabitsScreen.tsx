import { Pressable, StyleSheet, Text, View } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { AddHabitModal, HabitCard } from '../../components'
import { colors, fonts } from '../../constants'
import type { HabitStack } from '../../types'
import useHabitsScreen from './HabitsScreen.hook'

const HabitsScreen = () => {
  const { stacks, modalVisible, openModal, closeModal, addStack } = useHabitsScreen()

  const renderItem = ({ item }: { item: HabitStack }) => (
    <HabitCard habitStack={item} />
  )

  return (
    <View style={styles.container}>
      {stacks.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No habits yet</Text>
        </View>
      ) : (
        <FlashList
          data={stacks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}

        />
      )}

      <Pressable style={styles.fab} onPress={openModal}>
        <MaterialCommunityIcons name="plus" color={colors.background} size={28} />
      </Pressable>

      <AddHabitModal
        visible={modalVisible}
        onClose={closeModal}
        onSubmit={addStack}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
