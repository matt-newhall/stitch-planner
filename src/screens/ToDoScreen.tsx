import { StyleSheet, Text, View } from 'react-native'
import { colors } from '../constants'

const ToDoScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>To Do's</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
})

export default ToDoScreen
