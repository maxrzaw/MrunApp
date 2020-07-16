import * as React from 'react';
import { useState, useEffect } from 'react'
import { Text, View, FlatList } from 'react-native';
import Workout from '../components/Workout'
import { UserContext } from '../components/context'
import { BASE_URL } from '../helpers'




export default function WorkoutScreen({ navigation }) {

  const { token } = React.useContext(UserContext);

  const [state, setState] = useState({
    data: null,
    next: 1,
    refreshing: false,
  });

  const getData = async () => {
    if (state.next != null) {
      try {
        let response = await fetch(BASE_URL + 'workouts/?page=' + state.next, {
          method: 'GET',
          headers: {
            'Authorization': 'Token ' + token
          },
        });
        let result = await response.json();
        setState({
          ...state,
          data:
            state.next == 1
              ? result["workouts"]
              : [...state.data, ...result["workouts"]],
          next: result["next"],
          refreshing: false,
        });
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    try {
      getData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const renderItem = ({ item }) => (
    <Workout item={item} navigation={navigation} />
  );

  const onRefresh = () => {
    setState({
      ...state,
      data: null,
      next: 1,
      refreshing: true,
    });
    
  }
  // This handles refreshing once state is updated
  useEffect(() => {
    if (state.refreshing) {
      getData();
    }
  }, [state.refreshing])


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'stretch' }}>
      <FlatList
        data={state.data}
        renderItem={renderItem}
        onRefresh={() => onRefresh()}
        refreshing={state.refreshing}
        keyExtractor={item => item.id.toString()}
        onEndReached={() => getData()}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}