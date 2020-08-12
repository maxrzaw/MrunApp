import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
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
import { BASE_URL, mapCategory, handleNetworkError } from '../helpers';
import { AuthContext } from '../contexts/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';


export default function EditActivity({ navigation, route: { params: { activity, deleteItem } } }) {
  const { token } = useContext(AuthContext);
  const [state, setState] = useState({
    comment: activity.comment,
    time: new Date(activity.time),
    tempTime: activity.time,
    validComment: true,
    showPicker: true,
    displayDate: '',
  });


  const [modalVisible, setModalVisible] = useState(false);

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
  }, [state.time]);


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
        "comment": state.comment,
        "time": state.time,
      };
      let response = await axios({
        url: `${BASE_URL}/activities/${activity.id}/`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        data: JSON.stringify(body_data),
      });
      if (response.status == 202) {
        navigation.goBack();
      }
    } catch (error) {
      handleNetworkError(error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteItem(activity.id);
    } catch (error) {
      console.log(error);
    }
  }


  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => save()} title="Save"
          disabled={!(state.validComment)}
        />
      ),
      headerLeft: () => (
        <Button onPress={() => navigation.goBack()} title="Cancel" />
      )
    });
  }, [navigation, state]);



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
        <Text style={styles.textLabel}>Comment:</Text>
        <View style={[styles.descriptionView, { flex: 0.3 }]}>
          <TextInput
            style={styles.textInput}
            value={state.comment}
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
        <TouchableOpacity
          style={styles.deleteView}
          onPress={() => Alert.alert(
            'Are you sure?',
            'This will permanently delete the activity',
            [
              {
                text: 'Cancel',
                onPress: () => null
              },
              {
                text: 'Delete',
                onPress: () => handleDelete(),
                style: 'destructive'
              }
            ],
            { cancelable: false }
          )}
        >
          <Text style={styles.deleteText}>Delete</Text>

        </TouchableOpacity>
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