import * as React from 'react';
import { Text, View, Button, TouchableOpacity, } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import WorkoutsScreen from '../screens/WorkoutsScreen';
import WorkoutDetailScreen from '../screens/WorkoutDetailScreen';
import Feather from 'react-native-vector-icons/Feather';

const WorkoutStack = createStackNavigator();

export default function WorkoutTab({ navigation }) {
  return (
    <WorkoutStack.Navigator initialRouteName={"Home"}>
      <WorkoutStack.Screen
        name="Home"
        component={WorkoutsScreen}
        options={{
          title: 'Workouts',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('NewWorkout')}
            >
              <View style={{ marginRight: 5 }}>
                <Feather
                  name="plus-circle"
                  color="black"
                  size={25}
                />
              </View>
            </TouchableOpacity>
          )
        }}
      />
      <WorkoutStack.Screen
        name="WorkoutDetail"
        component={WorkoutDetailScreen}
        options={{ title: 'Workout Details' }}
      />
    </WorkoutStack.Navigator>
  );
}