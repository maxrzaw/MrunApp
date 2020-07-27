import * as React from 'react';
import { useState, useContext, useEffect } from 'react'
import {
  Text,
  View,
  Button,
  StyleSheet,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
  Keyboard
} from 'react-native';
import { BASE_URL, mapCategory } from '../helpers'
import { AuthContext } from '../contexts/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function EditProfile({ navigation }) {
  // Context variables
  const { token, user } = useContext(AuthContext);
  // Pieces of state
  const [state, setState] = useState({
    bio: user.bio,
    year: user.year,
    firstName: user.first_name,
    lastName: user.last_name,
    validFirst: true,
    validLast: true,
    validYear: true,
  });

  useEffect(() => {
    isValid = (state.validFirst && state.validLast && state.validYear);
    setValid(isValid);
  }, [state]);

  const [valid, setValid] = useState(true);

  const [yearState, setYearState] = useState({
    year: user.year,
    valid: true,
    temp: user.year,
  });

  const [modalVisible, setModalVisible] = useState(false);

  const onFirstNameChange = (val) => {
    valid = (val.trim().length > 0);
    setState({
      ...state,
      firstName: val,
      validFirst: valid,
    });
  };

  const onLastNameChange = (val) => {
    valid = (val.trim().length > 0);
    setState({
      ...state,
      lastName: val,
      validLast: valid,
    });
  };

  const onBioChange = (val) => {
    setState({
      ...state,
      bio: val,
    });
  };

  const onYearSave = () => {
    setYearState({
      ...yearState,
      year: state.tempYear,
    });
    setModalVisible(false);
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => save()} title="Save"
          disabled={!(valid)}
        />
      ),
      headerLeft: () => (
        <Button onPress={() => navigation.goBack()} title="Cancel" />
      )
    });
  }, [navigation, valid]);



  //  FIXME: Everything below needs to change
  //  FIXME: From activity
  const save = async () => {
    try {
      // Do stuff
      let body_data = {
        "first_name": state.comment,
        "last_name": state.time,
        "bio": state.bio,
        "year": yearState.year,
      };
      await fetch(`${BASE_URL}users/me/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(body_data),
      });
    } catch (error) {
      console.log(error);
      Alert.alert("Unable to save. Check your network connection.")
    }
    navigation.goBack();
    console.log("Saved returned");

  };


  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>

        <View style={styles.textInputView}>
          <Text style={styles.textLabelDisabled}>Title:</Text>
          <Text style={{ flex: 1, padding: 5, fontSize: 16, color: '#a9a9a9' }}>{activity.workout.title}</Text>
        </View>
        <View style={styles.textInputView}>
          <Text style={styles.textLabelDisabled}>Category:</Text>
          <Text style={[styles.textInput, { fontSize: 16, color: '#a9a9a9' }]}>
            {mapCategory[activity.workout.category]}
          </Text>
        </View>
        <Text style={styles.textLabelDisabled}>Description:</Text>
        <View style={styles.descriptionView}>
          <Text style={{ flex: 1, padding: 5, color: '#a9a9a9' }}>{activity.workout.description}</Text>
        </View>
        <TouchableOpacity
          style={styles.textInputView}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.textLabel}>Time:</Text>
          <Text style={[styles.textInput, { fontSize: 16 }]}>
            {state.displayDate}
          </Text>
        </TouchableOpacity>
        <Text style={styles.textLabel}>Bio:</Text>
        <View style={[styles.descriptionView, { flex: 0.3 }]}>
          <TextInput
            style={styles.textInput}
            value={state.bio}
            autoCapitalize="sentences"
            multiline
            placeholder="A little about you..."
            returnKeyType="default"
            onChangeText={(val) => onBioChange(val)}
          />
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.centered}>
              <View style={styles.modalView}>
                <View style={styles.LabelView}>
                  <Text style={{ fontSize: 20 }}>Workout Time</Text>
                </View>
                <DateTimePicker
                  testID="dateTimePicker"
                  mode="datetime"
                  value={state.tempTime}
                  is24Hour={true}
                  display="default"
                  onChange={(event, val) => onDateChange(val)}
                  style={styles.picker}
                  maximumDate={new Date()}
                />
                <View style={styles.modalButtonsView}>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={[styles.modalButtonView, { borderRightColor: '#a2a2a2', borderRightWidth: 0.5, }]}
                  >
                    <Text>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => onTimeSave()}
                    style={[styles.modalButtonView, { borderLeftColor: '#a2a2a2', borderLeftWidth: 0.5, }]}
                  >
                    <Text>Ok</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View >
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
  },
  textLabel: {
    fontWeight: 'normal',
    fontSize: 20,
    paddingLeft: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  textLabelDisabled: {
    fontWeight: 'normal',
    fontSize: 20,
    paddingLeft: 5,
    alignItems: 'center',
    marginVertical: 5,
    color: '#a9a9a9',
  },
  descriptionView: {
    borderBottomColor: '#f0f0f0',
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  textInputView: {
    borderBottomColor: '#e6e6e6',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    paddingVertical: 5,
    justifyContent: 'center',
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
    height: 200,
  },
  modalButtonsView: {
    flexDirection: 'row',
    height: 50,
    // backgroundColor: '#f0f0f0',
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
  deleteView: {
    margin: 5,
    backgroundColor: '#fff',
    borderColor: 'red',
    borderWidth: 3,
    alignSelf: 'stretch',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.125,
  },
  deleteText: {
    color: 'red',
    fontSize: 18,
  }
});