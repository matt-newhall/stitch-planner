import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { ToDoScreen, HabitsScreen } from '../screens'

const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="To Do's" component={ToDoScreen} />
      <Tab.Screen name="Habits" component={HabitsScreen} />
    </Tab.Navigator>
  )
}

export default TabNavigator
