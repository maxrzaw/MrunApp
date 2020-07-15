import * as React from 'react';
import { Text, View, Button } from 'react-native';


export default function WorkoutDetailScreen({ navigation, route: { params: { item } } }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Workout {item.id} Detail!</Text>
    </View>
  );
}