import * as React from 'react';
import { useContext, useState } from 'react';
import { 
  Text, 
  View, 
  Button, 
  Alert, 
  TextInput, 
  TouchableWithoutFeedback, 
  Keyboard, 
  StyleSheet,
  Modal
} from 'react-native';
import { BASE_URL, mapCategory } from '../helpers';
import { UserContext } from '../components/context';
import { Picker } from '@react-native-community/picker';



export default function NewWorkoutScreen({ navigation }) {
  const { token } = useContext(UserContext);
  const [state, setState] = useState({
    title: '',
    description: '',
    category: 'T',
    pickerVisible: false,
    categoryColor: '#a9a9a9',
    titleValid: false,
    descValid: false,
  });


  const dismiss = () => {
    Keyboard.dismiss();
    setState({
      ...state,
      pickerVisible: false,
    })
  }

  const showPicker = () => {
    Keyboard.dismiss();
    setState({
      ...state,
      pickerVisible: true,
      categoryColor: 'black',
    });
  }

  const onTitlechange = (val) => {
    valid = (val.trim().length !== 0);
    setState({
      ...state,
      title: val,
      titleValid: valid,
    });
  }

  const onDescriptionChange = (val) => {
    valid = (val.trim().length !== 0);
    setState({
      ...state,
      description: val,
      descValid: valid,
    });
  }

  const save = async () => {
    try {
      // Do stuff
      let body_data = {
        "title": state.title,
        "description": state.description,
        "category": state.category,
      };
      await fetch(`${BASE_URL}workouts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(body_data),
      });
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert("Unable to save. Check your network connection.")
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button 
          onPress={() => save()} title="Save"
          disabled={!(state.titleValid && state.descValid)}
        />
      ),
      headerLeft: () => (
        <Button onPress={() => navigation.goBack()} title="Close" />
      )
    });
  }, [navigation, state]);




  return (
    <TouchableWithoutFeedback onPress={() => dismiss()} accessable={false}>
      <View style={styles.container}>

        <View style={styles.textInputView}>
          <Text style={styles.textLabel}>Title:</Text>
          <TextInput
            style={[styles.textInput, { fontSize: 18 }]}
            autoCapitalize="sentences"
            placeholder="Title of Workout"
            returnKeyType="next"
            blurOnSubmit={false}
            onChangeText={(val) => onTitlechange(val)}
          />
        </View>
        <TouchableWithoutFeedback onPress={() => showPicker()}>
          <View style={styles.textInputView}>
            <Text style={styles.textLabel}>Category:</Text>
            <Text style={[styles.textInput, { color: state.categoryColor, fontSize: 16 }]}>
              {mapCategory[state.category]}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <Text style={styles.textLabel}>Description:</Text>
        <View style={[styles.descriptionView, { flex: 0.3 }]}>
          <TextInput
            style={styles.textInput}
            autoCapitalize="sentences"
            multiline
            placeholder="More detailed description of the workout."
            returnKeyType="default"
            blurOnSubmit={false}
            onChangeText={(val) => onDescriptionChange(val)}
          />
        </View>
        {state.pickerVisible ?
          <View style={{ flexDirection: 'row', bottom: 0, position: 'absolute' }}>
            <Picker
              selectedValue={state.category}
              style={{ backgroundColor: '#f0f0f0', flex: 1, }}
              onValueChange={(itemValue, itemIndex) => {
                setState({
                  ...state,
                  category: itemValue,
                  categoryColor: 'black',
                });
              }}
            >
              <Picker.Item label="Track" value="T" />
              <Picker.Item label="Speed" value="S" />
              <Picker.Item label="Hill" value="H" />
              <Picker.Item label="Long" value="L" />
              <Picker.Item label="Core" value="C" />
            </Picker>
          </View>
          : null}
      </View>
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
    marginVertical: 10,
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
  }
});