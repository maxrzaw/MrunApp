import * as React from 'react';
import { Text, View, Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'
import ProfileScreen from '../screens/ProfileScreen'

const ProfileStack = createStackNavigator();


export default function ProfileTab({ navigation }) {
    return (
      <ProfileStack.Navigator>
        <ProfileStack.Screen
          name="Profile"
          component={ProfileScreen}
        />
      </ProfileStack.Navigator>
    );
  }
