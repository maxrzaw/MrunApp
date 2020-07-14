import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator } from '@react-navigation/stack'
import LoginScreen from './screens/LoginScreen'
import SignupScreen from './screens/SignupScreen'
import { BASE_URL } from './helpers'
import { LogBox } from 'react-native';
import TabScreen from './tabs/TabScreen'

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
])


const RootStack = createStackNavigator();


export default class App extends Component {
  constructor(props) {
    super(props)
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.state = {
      isLoading: true,
      isLoggedIn: false,
      token: "",
    }
  }



  componentDidMount() {
    this.getData()
  }

  async login(authToken) {
    this.setState({
      isLoggedIn: true,
      token: authToken,
    })
    try {
      await AsyncStorage.setItem('token', authToken)
    } catch (error) {
      // Saving error
      console.log(error);
    }
  }

  async logout() {
    this.setState({
      isLoggedIn: false,
      token: "",
    })
    try {
      await AsyncStorage.removeItem('token')
    } catch (error) {
      // Remove error
      console.log(error);
    }
  }
  async checkCredentials() {
    try {
      let response = await fetch(BASE_URL + 'credential-check/', {
        method: 'HEAD',
        headers: {
          'Authorization': 'Token ' + this.state.token
        },
      });
      return response.ok
    } catch (error) {
      console.log(error)
    }
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('token')
      if (value !== null) {
        this.setState({ token: value })
        approved = await this.checkCredentials()
        this.setState({ isLoggedIn: approved, isLoading: false })
      } else {
        this.setState({ isLoggedIn: false, isLoading: false })
      }
    } catch (error) {
      console.log(error)
    }
  }
  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 30 }}>Loading...</Text>
          <Button style={styles.Btn} onPress={() => this.setState({ isLoading: false })} title="Load" />
        </View>
      );
    } else if (this.state.isLoggedIn) {
      return (
        <NavigationContainer>
          <RootStack.Navigator mode="modal" headerMode="none">
            <RootStack.Screen
              name="Main"
              component={TabScreen}
              options={{ headerShown: false }}
              initialParams={{ logout: this.logout }}
            />
          </RootStack.Navigator>
        </NavigationContainer>
      );
    } else {
      return (
        <NavigationContainer>
          <RootStack.Navigator initialRouteName="Login">
            <RootStack.Screen
              name="Login"
              component={LoginScreen}
              initialParams={{ login: this.login }}
            />
            <RootStack.Screen
              name="Signup"
              component={SignupScreen}
            />
          </RootStack.Navigator>
        </NavigationContainer>
      );
    }

  }
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
