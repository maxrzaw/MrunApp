import * as React from 'react';
import { Text, View, Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import ActivityFeedScreen from '../screens/ActivityFeedScreen';
import ActivityFromWorkout from '../screens/ActivityFromWorkout';
import UserWorkoutsScreen from '../screens/UserWorkoutsScreen';
import ActivityDetailScreen from '../screens/ActivityDetailScreen';
import EditActivity from '../screens/EditActivity';
import { UserContext } from '../components/context';

const ActivityStack = createStackNavigator();


export default function ActivityTab({ navigation }) {
  const { user } = React.useContext(UserContext);

  return (
    <ActivityStack.Navigator>
      <ActivityStack.Screen
        name="Home"
        component={ActivityFeedScreen}
        options={{ title: "Activities" }}
        initialParams={{ refresh: "false" }}
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
        name="ActivityDetail"
        component={ActivityDetailScreen}
        options={{ title: "Activity" }}
      />
      <ActivityStack.Screen
        name="EditActivity"
        component={EditActivity}
        options={{ title: 'Edit Avtivity' }}
      />
    </ActivityStack.Navigator>
  );
}