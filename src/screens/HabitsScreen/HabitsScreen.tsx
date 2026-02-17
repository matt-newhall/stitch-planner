import { StyleSheet, Text, View } from 'react-native'
import { colors, fonts } from '../../constants'

const HabitsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Habits</Text>
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
    color: colors.text,
    fontFamily: fonts.bold,
  },
})

export default HabitsScreen
