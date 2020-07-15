import * as React from 'react';
import { useState, useEffect } from 'react'
import { Text, View, FlatList } from 'react-native';
import Workout from '../components/Workout'

import { TextInput, Alert, Button } from 'react-native'
workouts = [
  { "id": 1, "title": "Test workout", "description": "This is a test workout", "category": "T", "owner": 2 },
  { "id": 2, "title": "4x400m", "description": "4 min rest between reps.\nI don't recommend wearing spikes for these.", "category": "T", "owner": 1 },
  { "id": 3, "title": "Lots of 100s", "description": "Run 100m and rest for 20 sec then run 100m again.\nDo this for 20-30 reps.", "category": "T", "owner": 1 },
  { "id": 4, "title": "Lots of 100s", "description": "Run 100m and rest for 20 sec then run 100m again.\nDo this for 20-30 reps.", "category": "T", "owner": 1 },
  { "id": 5, "title": "600s", "description": "4x600m 4 min rest.", "category": "T", "owner": 8 },
  { "id": 9, "title": "test workout.", "description": "This is made from the activity summary.", "category": "T", "owner": 1 },
  { "id": 10, "title": "400s", "description": "run lots of 400s.", "category": "T", "owner": 1 },
  { "id": 11, "title": "400s", "description": "run lots of 400s.", "category": "T", "owner": 1 },
];




export default function WorkoutScreen({ navigation }) {
  const [state, setState] = useState({
    data: workouts,
    page: 1,
  });

  const renderItem = ({ item }) => (
    <Workout item={item} navigation={navigation}/> 
  );


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'stretch' }}>
      <FlatList
        data={state.data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
}