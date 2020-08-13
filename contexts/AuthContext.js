import React, { useState, createContext, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { BASE_URL, handleNetworkError } from '../helpers';
import axios from 'axios';

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  // Our pieces of state for this context
  const [state, setState] = useState({
    token: null,
    user: null,
    isLoggedIn: false,
    isLoading: true,
  });

  const [userGroup, setUserGroup] = useState(1);
  const [groupList, setGroupList] = useState(null);
  const [groupDict, setGroupDict] = useState(null);

  // This will only run on initial load
  useEffect(() => {
    (async () => initialLoad())();
    return () => {
      source.cancel('Clean up from AuthContext');
    }
  }, []);

  useEffect(() => {
    if (state.token) {
      getGroups();
    }
  }, [state.token]);

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
      response = await axios(`${BASE_URL}/membership/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + token,
        },
        timeout: 5000,
        cancelToken: source.token,
      });
      let response_data = await response.data;
      setUserGroup(response_data['group']);
    } catch (error) {
      handleNetworkError(error);
    }
  }

  // Gets the user object and updates it
  const getMe = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
      let response = await axios(`${BASE_URL}/me/`, {
        method: 'GET',
        headers: {
          'Authorization': 'Token ' + token
        },
        timeout: 5000,
        cancelToken: source.token,
      });
      let user = await response.data;
      // Update state with user object
      setState({
        ...state,
        user: user,
        token: token,
        isLoggedIn: true,
        isLoading: false,
      });
      await getGroup(token);
    } catch (error) {
      handleNetworkError(error);
      // Token is bad
      if (error.response) {
        setState({
          ...state,
          user: null,
          token: null,
          isLoggedIn: false,
          isLoading: false,
        });
      } else if (error.request) {
        // something wrong with connection
        console.log("error.request");
      }
    }
  }

  // Sign in function
  const signIn = async (username, password) => {
    // Try logging in
    try {
      const body_data = { username, password };
      let response = await axios(`${BASE_URL}/token-auth/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(body_data),
        cancelToken: source.token,
      });
      // Wait for the response and convert it do dictionary
      let response_data = await response.data;
      // If response code is ok then get the use object and update state
      await getMe(response_data['token']);
    } catch (error) {
      handleNetworkError(error);
      setState({
        ...state,
        token: null,
        user: null,
        isLoggedIn: false,
      });
      Alert.alert("Incorrect username or password");
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
      let response = await axios(`${BASE_URL}/membership/?group=${groupId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${state.token}`,
        },
        timout: 5000,
        cancelToken: source.token,
      });
      let response_data = await response.data;
      setUserGroup(response_data['group']);
      return true;
    } catch (error) {
      handleNetworkError(error);
      Alert.alert("Problem saving");
      return false;
    }
  }

  const refresh = () => {
    getMe(state.token);
  }

  const register = async (username, email, first, last, pass1, pass2, bio, year) => {
    console.log('Register ran');
    try {
      const body_data = {
        "username": username,
        "email": email,
        "first_name": first,
        "last_name": last,
        "password1": pass1,
        "password2": pass2,
        "bio": bio,
        "year": year,
      }
      console.log(body_data);
      let response = await axios(`${BASE_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000,
        data: JSON.stringify(body_data),
        cancelToken: source.token,
      });
      let response_data = await response.data;
      await getMe(response_data['token']);
    } catch (error) {
      if (error.response) {
        Alert.alert(JSON.stringify(error.response.data).replace(/["\[\],]/g, ''));
      }
      handleNetworkError(error);
    }
  }

  const getGroups = async () => {
    try {
      let response = await axios({
        method: 'GET',
        url: `${BASE_URL}/groups/`,
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${state.token}`,
        },
        cancelToken: source.token,
      });
      let data = {};
      response.data.forEach(item => {
        data[item.id] = { 'name': item.name, 'description': item.description };
      });
      setGroupDict(data);
      setGroupList(response.data);
    } catch (error) {
      handleNetworkError(error);
    }
  }

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut, refresh, group: userGroup, updateGroup, register, groupDict, groupList }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider;