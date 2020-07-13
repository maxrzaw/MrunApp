import * as React from 'react';
import { Text, View, } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'
import WorkoutsScreen from '../WorkoutsScreen'



export default function WorkoutTab({ navigation, item }) {
    return (
      <WorkoutsScreen/>
    );
  }