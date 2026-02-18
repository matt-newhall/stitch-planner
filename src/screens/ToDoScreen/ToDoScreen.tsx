import { useEffect, useState } from 'react'
import { Keyboard, Platform, StyleSheet, View } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { TaskItem, TaskInput, DaySelector } from '../../components'
import { colors } from '../../constants'
import type { Task } from '../../types'
import useToDoScreen from './ToDoScreen.hook'

const ToDoScreen = () => {
  const { tasks, selectedDate, setSelectedDate, handleAdd, handleToggle, handleDelete } = useToDoScreen()
  const [bottomPadding, setBottomPadding] = useState(0)

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
      onToggle={() => handleToggle(item.id)}
      onDelete={() => handleDelete(item.id)}
    />
  )

  return (
    <View style={[styles.container, { paddingBottom: bottomPadding }]}>
      <View style={styles.listWrapper}>
        <DaySelector selectedDate={selectedDate} onSelect={setSelectedDate} />
        <View style={[styles.divider, styles.dividerTop]} />
        <FlashList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.flashList}
          keyboardShouldPersistTaps="always"
        />
      </View>
      <View style={[styles.divider, styles.dividerBottom]} />
      <TaskInput onSubmit={handleAdd} defaultDate={selectedDate} />
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
