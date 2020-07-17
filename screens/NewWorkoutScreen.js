import * as React from 'react';
import { useContext } from 'react';
import { Text, View, Button, Alert } from 'react-native';
import { BASE_URL } from '../helpers';
import { UserContext } from '../components/context';


export default function NewWorkoutScreen({ navigation }) {
  const { token } = useContext(UserContext);
  const save = async () => {
    try {
      // Do stuff
      let body_data = {
        "title": "8x40m",
        "description": "8 by 40m with 4 min rest. These are for speed and I reccomend wearing spikes if possible.",
        "category": "S"
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
    console.log("Saved returned");
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => save()} title="Save" />
      ),
    });
  }, [navigation]);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>New Workout!</Text>
    </View>
  );
}