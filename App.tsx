import { DarkTheme, NavigationContainer } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { colors } from './src/constants'
import { RootNavigator } from './src/navigation'

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.navbar,
    primary: colors.accent,
    text: colors.text,
    border: colors.navbar,
  },
}

const App = () => {
  return (
    <NavigationContainer theme={navTheme}>
      <RootNavigator />
      <StatusBar style="light" />
    </NavigationContainer>
  )
}

export default App
