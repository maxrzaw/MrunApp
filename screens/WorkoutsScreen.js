import * as React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, Alert } from 'react-native';
import Workout from '../components/Workout';
import { AuthContext } from '../contexts/AuthContext';
import { BASE_URL } from '../helpers';
import { ButtonGroup } from 'react-native-elements';




export default function WorkoutScreen({ navigation }) {

  const { token, user: loggedUser } = React.useContext(AuthContext);

  const buttons = ['All', 'Track', 'Speed', 'Hill', 'Long', 'Core'];
  const groups = {
    1: 'T',
    2: 'S',
    3: 'H',
    4: 'L',
    5: 'C',
  }

  const [state, setState] = useState({
    data: null,
    next: 1,
    refreshing: false,
    selectedIndex: 1,
  });

  const handleDelete = async (workout_id) => {
    try {
      let response = await fetch(`${BASE_URL}workouts/${workout_id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + token
        },
      });

      // Wait for the response data
      if (response.ok) {
        setState({
          ...state,
          data: state.data.filter(item => item.id != workout_id),
        });
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Unable to reach the server");
    }
  };

  const getData = async () => {
    if (state.next != null) {
      let filter = '';
      if (state.selectedIndex > 0) {
        filter = `&type=${groups[state.selectedIndex]}`
      }
      try {
        let response = await fetch(BASE_URL + `workouts/?page=${state.next}` + filter, {
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
    <Workout
      item={item}
      navigation={navigation}
      deleteItem={handleDelete}
      loggedUser={loggedUser}
    />
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


  // This handles refreshing once index is changed
  useEffect(() => {
    getData();
  }, [state.selectedIndex])

  const updateIndex = (index) => {
    setState({
      ...state,
      selectedIndex: index,
      next: 1,
    });
  }


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'stretch' }}>
      <ButtonGroup
        selectedIndex={state.selectedIndex}
        buttons={buttons}
        containerStyle={styles.BtnGroup}
        onPress={(val) => updateIndex(val)}
      />
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

styles = StyleSheet.create({
  BtnGroup: {
    height: 35,
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 0,
  },
});