import * as React from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import { BASE_URL, handleNetworkError } from '../helpers';
import { AuthContext } from '../contexts/AuthContext';
import CoachScreen from '../screens/CoachScreen';

import { createStackNavigator } from '@react-navigation/stack';

const CoachStack = createStackNavigator();


export default function CoachTab({ navigation }) {
  return (
    <CoachStack.Navigator>
            <CoachStack.Screen
        name="Home"
        component={CoachScreen}
        options={{ title: 'Suggestions' }}
      />

    </CoachStack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});