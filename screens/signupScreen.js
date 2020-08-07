import * as React from 'react';
import { useState, useContext } from 'react';
import { Text, View, Button } from 'react-native';

/*
Things I need:
Required:
 - email
 - username
 - password1
 - password2
 - year
Optional:
 - first_name (probably want to make this required since I show it)
 - last_name
 - bio
*/



export default function SignUpScreen({ navigation }) {
  const [state, setState] = useState({
    email: '',
    username: '',
    password1: '',
    password2: '',
    year: '',
    first_name: '',
    last_name: '',
    bio: '',
  });
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Sign Up!</Text>
      </View>
    );
  }