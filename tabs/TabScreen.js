import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../contexts/AuthContext';
import ActivityTab from './ActivityTab';
import ProfileTab from './ProfileTab';
import TodayTab from './TodayTab';
import WorkoutsTab from './WorkoutsTab';
import CoachTab from './CoachTab';
import { colors } from '../helpers';

const Tab = createBottomTabNavigator();

export default function TabScreen({ route }) {
  const { user } = useContext(AuthContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'ActivityTab') {
            iconName = focused
              ? 'home'
              : 'home-outline';
          } else if (route.name === 'PlanTab') {
            iconName = focused
              ? 'star-box'
              : 'star-box-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'account' : 'account-outline';
          } else if (route.name === 'WorkoutsTab') {
            iconName = 'run';
          } else if (route.name === 'CoachTab') {
            // iconName = focused
            // ? 'clipboard'
            // : 'clipboard-outline';
            iconName = focused
              ? 'whistle'
              : 'whistle-outline';
          }
          // You can return any component that you like here!
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: colors.blue,
        inactiveTintColor: colors.darkgrey,
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
        name="PlanTab"
        component={TodayTab}
        options={{ title: 'Plan' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileTab}
        options={{ title: 'Profile' }}
      />
      {user.is_staff ?
        <Tab.Screen
          name="CoachTab"
          component={CoachTab}
          options={{ title: 'Coaches' }}
        />
        : null
      }
    </Tab.Navigator>
  )
}