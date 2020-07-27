import React, { useState, createContext, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { BASE_URL } from '../helpers';

export const AuthContext = createContext();

const AuthContextProvider = (props) => {

  // Our pieces of state for this context
  const [state, setState] = useState({
    token: null,
    user: null,
    isLoggedIn: false,
    isLoading: true,
  });

  const [userGroup, setUserGroup] = useState(0);


  // This will only run on initial load
  useEffect(() => {
    (async () => initialLoad())();
  }, []);

  const initialLoad = async () => {
    // Check async storage for the token
    try {
      const token = await AsyncStorage.getItem('token');
      if (token !== null) {
        // Token is not null so we need to check token and get the user
        getMe(token);
        getGroup(token);
      } else {
        // Token is null so we are not logged in
        setState({
          ...state,
          token: null,
          user: null,
          isLoggedIn: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getGroup = async (token) => {
    try {
      response = await fetch(`${BASE_URL}membership/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + token,
        },
      });
      let response_data = await response.json();
      if (response.ok) {
        setUserGroup(response_data['group']);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Gets the user object and updates it
  const getMe = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
      let response = await fetch(`${BASE_URL}me/`, {
        method: 'GET',
        headers: {
          'Authorization': 'Token ' + token
        },
      });
      let user = await response.json();
      if (response.ok) {
        // Update state with user object
        setState({
          ...state,
          user: user,
          token: token,
          isLoggedIn: true,
          isLoading: false,
        });
      } else {
        // Token is bad
        setState({
          ...state,
          user: null,
          token: null,
          isLoggedIn: false,
          isLoading: false,
        });
        console.log("Something went wrong logging in");
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Sign in function
  const signIn = async (username, password) => {
    // Try logging in
    try {
      const body_data = { username, password };
      let response = await fetch(`${BASE_URL}token-auth/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body_data),
      });
      // Wait for the response and convert it do dictionary
      let response_data = await response.json();
      // If response code is ok then get the use object and update state
      if (response.ok) {
        await getMe(response_data['token']);
      } else {
        setState({
          ...state,
          token: null,
          user: null,
          isLoggedIn: false,
        });
        Alert.alert("Incorrect username or password");
      }
    } catch (error) {
      Alert.alert("Unable to reach the server");
      console.log(error);
    }
  }

  // Remove token from storage and update state
  const signOut = async () => {
    try {
      // remove token from async storage
      await AsyncStorage.removeItem('token');

      // Update state variables
      setState({
        ...state,
        isLoggedIn: false,
        token: null,
      });
    } catch (error) {
      console.log(error);
    }
  }

  const updateGroup = async (groupId) => {
    try {
      let response = await fetch(`${BASE_URL}membership/?group=${groupId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${state.token}`,
        },
      });
      let response_data = await response.json();
      if (response.ok) {
        setUserGroup(response_data['group']);
        return true;
      } else {
        Alert.alert("Problem saving");
        return false;
      }
    } catch (error) {

    }
  }

  const refresh = () => {
    getMe(state.token);
  }


  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut, refresh, group: userGroup, updateGroup }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider;