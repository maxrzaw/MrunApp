import 'react-native-gesture-handler';
import React, { useState, useEffect, Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator } from '@react-navigation/stack'
import LoginScreen from './screens/LoginScreen'
import SignupScreen from './screens/SignupScreen'
import { BASE_URL } from './helpers'
import { LogBox } from 'react-native';
import { AuthContext } from './components/context'
import TabScreen from './tabs/TabScreen'

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
])


const RootStack = createStackNavigator();

const App = () => {
  const initialLoginState = {
    isLoading: true,
    isLoggedIn: false,
    token: null,
  }

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          token: action.token,
          isLoggedIn: action.isLoggedIn,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          token: action.token,
          isLoggedIn: true,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          token: null,
          isLoading: false,
          isLoggedIn: false,
        };
      default:
        return {
          ...prevState,
        };
    }
  };

  const checkCredentials = async (token) => {
    try {
      let response = await fetch(BASE_URL + 'credential-check/', {
        method: 'HEAD',
        headers: {
          'Authorization': 'Token ' + token
        },
      });
      return response.ok
    } catch (error) {
      console.log(error)
    }
  }

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async (token) => {
      console.log("SignIn from App.js");
      try {
        await AsyncStorage.setItem('token', token);
        console.log("Token set in storage");
      } catch (error) {
        console.log(error);
      }
      dispatch({ type: 'LOGIN', token: token });
    },
    signOut: async () => {
      try {
        await AsyncStorage.removeItem('token');
      } catch (error) {
        console.log(error);
      }
      dispatch({ type: 'LOGOUT' });
    },
  }), []);

  useEffect(() => {
    /*
    1. Check for stored token.
    2. If token exists verify.
    */
    setTimeout(async () => { // This is just so I can see the animation
      try {
        const value = await AsyncStorage.getItem('token');
        if (value !== null) {
          // validate credentials
          approved = await checkCredentials(value);
          dispatch({ type: 'RETRIEVE_TOKEN', token: value, isLoggedIn: approved });
        } else {
          dispatch({ type: 'RETRIEVE_TOKEN', token: null, isLoggedIn: false });
        }
      } catch (error) {
        console.log(error);
      }
    }, 500);
  }, []);

  if (loginState.isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else if (loginState.isLoggedIn) {
    return (
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          <RootStack.Navigator mode="modal" headerMode="none">
            <RootStack.Screen
              name="Main"
              component={TabScreen}
              options={{ headerShown: false }}
            />
          </RootStack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    );
  }
  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <RootStack.Navigator initialRouteName="Login">
          <RootStack.Screen
            name="Login"
            component={LoginScreen}
          />
          <RootStack.Screen
            name="Signup"
            component={SignupScreen}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Btn: {
    backgroundColor: 'blue',
    padding: '10px'
  }
});

export default App;