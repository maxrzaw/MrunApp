import * as React from 'react';
import { Text, View } from 'react-native';
import Workout from '../../components/Workout'


export default function HomeScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'stretch' }}>
        <Workout/>
        <Workout/>
      </View>
    );
  }