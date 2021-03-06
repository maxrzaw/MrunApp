import * as React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, Alert } from 'react-native';
import Workout from '../components/Workout';
import { AuthContext } from '../contexts/AuthContext';
import { BASE_URL, handleNetworkError, colors } from '../helpers';
import { ButtonGroup } from 'react-native-elements';
import axios from 'axios';

export default function WorkoutScreen({ navigation }) {

  const { token, user: loggedUser } = React.useContext(AuthContext);

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  useEffect(() => {
    return () => {
      source.cancel('Clean up from Workouts Screen');
    }
  }, []);

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
    selectedIndex: 0,
  });

  const axiosWorkoutsBase = axios.create({
    baseURL: `${BASE_URL}/workouts`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + token
    },
    timeout: 5000,
    cancelToken: source.token,
  });

  const handleDelete = async (workout_id) => {
    try {
      let response = await axiosWorkoutsBase.delete(`/${workout_id}/`);
      // Wait for the response data
      if (response.status == 204) {
        setState({
          ...state,
          data: state.data.filter(item => item.id != workout_id),
        });
      }
    } catch (error) {
      handleNetworkError(error);
    }
  };

  const getData = async () => {
    if (state.next != null) {
      let filter = '';
      if (state.selectedIndex > 0) {
        filter = `&type=${groups[state.selectedIndex]}`
      }
      try {
        let response = await axiosWorkoutsBase.get(`/?page=${state.next}${filter}`);
        let result = await response.data;
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
        handleNetworkError(error);
        setState({
          ...state,
          refreshing: false,
        });
      }
    }
  }

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
        containerStyle={styles.btnGroup}
        onPress={(val) => updateIndex(val)}
        selectedButtonStyle={{backgroundColor: colors.blue}}
      />
      <FlatList
        data={state.data}
        showsVerticalScrollIndicator={false}
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

const styles = StyleSheet.create({
  btnGroup: {
    height: 35,
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 0,
  },
});