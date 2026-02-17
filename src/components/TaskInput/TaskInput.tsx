import { useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { colors } from '../../constants'

type Props = {
  readonly onSubmit: (title: string) => void
}

/**
 * Inline text input pinned to the bottom of the task list for adding new tasks
 */
const TaskInput = ({ onSubmit }: Props) => {
  const [text, setText] = useState('')

  const handleSubmit = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    setText('')
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.pill}>
        <MaterialCommunityIcons name="plus" color={colors.textSecondary} size={22} />
        <TextInput
          style={styles.input}
          placeholder="Add a task..."
          placeholderTextColor={colors.textSecondary}
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.background,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.navbar,
    borderRadius: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
})

export default TaskInput
