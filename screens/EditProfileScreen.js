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
} from 'react-native';
import { BASE_URL, mapYear, handleNetworkError } from '../helpers'
import { AuthContext } from '../contexts/AuthContext';
import { Picker } from '@react-native-community/picker';
import GroupModal from '../components/GroupModal';
import axios from 'axios';


export default function EditProfile({ navigation }) {
  // Context variables
  const { token, user, refresh, group, updateGroup, groupDict } = useContext(AuthContext);

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  useEffect(() => {
    return () => {
      source.cancel('Clean up from Edit Profile Screen');
    }
  }, []);

  // Pieces of state
  const [selectedGroup, setSelectedGroup] = useState(group.id);
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const [valid, setValid] = useState(true);
  const [yearState, setYearState] = useState({
    year: user.year,
    temp: user.year,
  });
  const [state, setState] = useState({
    bio: user.bio,
    year: user.year,
    firstName: user.first_name,
    lastName: user.last_name,
    validFirst: true,
    validLast: true,
    validYear: true,
  });

  const axiosBase = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
    timeout: 5000,
    cancelToken: source.token,
  });

  useEffect(() => {
    isValid = (state.validFirst && state.validLast && state.validYear);
    setValid(isValid);
  }, [state]);

  const onFirstNameChange = (val) => {
    isValid = (val.trim().length > 0);
    setState({
      ...state,
      firstName: val,
      validFirst: isValid,
    });
  };

  const onLastNameChange = (val) => {
    isValid = (val.trim().length > 0);
    setState({
      ...state,
      lastName: val,
      validLast: isValid,
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
      year: yearState.temp,
    });
    setYearModalVisible(false);
  }

  const onGroupSave = (groupId) => {
    setSelectedGroup(groupId);
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
  }, [navigation, valid, state, selectedGroup]);

  const saveUser = async () => {
    try {
      // Do stuff
      let body_data = {
        first_name: state.firstName,
        last_name: state.lastName,
        bio: state.bio,
        year: yearState.year,
      };
      let response = await axiosBase.patch(`/me/`, body_data);
      if (response.status == 202) {
        return true;
      } else {
        Alert.alert("Problem saving");
        return false;
      }
    } catch (error) {
      handleNetworkError(error);
      return false;
    }
  };

  const save = async () => {
    try {
      let userSuccess = await saveUser();
      let groupSuccess = await updateGroup(selectedGroup);

      if (userSuccess && groupSuccess) {
        await refresh();
        navigation.goBack();
      }
    } catch (error) {
      console.log(error);
    }
  }
  console.log(groupDict);
  console.log(`selected group: ${selectedGroup}`);
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>

        <View style={styles.textInputView}>
          <Text style={styles.textLabel}>First Name:</Text>
          <TextInput
            style={[styles.textInput, { fontSize: 18 }]}
            value={state.firstName}
            autoCapitalize="words"
            placeholder='First Name...'
            onChangeText={(val) => onFirstNameChange(val)}
            maxLength={20}
          />
        </View>
        <View style={styles.textInputView}>
          <Text style={styles.textLabel}>Last Name:</Text>
          <TextInput
            style={[styles.textInput, { fontSize: 18 }]}
            value={state.lastName}
            autoCapitalize="words"
            placeholder='Last Name...'
            onChangeText={(val) => onLastNameChange(val)}
            maxLength={20}
          />
        </View>
        <TouchableOpacity
          style={styles.textInputView}
          onPress={() => setYearModalVisible(true)}
        >
          <Text style={styles.textLabel}>Year:</Text>
          <Text style={[styles.textInput, { fontSize: 16 }]}>
            {mapYear[yearState.year]}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.textInputView}
          onPress={() => setGroupModalVisible(true)}
        >
          <Text style={styles.textLabel}>Training Group:</Text>
          <Text style={[styles.textInput, { fontSize: 16 }]}>
            {groupDict[selectedGroup].name}
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
        <GroupModal
          onChange={onGroupSave}
          visible={groupModalVisible}
          setVisible={setGroupModalVisible}
          initialGroup={group.id}
        />
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