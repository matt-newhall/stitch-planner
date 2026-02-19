import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { COLORS, FONTS } from '../constants/theme'
import { ToDoScreen, HabitsScreen } from '../screens'

const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.navbar },
        headerTitleAlign: 'center',
        headerTintColor: COLORS.text,
        headerTitleStyle: { fontFamily: FONTS.semiBold },
        tabBarStyle: { backgroundColor: COLORS.navbar, borderTopColor: COLORS.navbar },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarLabelStyle: { fontFamily: FONTS.regular },
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
