import * as React from 'react';
import { Text, View, Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'


export default function ProfileTab({ route, navigation }) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Profile Screen!</Text>
        <Button onPress={route.params.logout} title="Logout" />
      </View>
    );
  }
