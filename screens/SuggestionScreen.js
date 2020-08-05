import * as React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import Workout from '../components/Workout';
import DateHeader from '../components/DateHeader';
import { AuthContext } from '../contexts/AuthContext';
import { BASE_URL } from '../helpers';




export default function SuggestionScreen({ navigation }) {

  const item = {
    id: 15,
    title: "8x40m",
    description: "8 by 40m with 4 min rest. These are for speed and I reccomend wearing spikes if possible.",
    category: "S",
    owner: 8,
  }

  const { token, group, user } = React.useContext(AuthContext);
  const { is_staff } = user;


  const groups = {
    0: 'None',
    1: 'Short Sprints',
    2: 'Long Sprints',
    3: 'Distance',
    4: 'Scrubs',
  }

  const [state, setState] = useState({
    workout: null,
    notFound: true,
    disableButtons: false,
  });

  tempDate = new Date();
  const getSuggestion = async (date = tempDate, _group = group.id) => {
    let dateShort = date.toISOString().split('T')[0];

    try {

      let response = await fetch(`${BASE_URL}suggestions/?group=${_group}&date=${dateShort}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      });
      let response_data = await response.json();
      if (response.ok) {
        // There is a suggestion for selected day
        setState({
          ...state,
          workout: response_data,
          notFound: false,
          disableButtons: false,
        });
      } else {
        // No suggestion for selected day
        setState({
          ...state,
          workout: null,
          notFound: true,
          disableButtons: false,
        });
      }

    } catch (error) {
      console.log(error);
    }
  }

  const onDateChange = async (value) => {
    setState({
      ...state,
      disableButtons: true,
    });
    getSuggestion(date = value);
  }

  // Initial load of data
  useEffect(() => {
    getSuggestion();
  }, []);


  if (!group.id || group.id == 0) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Join a group from Profile to see suggestions</Text>
    </View>
    )
  }

  return (
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'stretch' }}>
      <DateHeader
        initialDate={new Date()}
        onDateChange={onDateChange}
        disableButtons={state.disableButtons}
      />
      {
        state.notFound
          ?
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>No Suggested Workouts on selected Day</Text>
          </View>
          
          :
          <Workout
            item={state.workout}
            disableDelete={true}
            loggedUser={user}
            navigation={navigation}
          />
      }

      {/* <Workout
        item={item}
        disableDelete={true}
        loggedUser={user}
        navigation={navigation}
      />
      <Workout
        item={item}
        disableDelete={true}
        loggedUser={user}
        navigation={navigation}
      /> */}

    </View>
  );
}

styles = StyleSheet.create({

});