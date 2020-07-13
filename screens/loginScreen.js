import * as React from 'react';
import { Text, View, Button, TextInput, StyleSheet, Alert, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { BASE_URL } from '../helpers'

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props)
    this.handleLogin = this.handleLogin.bind(this)
    this.state = {
      username: "",
      password: "",
      secureTextEntry: true,
      check_textInputChange: false,
      token: "592e41d655eb953bc6f3f39fa0372b2d0143bc86",
      showError: false,
    }
  }
  textInputChange(val) {
    if (val.length !== 0) {
      this.setState({
        username: val,
        check_textInputChange: true,
      })
    } else {
      this.setState({
        username: val,
        check_textInputChange: false,
      })
    }
  }
  /*
  curl  --header "Content-type: application/json"
        --request POST
        --data '{"username": "admin", "password": "password123"}'
        http://localhost:8000/api/v1/token-auth/

        curl --header "Authorization: Token 592e41d655eb953bc6f3f39fa0372b2d0143bc86"
        --head   "http://localhost:8000/api/v1/credential-check/"
  */
  async handleLogin() {
    console.log("Login from loginScreen")
    const body_data = {
      username: this.state.username,
      password: this.state.password,
    };
    /*
    const body_data = {
      username: "admin",
      password: "password123",
    };
    */
    console.log(JSON.stringify(body_data));
    try {
      const token_auth_url = BASE_URL + 'token-auth/'
      let response = await fetch(token_auth_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body_data),
      });

      let data = await response.json();
      if (response.ok) {
        console.log(data["token"]);
        this.setState({showError: false})
        this.props.route.params.login(this.state.token)
      } else {
        console.log(data);
        this.setState({showError: true});
        //Alert.alert("Unable to login :(")
      }

    } catch (error) {
      console.log(error);
      Alert.alert("Unable to reach the server")
      

    }


  }

  async checkCredentials() {
    try {
      const credential_check_url = BASE_URL + 'credential-check/'
      let response = await fetch(credential_check_url, {
        method: 'HEAD',
        headers: {
          'Authorization': 'Token ' + this.state.token
        },
      });
      console.log(response.ok)
    } catch (error) {
      console.log(error)
    }
  }

  handlePasswordChange(val) {
    this.setState({password: val})
  }

  updateSecureTextEntry() {
    this.setState({ secureTextEntry: !this.state.secureTextEntry})
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessable={false}>
        <View style={styles.container}>
          <View style={styles.top}>
            <Text style={{ fontSize: 30 }}>This is a login screen!</Text>
          </View>
          <View style={styles.bottom}>
            <Text style={styles.bottomText}>Username</Text>
            <View style={styles.action}>
              <FontAwesome name="user-o" size={20} color="black" />
              <TextInput
                style={styles.textInput}
                placeholder="Your Username"
                autocapitalize="none"
                onChangeText={(val) => this.textInputChange(val)}
              />
              {this.state.check_textInputChange ?
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
                style={styles.textInput}
                placeholder="password"
                autocapitalize="none"
                secureTextEntry={this.state.secureTextEntry}
                onChangeText={(val) => this.handlePasswordChange(val)}
                onSubmitEditing={() => this.handleLogin()} title="Login"
              />
              <TouchableOpacity onPress={() => this.updateSecureTextEntry()}>
                <Feather name={this.state.secureTextEntry ? "eye-off" : "eye"} size={20} color="black" />
              </TouchableOpacity>
            </View>
            {this.state.showError ?
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={styles.errorText}>Incorrect username or password</Text>
              </View>
              : null}

            <Button
              style={styles.button}
              onPress={() => this.handleLogin()} title="Login"
            />
            <Button title="Sign Up" />
            <Button
              title="Check Credentials"
              onPress={() => this.checkCredentials()}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>

    );
  }


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
