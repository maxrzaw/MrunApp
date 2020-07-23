import * as React from 'react';
import { Text, View, Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import ActivityFeedScreen from '../screens/ActivityFeedScreen';
import ActivityFromWorkout from '../screens/ActivityFromWorkout';
import UserWorkoutsScreen from '../screens/UserWorkoutsScreen';
import ActivityDetailScreen from '../screens/ActivityDetailScreen';
import { UserContext } from '../components/context';

const ActivityStack = createStackNavigator();


export default function ActivityTab({ navigation }) {
  const { user } = React.useContext(UserContext);

  return (
    <ActivityStack.Navigator>
      <ActivityStack.Screen
        name="Activities"
        component={ActivityFeedScreen}
        initialParams={{ user: user }}
      />
      <ActivityStack.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ user: user }}
      />
      <ActivityStack.Screen
        name="Workouts"
        component={UserWorkoutsScreen}
        initialParams={{ user: user }}
      />
      <ActivityStack.Screen
        name="ActivityFromWorkout"
        component={ActivityFromWorkout}
        options={{ title: "New Activity" }}
      />
      <ActivityStack.Screen
        name="ActivityDetail"
        component={ActivityDetailScreen}
        options={{ title: "Activity" }}
      />
    </ActivityStack.Navigator>
  );
}