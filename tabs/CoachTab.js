import * as React from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import { BASE_URL, handleNetworkError } from '../helpers';
import { AuthContext } from '../contexts/AuthContext';
// import CoachScreen from '../screens/CoachScreen';
import axios from 'axios';

import { createStackNavigator } from '@react-navigation/stack';

// const TodayStack = createStackNavigator();


export default function CoachTab({ navigation }) {

  const { token } = React.useContext(AuthContext);

  const axiosBase = axios.create({
    baseURL: 'http://localhost/api/v1/',
    timeout: 3000,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    }
  });

  const send = async () => {
    try {
      // const response = await axiosBase.get('activities/');
      const response = await axios({
        method: 'GET',
        url: 'http://localhost/api/v1/activities/',
        // url: `http://example.com:81`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        timeout: 5000,
      });
      console.log(response.status);
    } catch (error) {
      handleNetworkError(error);
    }
  }




  return (
    <>
      <View style={styles.container}>
        <Text>Coach Screen</Text>
      </View>
      <Button
        title="Send Request"
        onPress={() => send()}
      />

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