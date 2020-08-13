import * as React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Alert, Pressable } from 'react-native';
import Workout from '../components/Workout';
import DateHeader from '../components/DateHeader';
import { AuthContext } from '../contexts/AuthContext';
import { BASE_URL, handleNetworkError } from '../helpers';
import GroupModal from '../components/GroupModal';
import axios from 'axios';

export default function SuggestionScreen({ navigation }) {

  const { token, group, user, groupDict } = React.useContext(AuthContext);

  const [selectedGroup, setSelectedGroup] = useState(group.id);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [groupModalVisible, setGroupModalVisible] = useState(false);

  const onGroupChange = (groupId) => {
    setSelectedGroup(groupId);
    getSuggestion(date = selectedDate, _group = groupId);
  }

  const [state, setState] = useState({
    workout: null,
    notFound: true,
    disableButtons: false,
  });

  const getSuggestion = async (date = selectedDate, _group = selectedGroup) => {
    
    try {
      let dateShort = date.toISOString().split('T')[0];
      let response = await axios(`${BASE_URL}/suggestions/?group=${_group}&date=${dateShort}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        timeout: 5000,
      });
      let response_data = await response.data;
      // There is a suggestion for selected day
      setState({
        ...state,
        workout: response_data,
        notFound: false,
        disableButtons: false,
      });
    } catch (error) {
      handleNetworkError(error);
      // No suggestion for selected day
      setState({
        ...state,
        workout: null,
        notFound: true,
        disableButtons: false,
      });
    }
  }

  const onDateChange = async (value) => {
    setState({
      ...state,
      disableButtons: true,
    });
    setSelectedDate(value);
    getSuggestion(date = value, _group = selectedGroup);
  }

  // Initial load of data
  useEffect(() => {
    getSuggestion();
    if (!group.id || group.id == 1) {
      Alert.alert("You should join a group", "Do this by visiting Profile > Edit Profile > Training Group");
    }
  }, []);

  useEffect(() => {
    if (group.id != selectedGroup) {
      getSuggestion(date = selectedDate, _group = group.id);
      setSelectedGroup(group.id);
    }
  }, [group]);

  if (!group.id || group.id == 1) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Join a group from Profile to see suggestions</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'stretch' }}>
      <GroupModal
        onChange={onGroupChange}
        visible={groupModalVisible}
        setVisible={setGroupModalVisible}
        initialGroup={group.id}
      />
      <DateHeader
        initialDate={new Date()}
        onDateChange={onDateChange}
        disableButtons={state.disableButtons}
      />
      <Pressable onPress={() => setGroupModalVisible(true)}>
        {({ pressed }) => (
          <View style={[styles.groupHeader, pressed ? styles.headerPressedColor : styles.headerColor]}>
            <Text>Showing suggestions for {groupDict[selectedGroup].name}</Text>
            <Text>View a different group</Text>
          </View>
        )}
      </Pressable>
      {
        state.notFound
          ?
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  groupHeader: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  headerColor: {
    backgroundColor: '#0174BB',
  },
  headerPressedColor: {
    backgroundColor: '#0067AE',
  },
});