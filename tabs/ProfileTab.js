import * as React from 'react';
import { Text, View, Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'
import ProfileScreen from '../screens/ProfileScreen'
import { UserContext } from '../components/context'

const ProfileStack = createStackNavigator();


export default function ProfileTab({ navigation }) {

  const { user } = React.useContext(UserContext);
  console.log("User in ProfileTab is: \n" + JSON.stringify(user));
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ user: user }}
      />
    </ProfileStack.Navigator>
  );
}
