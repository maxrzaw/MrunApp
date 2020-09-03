import React, { useState, useEffect } from 'react'

import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DateHeader({ onDateChange, disableButtons, initialDate }) {

  DateHeader.defaultProps = {
    disableButtons: false,
  }
  const [date, setDate] = useState(new Date(initialDate.valueOf()));
  const [leftDisabled, setLeftDisabled] = useState(false);
  const [rightDisabled, setRightDisabled] = useState(false);
  const [middleDisabled, setMiddleDisabled] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDate, setModalDate] = useState(new Date());

  const goLeft = () => {
    // Subtract 1 from date
    changeDate(-1);
  }

  const goRight = () => {
    // Add 1 to date
    changeDate(1);
  }

  const changeDate = (days) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate() + days;
    setDate(new Date(year, month, day));
  }
  // Keeps the modalDate in sync
  useEffect(() => {
    setModalDate(date);
  }, [date]);

  const middlePressed = () => {
    // Disable all buttons
    setLeftDisabled(true);
    setMiddleDisabled(true);
    setRightDisabled(true);
    // Show datepicker modal
    setModalVisible(true);
    // The datepicker modals onsave event will enable buttons again
  }

  // UseEffect for the onDateChange
  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
    } else {
      onDateChange(date);
    }
  }, [date]);

  const closeModal = (save = false) => {
    if (save) {
      // Set date to match selected date
      setDate(modalDate);
    } else {
      // reset modal date to point to date
      setModalDate(date);
    }
    // Enable all the buttons
    setLeftDisabled(false);
    setRightDisabled(false);
    setMiddleDisabled(false);
    // Hide the modal view
    setModalVisible(false);
  }


  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => goLeft()}
        disabled={leftDisabled || disableButtons}
      >
        {({ pressed }) => (
          <Feather
            name="chevron-left"
            size={33}
            color={pressed ? '#CCA404' : '#FFCB05'}

          />
        )}
      </Pressable>
      <Pressable
        disabled={middleDisabled || disableButtons}
        onPress={() => middlePressed()}
      >
        {({ pressed }) => (
          <Text style={pressed ? styles.dateTextPressed : styles.dateText}>{date.toLocaleDateString([], {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })}</Text>
        )}
      </Pressable>


      <Pressable
        disabled={rightDisabled || disableButtons}
        onPress={() => goRight()}
      >
        {({ pressed }) => (
          <Feather
            name="chevron-right"
            size={33}
            color={pressed ? '#CCA404' : '#FFCB05'}

          />
        )}
      </Pressable>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
      >
        <TouchableWithoutFeedback onPress={() => closeModal()}>
          <View style={styles.centered}>
            <View style={styles.modalView}>
              <View style={styles.LabelView}>
                <Text style={styles.modalText}>Select a Date</Text>
              </View>
              <DateTimePicker
                testID="dateTimePicker"
                mode="date"
                value={modalDate}
                display="default"
                onChange={(event, val) => setModalDate(val)}
                style={styles.picker}
              />
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
            </View>
          </View>
        </TouchableWithoutFeedback>

      </Modal>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#00274C',
    alignItems: 'center',
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
  dateText: {
    color: '#FFCB05',
  },
  dateTextPressed: {
    color: '#CCA404',
  }
});