import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { colors } from '../constants'
import { ToDoScreen, HabitsScreen } from '../screens'

const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.navbar },
        headerTintColor: colors.text,
        tabBarStyle: { backgroundColor: colors.navbar, borderTopColor: colors.navbar },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tab.Screen name="To Do's" component={ToDoScreen} />
      <Tab.Screen name="Habits" component={HabitsScreen} />
    </Tab.Navigator>
  )
}

export default TabNavigator
