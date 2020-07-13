import 'react-native-gesture-handler';
import React, { useState, useEffect, Component } from 'react';
import { StyleSheet, Text, View, Modal, Button, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import ActivityFeedScreen from './screens/tabs/ActivityFeedScreen'
import ProfileScreen from './screens/tabs/ProfileScreen'
import SuggestionScreen from './screens/tabs/SuggestionScreen'
import WorkoutsTab from './screens/tabs/WorkoutsTab'
import LoginScreen from './screens/loginScreen'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BASE_URL } from './helpers'
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
])

const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

function TabScreen({ route, navigation }) {
  return (
    <Tab.Navigator
        screenOptions={( { route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Activity') {
              iconName = focused
                ? 'home'
                : 'home-outline';
            } else if (route.name === 'Today') {
              iconName = 'calendar-today';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'account' : 'account-outline';
            } else if (route.name === 'Workouts') {
              iconName = 'run';
            }

            // You can return any component that you like here!
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Activity" component={ActivityFeedScreen} />
        <Tab.Screen name="Workouts" component={WorkoutsTab} />
        <Tab.Screen name="Today" component={SuggestionScreen} />
        <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            initialParams={{logout: route.params.logout}}
        />
      </Tab.Navigator>
  )
}

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
        this.setState({token: value})
        approved = await this.checkCredentials()
        this.setState({isLoggedIn: approved, isLoading: false})
      } else {
        this.setState({isLoggedIn: false, isLoading: false})
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
          <Button style={styles.Btn} onPress={() => this.setState({isLoading: false})} title="Load" />
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
              initialParams={{logout: this.logout}}
            />
          </RootStack.Navigator>
        </NavigationContainer>
      );
    } else {
      return (
        <NavigationContainer>
          <RootStack.Navigator>
            <RootStack.Screen
              name="Login"
              component={LoginScreen}
              initialParams={{login: this.login}}
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
