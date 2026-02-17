import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { colors, fonts } from '../constants'
import { ToDoScreen, HabitsScreen } from '../screens'

const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.navbar },
        headerTitleAlign: 'center',
        headerTintColor: colors.text,
        headerTitleStyle: { fontFamily: fonts.semiBold },
        tabBarStyle: { backgroundColor: colors.navbar, borderTopColor: colors.navbar },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { fontFamily: fonts.regular },
      }}
    >
      <Tab.Screen
        name="To Do's"
        component={ToDoScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bullseye-arrow" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Habits"
        component={HabitsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="atom" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default TabNavigator
