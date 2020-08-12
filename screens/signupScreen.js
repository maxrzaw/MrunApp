import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import { Text, View, Button, TextInput, Pressable, StyleSheet, Keyboard, Modal, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-community/picker';
import { mapYear } from '../helpers';
import { AuthContext } from '../contexts/AuthContext';

export default function SignUpScreen({ navigation }) {

  const { register } = useContext(AuthContext);
  const [state, setState] = useState({
    email: '',
    username: '',
    password1: '',
    password2: '',
    first_name: '',
    last_name: '',
    bio: '',
  });
  const [yearState, setYearState] = useState({
    year: 'FR',
    temp: 'FR',
  });
  const [yearModalVisible, setYearModalVisible] = useState(false);

  const onYearSave = () => {
    setYearState({
      ...yearState,
      year: yearState.temp,
    });
    setYearModalVisible(false);
  }

  const onUsernameChange = (val) => {
    setState({
      ...state,
      "username": val,
    });
  }

  const onEmailChange = (val) => {
    setState({
      ...state,
      "email": val,
    });
  }

  const onFirstChange = (val) => {
    setState({
      ...state,
      "first_name": val,
    });
  }

  const onLastChange = (val) => {
    setState({
      ...state,
      "last_name": val,
    });
  }

  const onPassOneChange = (val) => {
    setState({
      ...state,
      "password1": val,
    });
  }

  const onPassTwoChange = (val) => {
    setState({
      ...state,
      "password2": val,
    });
  }

  const onBioChange = (val) => {
    setState({
      ...state,
      "bio": val,
    });
  }
  const emailValid = () => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(state.email)) {
      return true;
    }
    return false;
  }

  const onSignUp = () => {
    // Lets do some validation here so I can focus a text input if I want.
    console.log('Button Pressed');
    if (state.username.trim().length == 0) {
      // Username is not long enough
      Alert.alert("Please enter a username");
      this.usernameInput.focus();
    } else if (!emailValid()) {
      // Email is not valid
      Alert.alert("Please enter a valid email address");
      this.emailInput.focus();
    } else if (state.first_name.trim().length == 0) {
      // First Name is not long enough
      Alert.alert("Please enter First Name");
      this.firstNameInput.focus();
    } else if (state.last_name.trim().length == 0) {
      // Last Name is not long enough
      Alert.alert("Please enter Last Name");
      this.lastNameInput.focus();
    } else if (state.password1.trim().length < 8) {
      // Password not long enough
      Alert.alert("Please enter a password containing at least 8 characters");
      this.passwordOneInput.focus();
    } else if (state.password1 != state.password2) {
      // Passwords dont match
      Alert.alert("Passwords must match");
      this.passwordOneInput.focus();
    } else {
      // If all those checks pass, then we will actually try and send the request
      register(
        username = state.username,
        email = state.email,
        first = state.first_name,
        last = state.last_name,
        pass1 = state.password1,
        pass2 = state.password2,
        bio = state.bio,
        year = yearState.year
      );
    }
  }

  return (
    <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <View style={styles.itemView}>
            <Text style={styles.labelText}>Username:</Text>
            <TextInput
              // Username
              ref={(input) => { this.usernameInput = input; }}
              style={styles.textInput}
              placeholder="username"
              autoCapitalize="none"
              onChangeText={(val) => onUsernameChange(val)}
              onSubmitEditing={() => { this.emailInput.focus(); }}
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>

          <View style={styles.itemView}>
            <Text style={styles.labelText}>Email:</Text>
            <TextInput
              // Email
              ref={(input) => { this.emailInput = input; }}
              style={styles.textInput}
              placeholder="email"
              autoCapitalize="none"
              onChangeText={(val) => onEmailChange(val)}
              onSubmitEditing={() => { this.firstNameInput.focus(); }}
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>

          <View style={styles.itemView}>
            <Text style={styles.labelText}>First Name:</Text>
            <TextInput
              // First Name
              ref={(input) => { this.firstNameInput = input; }}
              style={styles.textInput}
              placeholder="first name"
              autoCapitalize="words"
              onChangeText={(val) => onFirstChange(val)}
              onSubmitEditing={() => { this.lastNameInput.focus(); }}
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>

          <View style={styles.itemView}>
            <Text style={styles.labelText}>Last Name:</Text>
            <TextInput
              // Last Name
              ref={(input) => { this.lastNameInput = input; }}
              style={styles.textInput}
              placeholder="last name"
              autoCapitalize="words"
              onChangeText={(val) => onLastChange(val)}
              onSubmitEditing={() => { this.passwordOneInput.focus(); }}
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>

          <View style={styles.itemView}>
            <Text style={styles.labelText}>Password:</Text>
            <TextInput
              // Password1
              ref={(input) => { this.passwordOneInput = input; }}
              style={styles.textInput}
              placeholder="password"
              autoCapitalize="none"
              onChangeText={(val) => onPassOneChange(val)}
              onSubmitEditing={() => { this.passwordTwoInput.focus(); }}
              returnKeyType="next"
              blurOnSubmit={false}
              secureTextEntry={true}
            />
          </View>

          <View style={styles.itemView}>
            <Text style={styles.labelText}>Password:</Text>
            <TextInput
              // Password2
              ref={(input) => { this.passwordTwoInput = input; }}
              style={styles.textInput}
              placeholder="password again"
              autoCapitalize="none"
              onChangeText={(val) => onPassTwoChange(val)}
              onSubmitEditing={() => { this.bioInput.focus(); }}
              returnKeyType="next"
              blurOnSubmit={false}
              secureTextEntry={true}
            />
          </View>

          <View style={[styles.itemView, { flex: 7, maxHeight: 65 }]}>
            <Text style={styles.labelText}>Bio:</Text>
            <TextInput
              // Bio
              ref={(input) => { this.bioInput = input; }}
              style={[styles.textInput, { textAlignVertical: 'top' }]}
              placeholder="A few words to describe you"
              autoCapitalize="sentences"
              onChangeText={(val) => onBioChange(val)}
              onSubmitEditing={() => { }}
              returnKeyType="done"
              multiline
            />
          </View>

          <Pressable style={styles.itemView} onPress={() => setYearModalVisible(true)}>
            <Text style={styles.labelText}>Year:</Text>
            <Text style={styles.textInput}>{mapYear[yearState.year]}</Text>
          </Pressable>
        </View>

        <View style={styles.bottomContainer}>
          <Pressable onPress={() => onSignUp()}>
            {({ pressed }) => (
              <View style={pressed ? styles.buttonPressed : styles.button}>
                <Text style={pressed ? styles.buttonTextPressed : styles.buttonText}>Sign Up</Text>
              </View>
            )}
          </Pressable>
        </View>
        
        <Modal
          animationType="fade"
          transparent={true}
          visible={yearModalVisible}
        >
          <View style={styles.centered}>
            <View style={styles.modalView}>
              <View style={styles.LabelView}>
                <Text style={{ fontSize: 20 }}>Year</Text>
              </View>
              <Picker
                selectedValue={yearState.temp}
                display="default"
                onValueChange={(val, index) => setYearState({
                  ...yearState,
                  temp: val,
                })}
                style={styles.picker}
              >
                <Picker.Item label="Freshman" value='FR' />
                <Picker.Item label="Sophomore" value='SO' />
                <Picker.Item label="Junior" value='JR' />
                <Picker.Item label="Senior" value='SR' />
                <Picker.Item label="Graduate" value='GR' />
              </Picker>
              <View style={styles.modalButtonsView}>
                <TouchableOpacity
                  onPress={() => setYearModalVisible(false)}
                  style={[styles.modalButtonView, { borderRightColor: '#a2a2a2', borderRightWidth: 0.5, }]}
                >
                  <Text>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onYearSave()}
                  style={[styles.modalButtonView, { borderLeftColor: '#a2a2a2', borderLeftWidth: 0.5, }]}
                >
                  <Text>Ok</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  textInput: {
    flex: 3,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
    textAlignVertical: "top",
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: '#0174BB'
  },
  buttonText: {
    color: '#fff',
  },
  buttonPressed: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: '#0067AE'
  },
  buttonTextPressed: {
    color: '#f2f2f2',
  },
  itemView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginTop: 10,
    alignItems: 'flex-start',
    paddingBottom: 5,
    flex: 1,
  },
  labelText: {
    flex: 1,
  },
  inputContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  bottomContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000060',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'stretch',
    margin: 30,

  },
  picker: {
    backgroundColor: '#fffa',
    width: 320,
    height: 180,
  },
  modalButtonsView: {
    flexDirection: 'row',
    height: 50,
    backgroundColor: '#fff',
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    borderTopColor: '#a2a2a2',
    borderTopWidth: 0.5,
  },
  modalButtonView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  LabelView: {
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
  },
});