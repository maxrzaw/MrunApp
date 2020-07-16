import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ActivityTab from './ActivityTab'
import ProfileTab from './ProfileTab'
import TodayTab from './TodayTab'
import WorkoutsTab from './WorkoutsTab'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

const Tab = createBottomTabNavigator();

export default function TabScreen({ route }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'ActivityTab') {
            iconName = focused
              ? 'home'
              : 'home-outline';
          } else if (route.name === 'TodayTab') {
            iconName = 'calendar-today';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'account' : 'account-outline';
          } else if (route.name === 'WorkoutsTab') {
            iconName = 'run';
          }

          // You can return any component that you like here!
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="ActivityTab"
        component={ActivityTab}
        options={{ title: 'Activity' }}
      />
      <Tab.Screen
        name="WorkoutsTab"
        component={WorkoutsTab}
        options={{ title: 'Workouts' }}
      />
      <Tab.Screen
        name="TodayTab"
        component={TodayTab}
        options={{ title: 'Today' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileTab}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  )
}