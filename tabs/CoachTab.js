import * as React from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import { BASE_URL, handleNetworkError } from '../helpers';
import { AuthContext } from '../contexts/AuthContext';
// import CoachScreen from '../screens/CoachScreen';

import { createStackNavigator } from '@react-navigation/stack';

// const TodayStack = createStackNavigator();


export default function CoachTab({ navigation }) {
  return (
    <>
      <View style={styles.container}>
        <Text>Coach Screen</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});