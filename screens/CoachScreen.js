import * as React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Alert, Pressable, FlatList } from 'react-native';
import Suggestion from '../components/Suggestion';
import DateHeader from '../components/DateHeader';
import { AuthContext } from '../contexts/AuthContext';
import { BASE_URL, handleNetworkError } from '../helpers';
import axios from 'axios';

export default function CoachScreen({ navigation }) {

  const { token, user: loggedUser } = React.useContext(AuthContext);

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  useEffect(() => {
    return () => {
      source.cancel('Clean up from Suggestion Screen');
    }
  }, []);

  const axiosSuggestionBase = axios.create({
    baseURL: `${BASE_URL}/suggestions`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + token
    },
    timeout: 5000,
    cancelToken: source.token,
  });

  const [selectedDate, setSelectedDate] = useState(new Date());


  const [state, setState] = useState({
    notFound: true,
    disableButtons: false,
    refreshing: true,
  });

  const getSuggestion = async (date = selectedDate) => {
    try {
      let dateShort = date.toISOString().split('T')[0];
      let response = await axiosSuggestionBase.get(`/?date=${dateShort}`);
      let response_data = await response.data;
      // There is a suggestion for selected day
      setState({
        ...state,
        suggestions: response_data,
        notFound: false,
        disableButtons: false,
        refreshing: false,
      });
    } catch (error) {
      if (error.response && error.response.status != 404) {
        // 404 are pretty common here so we ignore them kinda
        handleNetworkError(error);
      }
      // No suggestion for selected day
      setState({
        ...state,
        suggestions: null,
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
    getSuggestion(date = value);
  }

  // Initial load of data
  useEffect(() => {
    getSuggestion();
  }, []);

  const renderItem = ({ item }) => (
    <Suggestion
      item={item}
      navigation={navigation}
      deleteItem={handleDelete}
      loggedUser={loggedUser}
    />
  );

  const listEmptyComponent = () => {
    return (
      <Text style={{ alignSelf: 'center', marginTop: 20 }}>
        No suggestions on selected date :(
      </Text>
    )
  }

  const onRefresh = () => {
    setState({
      ...state,
      suggestions: null,
      refreshing: true,
    });
  }

  useEffect(() => {
    if (state.refreshing) {
      getSuggestion();
    }
  }, [state.refreshing]);

  const handleDelete = async (id) => {
    try {
      let response = await axiosSuggestionBase.delete(`/${id}/`);
      // Wait for the response data
      if (response.status == 204) {
        setState({
          ...state,
          suggestions: state.suggestions.filter(item => item.id != id),
        });
      }
    } catch (error) {
      handleNetworkError(error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'stretch' }}>
      <DateHeader
        initialDate={new Date()}
        onDateChange={onDateChange}
        disableButtons={state.disableButtons}
      />
      <FlatList
        data={state.suggestions}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        onRefresh={() => onRefresh()}
        refreshing={state.refreshing}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={listEmptyComponent}
      />
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