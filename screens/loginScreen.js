import * as React from 'react';
import { useState, useContext } from 'react'
import { 
  Text, 
  View, 
  Button, 
  TextInput, 
  StyleSheet,
  Keyboard,
  Pressable
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { AuthContext } from '../contexts/AuthContext'


export default function LoginScreen({ navigation }) {

  // Get signIn() function from context
  const { signIn } = useContext(AuthContext);

  // Set initial state
  const [data, setData] = useState({
    username: '',
    password: '',
    check_textInputChange: false,
    secureTextEntry: true,
  });

  // handles username changes
  const textInputChange = (val) => {
    valid = (val.trim().length !== 0);
    setData({
      ...data,
      username: val,
      check_textInputChange: valid,
    });
  };

  // handles password change
  const handlePasswordChange = (val) => {
    setData({
      ...data,
      password: val,
    });
  };

  // handles changing the visibility of the password text
  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    })
  };

  // Handles login
  const handleLogin = () => {
    // Call sign in from AuthContext
    signIn(data.username, data.password);
  }

  return (
    <Pressable onPress={Keyboard.dismiss} style={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.bottom}>
          <Text style={styles.bottomText}>Username</Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" size={20} color="black" />
            <TextInput
              style={styles.textInput}
              placeholder="Your Username"
              autoCapitalize="none"
              onChangeText={(val) => textInputChange(val)}
              returnKeyType="next"
              onSubmitEditing={() => { this.passwordTextInput.focus(); }}
              blurOnSubmit={false}
              keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
            />
            {data.check_textInputChange ?
              <Feather
                name="check-circle"
                color="green"
                size={20}
              />
              : null}
          </View>
          <Text style={[styles.bottomText, { marginTop: 30 }]}>Password</Text>
          <View style={[styles.action, { marginBottom: 25 }]}>
            <Feather
              name="lock"
              color="black"
              size={20}
            />
            <TextInput
              ref={(input) => { this.passwordTextInput = input; }}
              style={styles.textInput}
              placeholder="password"
              autoCapitalize="none"
              secureTextEntry={data.secureTextEntry}
              onChangeText={(val) => handlePasswordChange(val)}
              onSubmitEditing={() => handleLogin()} 
              returnKeyType='go'
            />
            <Pressable onPress={() => updateSecureTextEntry()}>
              <Feather name={data.secureTextEntry ? "eye-off" : "eye"} size={20} color="black" />
            </Pressable>
          </View>

          <Button
            onPress={() => handleLogin()} title="Login"
          />
          <Button
            title="Sign Up"
            onPress={() => navigation.navigate('Signup')}
          />
        </View>
      </View>
    </Pressable>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  top: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    margin: 10,
  },
  bottom: {
    flex: 3,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  bottomText: {
    fontSize: 20,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 15,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: 'blue',
  },
});
