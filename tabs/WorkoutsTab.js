import * as React from 'react';
import { Text, View, } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'
import WorkoutsScreen from '../screens/WorkoutsScreen'
import ProfileScreen from '../screens/ProfileScreen'
import WorkoutDetailScreen from '../screens/WorkoutDetailScreen'

const WorkoutStack = createStackNavigator();

export default function WorkoutTab({ navigation, item }) {
  return (
    <WorkoutStack.Navigator initialRouteName={"WorkoutsHome"}>
      <WorkoutStack.Screen
        name="WorkoutsHome"
        component={WorkoutsScreen}
        options={{ title: 'Workouts' }}
      />
      <WorkoutStack.Screen
        name="WorkoutDetail"
        component={WorkoutDetailScreen}
        options={{ title: 'Workout' }}
      />
    </WorkoutStack.Navigator>

  );
}