import React, { useState, useEffect, useContext } from 'react'
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { BASE_URL, handleNetworkError } from '../helpers';
import { Picker } from '@react-native-community/picker';
import axios from 'axios';

export default function GroupModal({ onChange, visible, initialGroup, setVisible }) {

  GroupModal.defaultProps = {
    visible: false,
    initialGroup: id,
  }
  const { group: { id }, token } = useContext(AuthContext);
  const [initialLoad, setInitialLoad] = useState(true);
  const [group, setGroup] = useState(initialGroup);
  const [modalGroup, setModalGroup] = useState(initialGroup);
  const [groupDescs, setGroupDescs] = useState(null);
  const [pickerItems, setPickerItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGroups();
  }, []);

  const getGroups = async () => {
    try {
      let response = await axios(`${BASE_URL}/groups/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        timeout: 5000,
      });
      let response_data = await response.data;

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
      response_data.forEach(item => {
        _groupDescs[item.id] = item.description;
      });
      setGroupDescs(_groupDescs);
      setLoading(false);
    } catch (error) {
      handleNetworkError(error);
      setLoading(false);
    }
  }

  // UseEffect for the onChange
  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
    } else {
      onChange(group);
    }
  }, [group]);

  const closeModal = (save = false) => {
    if (save) {
      // Set group to match selected group
      setGroup(modalGroup);
    } else {
      // reset modal group
      setModalGroup(group);
    }
    // Hide the modal view
    setVisible(false);
  }

  if (loading) {
    return (
      <View style={{ alignItems: 'center', justifyContent: "center", flex: 1, backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
      >
        <Pressable
          onPress={() => closeModal()}
          style={styles.centered}
        >
          <Pressable style={styles.modalView}>
            <View style={[styles.labelView, { marginTop: 15, justifyContent: 'space-between' }]}>
              <Text style={{ fontSize: 20 }}>Training Group</Text>
              <Text>{groupDescs[modalGroup]}</Text>
            </View>
            <Picker
              selectedValue={modalGroup}
              display="default"
              onValueChange={(val, index) => setModalGroup(val)}
              style={styles.picker}
            >
              {pickerItems}
            </Picker>
            <View style={styles.modalButtonsView}>
              <TouchableOpacity
                onPress={() => closeModal()}
                style={[styles.modalButtonView, { borderRightColor: '#a2a2a2', borderRightWidth: 0.5, }]}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => closeModal(true)}
                style={[styles.modalButtonView, { borderLeftColor: '#a2a2a2', borderLeftWidth: 0.5, }]}
              >
                <Text>Ok</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#00274C',
    backgroundColor: 'red',
    //alignItems: 'center',
    justifyContent: 'space-between',
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
  modalText: {
    fontSize: 20,
    alignSelf: 'center',
    paddingTop: 10,
  },
  labelView: {
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
  },
});