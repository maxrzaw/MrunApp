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
  ActivityIndicator
} from 'react-native';
import { BASE_URL, mapYear } from '../helpers'
import { AuthContext } from '../contexts/AuthContext';
import { Picker } from '@react-native-community/picker';



export default function EditProfile({ navigation, route }) {
  const { userInGroup, userGroup } = route.params;
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
  const [selectedGroup, setSelectedGroup] = useState({
    group: userInGroup ? userGroup.id : 0,
    temp: userInGroup ? userGroup.id : 0,
  });
  const [groupNames, setGroupNames] = useState(null);
  const [groupDescs, setGroupDescs] = useState(null);
  const [pickerItems, setPickerItems] = useState([]);
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const [valid, setValid] = useState(true);
  const [loading, setLoading] = useState(true);
  const [yearState, setYearState] = useState({
    year: user.year,
    temp: user.year,
  });

  useEffect(() => {
    getGroups();
  }, []);

  useEffect(() => {
    isValid = (state.validFirst && state.validLast && state.validYear);
    setValid(isValid);
  }, [state]);


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
      year: yearState.temp,
    });
    setYearModalVisible(false);
  }

  const onGroupSave = () => {
    setSelectedGroup({
      ...selectedGroup,
      group: selectedGroup.temp,
    });
    setGroupModalVisible(false);
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

  const getGroups = async () => {
    try {
      let response = await fetch(`${BASE_URL}groups/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      });
      let response_data = await response.json();
      if (response.ok) {
        // Get the picker items
        let items = response_data.map((item => {
          return (
            <Picker.Item
              label={item.name}
              value={item.id}
              key={item.id}
            />
          );
        }));
        setPickerItems(items);
        // Make a lookup table for groups with id as key
        _groupNames = {};
        _groupDescs = {};
        _groupNames[0] = "None selected";
        _groupDescs[0] = "None selected";
        response_data.forEach(item => {
          _groupNames[item.id] = item.name;
          _groupDescs[item.id] = item.description;
        });
        setGroupNames(_groupNames);
        setGroupDescs(_groupDescs);
        setLoading(false);
      } else {
        console.log("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }



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
  };


  if (loading) {
    return (
      <View style={{alignItems: 'center', justifyContent: "center", flex: 1, backgroundColor: '#fff'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>

        <View style={styles.textInputView}>
          <Text style={styles.textLabel}>First Name:</Text>
          <Text style={{ flex: 1, padding: 5, fontSize: 16 }}>{state.firstName}</Text>
        </View>
        <View style={styles.textInputView}>
          <Text style={styles.textLabel}>Last Name:</Text>
          <Text style={[styles.textInput, { fontSize: 16 }]}>
            {state.lastName}
          </Text>
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
            {groupNames[selectedGroup.group]}
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
          visible={groupModalVisible}
        >
          <View style={styles.centered}>
            <View style={styles.modalView}>
              <View style={[styles.LabelView, { marginTop: 15, justifyContent: 'space-between'}]}>
                <Text style={{ fontSize: 20 }}>Training Group</Text>
                <Text>{groupDescs[selectedGroup.temp]}</Text>
              </View>
              <Picker
                selectedValue={selectedGroup.temp}
                display="default"
                onValueChange={(val, index) => setSelectedGroup({
                  ...selectedGroup,
                  temp: val,
                })}
                style={styles.picker}
              >
                {pickerItems}
              </Picker>
              <View style={styles.modalButtonsView}>
                <TouchableOpacity
                  onPress={() => setGroupModalVisible(false)}
                  style={[styles.modalButtonView, { borderRightColor: '#a2a2a2', borderRightWidth: 0.5, }]}
                >
                  <Text>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onGroupSave()}
                  style={[styles.modalButtonView, { borderLeftColor: '#a2a2a2', borderLeftWidth: 0.5, }]}
                >
                  <Text>Ok</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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