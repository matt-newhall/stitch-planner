import { useEffect, useState } from 'react'
import { Keyboard, Platform, StyleSheet, View } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { TaskItem, TaskInput } from '../../components'
import { colors } from '../../constants'
import type { Task } from '../../types'
import useToDoScreen from './ToDoScreen.hook'

const ToDoScreen = () => {
  const { tasks, handleAdd, handleToggle, handleDelete } = useToDoScreen()
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
      <FlashList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="always"
      />
      <TaskInput onSubmit={handleAdd} />
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
})

export default ToDoScreen
