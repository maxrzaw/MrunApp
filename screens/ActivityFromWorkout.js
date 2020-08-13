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
  Keyboard,
  Pressable
} from 'react-native';
import { BASE_URL, mapCategory, handleNetworkError } from '../helpers'
import { AuthContext } from '../contexts/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { throttle } from 'underscore';
import axios from 'axios';


export default function ActivityFromWorkout({ navigation, route: { params: { item } } }) {
  const { token } = useContext(AuthContext);

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  useEffect(() => {
    return () => {
      source.cancel('Clean up from Activity From Workout Screen');
    }
  }, []);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [state, setState] = useState({
    comment: '',
    time: new Date(),
    tempTime: new Date(),
    validComment: false,
    showPicker: true,
    displayDate: '',
  });

  const onCommentChange = (val) => {
    valid = (val.trim().length > 0);
    setState({
      ...state,
      comment: val,
      validComment: valid,
    });
  };

  const onDateChange = (date) => {
    setState({
      ...state,
      tempTime: date,
    });
  };

  const onTimeSave = () => {
    setState({
      ...state,
      time: state.tempTime,
    });
    setModalVisible(false);
  }

  useEffect(() => {
    let date = getDate();
    setState({
      ...state,
      displayDate: date,
    })
  }, [state.time])


  const getDate = () => {
    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    let day = ''
    if (today.toDateString() == state.time.toDateString()) {
      day = 'Today';
    } else if (yesterday.toDateString() == state.time.toDateString()) {
      day = 'Yesterday';
    } else {
      day = state.time.toDateString();
    }
    time = state.time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    return `${day} at ${time}`;
  }

  const save = async () => {
    try {
      // Do stuff
      let body_data = {
        "workout": item.id,
        "comment": state.comment,
        "time": state.time,
      };
      let response = await axios({
        url: `${BASE_URL}/activities/`,
        method: 'POST',
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        data: JSON.stringify(body_data),
        cancelToken: source.token,
      });
      if (response.status == 201) {
        navigation.goBack();
      }
    } catch (error) {
      handleNetworkError(error);
    }
  };

  const onSave = throttle(save, 250, { trailing: false });


  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => onSave()} title="Save"
          disabled={!(state.validComment)}
        />
      ),
      headerLeft: () => (
        <Button onPress={() => navigation.goBack()} title="Close" />
      )
    });
  }, [navigation, state]);



  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>

        <View style={styles.textInputView}>
          <Text style={styles.textLabel}>Title:</Text>
          <Text style={{ flex: 1, padding: 5, fontSize: 16 }}>{item.title}</Text>
        </View>
        <View style={styles.textInputView}>
          <Text style={styles.textLabel}>Category:</Text>
          <Text style={[styles.textInput, { fontSize: 16 }]}>
            {mapCategory[item.category]}
          </Text>
        </View>
        <Text style={styles.textLabel}>Description:</Text>
        <View style={styles.descriptionView}>
          <Text style={{ flex: 1, padding: 5 }}>{item.description}</Text>
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
        <Text style={styles.textLabel}>Comment:</Text>
        <View style={[styles.descriptionView, { flex: 0.3 }]}>
          <TextInput
            style={styles.textInput}
            autoCapitalize="sentences"
            multiline
            placeholder="Comments about the workout."
            returnKeyType="default"
            onChangeText={(val) => onCommentChange(val)}
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
  descriptionView: {
    borderBottomColor: '#f0f0f0',
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 5,
    alignItems: 'center',
    color: 'black',
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
  }
});