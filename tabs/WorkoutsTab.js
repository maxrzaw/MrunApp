import * as React from 'react';
import { Text, View, } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'
import WorkoutsScreen from '../screens/WorkoutsScreen'
import ProfileScreen from '../screens/ProfileScreen'

const WorkoutStack = createStackNavigator();

export default function WorkoutTab({ navigation, item }) {
    return (
      <WorkoutStack.Navigator initialRouteName={"WorkoutsHome"}>
        <WorkoutStack.Screen 
          name="WorkoutsHome" 
          component={WorkoutsScreen}
          options={{ title: 'Workouts' }}
        />
      </WorkoutStack.Navigator>
      
    );
  }