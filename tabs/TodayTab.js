import * as React from 'react';
import SuggestionScreen from '../screens/SuggestionScreen';
import WorkoutDetailScreen from '../screens/WorkoutDetailScreen';

import { createStackNavigator } from '@react-navigation/stack'

const TodayStack = createStackNavigator();

export default function TodayTab({ navigation }) {
  return (
    <TodayStack.Navigator>
      <TodayStack.Screen
        name="Home"
        component={SuggestionScreen}
        options={{ title: 'Workout Suggestions' }}
      />
      <TodayStack.Screen
        name="WorkoutDetail"
        component={WorkoutDetailScreen}
        options={{ title: 'Workout Details' }}
        initialParams={{disableDelete: true}}
      />
    </TodayStack.Navigator>
  );
}