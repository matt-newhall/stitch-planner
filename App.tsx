import { DarkTheme, NavigationContainer } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold, Inter_900Black } from '@expo-google-fonts/inter'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { ActivityIndicator, View } from 'react-native'
import { useEffect, useState } from 'react'
import { COLORS } from './src/constants/theme'
import { RootNavigator } from './src/navigation'
import { useTodoStore } from './src/state'

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: COLORS.background,
    card: COLORS.navbar,
    primary: COLORS.accent,
    text: COLORS.text,
    border: COLORS.navbar,
  },
}

/**
 * Waits for all Zustand persisted stores to finish hydrating
 */
const useStoreHydration = () => {
  const [hydrated, setHydrated] = useState(useTodoStore.persist.hasHydrated())

  useEffect(() => {
    const unsub = useTodoStore.persist.onFinishHydration(() => setHydrated(true))
    return unsub
  }, [])

  return hydrated
}

const App = () => {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
    ...MaterialCommunityIcons.font,
  })

  const storesHydrated = useStoreHydration()

  if (!fontsLoaded || !storesHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator color={COLORS.accent} />
      </View>
    )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer theme={navTheme}>
        <RootNavigator />
        <StatusBar style="light" />
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}

export default App
