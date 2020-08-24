import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
  Keyboard,
  Pressable
} from 'react-native';
import { BASE_URL, handleNetworkError, mapCategory } from '../helpers';
import { AuthContext } from '../contexts/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from '@react-native-community/checkbox';
import { throttle } from 'underscore';
import axios from 'axios';


export default function SuggestionFromWorkout({ navigation, route: { params: { item } } }) {
  const { token, groupDict, groupList } = useContext(AuthContext);
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  useEffect(() => {
    return () => {
      //source.cancel('Clean up from Suggest Workout Screen');
    }
  }, []);

  const [checkBoxes, setCheckBoxes] = useState(null);
  const [checkBoxValues, setCheckBoxValues] = useState({});

  const [modalVisible, setModalVisible] = useState(false);
  const [state, setState] = useState({
    time: new Date(),
    tempTime: new Date(),
    validComment: false,
    showPicker: true,
  });

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

  const updateCheckBoxValue = (id, value) => {
    var temp = checkBoxValues;
    temp[id] = value;
    setCheckBoxValues(temp);
  }

  useEffect(() => {
    if (groupList && groupDict) {
      groupList.forEach(elt => {
        updateCheckBoxValue(elt.id, false);
      });
      let items = groupList.map((item => {
        return (
          <View style={styles.checkBoxView} key={item.id}>
            <CheckBox
              disabled={false}
              boxType="square"
              onAnimationType='bounce'
              offAnimationType='bounce'
              animationDuration={0.2}
              value={checkBoxValues[item.id]}
              onValueChange={(newValue) => updateCheckBoxValue(item.id, newValue)}
              //key={item.id}
              style={{ height: 20, width: 20, alignSelf: 'center', margin: 5 }}
            />
            <Text>{item.name}</Text>
          </View>
        );
      }));
      setCheckBoxes(items);
    }
  }, [groupList, groupDict]);

  const save = async () => {
    try {
      // Do stuff
      var success = true;
      for (const key in checkBoxValues) {
        if (checkBoxValues.hasOwnProperty(key)) {
          const value = checkBoxValues[key];
          if (value) {
            let body_data = {
              "workout": item.id,
              "group": key,
              "date": state.time.toISOString().split('T')[0],
            };
            let response = await axios({
              url: `${BASE_URL}/suggestions/`,
              method: 'POST',
              timeout: 5000,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
              },
              data: JSON.stringify(body_data),
              cancelToken: source.token,
            });
            if (response.status != 201) {
              success = false;
            }
          }
        }
      }
      if (success) {
        navigation.goBack();
      } else {
        Alert.alert('Problem saving');
      }

    } catch (error) {
      if (error.response && error.response.status != 409) {
        handleNetworkError(error);
      }
      Alert.alert(
        'Problem Saving',
        `At least one group already had a suggestion on ${state.time.toLocaleDateString([], dateOptions)}`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          },
        ]);
    }
  };

  const onSave = throttle(save, 250, { trailing: false });

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => onSave()} title="Save"
          disabled={false}
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
            {state.time.toLocaleDateString([], dateOptions)}
          </Text>
        </TouchableOpacity>
        <Text style={styles.textLabel}>Training Groups:</Text>

        <View style={styles.checkBoxesView}>
          {checkBoxes}
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
                  <Text>{state.tempTime.toLocaleDateString([],{weekday: 'long'})}</Text>
                </View>
                <DateTimePicker
                  testID="dateTimePicker"
                  mode="date"
                  value={state.tempTime}
                  display="default"
                  onChange={(event, val) => onDateChange(val)}
                  style={styles.picker}
                  minimumDate={new Date()}
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
  },
  checkBoxesView: {
    justifyContent: 'flex-start',
    paddingLeft: 10,
    marginRight: 20,
  },
  checkBoxView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1,
  }
});