import * as React from 'react';
import { useState } from 'react'
import { 
  Text, 
  View, 
  Button, 
  TextInput, 
  StyleSheet, 
  Alert, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  Keyboard 
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { BASE_URL } from '../helpers'
import { AuthContext } from '../components/context'


export default function LoginScreen({ navigation }) {

  // Get signIn() function from context
  const { signIn } = React.useContext(AuthContext);

  // Set initial state
  const [data, setData] = useState({
    username: '',
    password: '',
    check_textInputChange: false,
    secureTextEntry: true,
    showError: false,
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

  // Handles the login
  const handleLogin = async () => {
    const body_data = {
      username: data.username,
      password: data.password,
    };
    try {
      let response = await fetch(BASE_URL + 'token-auth/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body_data),
      });

      // Wait for the response data
      let response_data = await response.json();
      if (response.ok) {
        setData({
          ...data,
          showError: false,
        });

        token = response_data['token'];
        console.log("Token is: " + token);

        // send login data to context
        console.log("SignIn from LoginScreen");
        signIn(token);
      } else {
        setData({
          ...data,
          showError: true,
        });
        // Do not need to send anything to context
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Unable to reach the server")
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessable={false}>
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
            <TouchableOpacity onPress={() => updateSecureTextEntry()}>
              <Feather name={data.secureTextEntry ? "eye-off" : "eye"} size={20} color="black" />
            </TouchableOpacity>
          </View>
          {data.showError ?
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.errorText}>Incorrect username or password</Text>
            </View>
            : null}

          <Button
            onPress={() => handleLogin()} title="Login"
          />
          <Button
            title="Sign Up"
            onPress={() => navigation.navigate('Signup')}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}


styles = StyleSheet.create({
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
  errorText: {
    color: 'red',
    fontSize: 20,
  },
});
