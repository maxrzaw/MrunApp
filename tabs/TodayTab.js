import * as React from 'react';
import { Text, View } from 'react-native';
import SuggestionScreen from '../screens/SuggestionScreen'

import { createStackNavigator } from '@react-navigation/stack'

const TodayStack = createStackNavigator();

export default function TodayTab({ navigation }) {
  return (
    <TodayStack.Navigator>
      <TodayStack.Screen
        name="Home"
        component={SuggestionScreen}
        options={{title: 'Workout Suggestions'}}
      />
    </TodayStack.Navigator>
  );
}