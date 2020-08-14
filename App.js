import 'react-native-gesture-handler';
import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import LoginScreen from './screens/LoginScreen'
import SignupScreen from './screens/SignupScreen'
import { BASE_URL } from './helpers'
import { LogBox } from 'react-native';
import AuthContextProvider, { AuthContext } from './contexts/AuthContext';
import TabScreen from './tabs/TabScreen'
import NewWorkoutScreen from './screens/NewWorkoutScreen'
import ActivityFromWorkout from './screens/ActivityFromWorkout'
import SuggestionFromWorkout from './screens/SuggestWorkoutScreen';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
])


const RootStack = createStackNavigator();

const App = () => {
  return (
    <AuthContextProvider>
      <Root />
    </AuthContextProvider>
  );
}

const Root = () => {
  const { isLoading, isLoggedIn } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else if (isLoggedIn) {
    return (
      <NavigationContainer>
        <RootStack.Navigator mode="modal">
          <RootStack.Screen
            name="Main"
            component={TabScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="NewWorkout"
            component={NewWorkoutScreen}
            options={{ title: 'Add Workout' }}
          />
          <RootStack.Screen
            name="ActivityFromWorkout"
            component={ActivityFromWorkout}
            options={{ title: "New Activity" }}
          />
          <RootStack.Screen
            name="SuggestionFromWorkout"
            component={SuggestionFromWorkout}
            options={{ title: "New Suggestion" }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    );
  }
  return (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default App;