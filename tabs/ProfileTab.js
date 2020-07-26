import * as React from 'react';
import { Text, View, Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import ActivityFeedScreen from '../screens/ActivityFeedScreen';
import ActivityFromWorkout from '../screens/ActivityFromWorkout';
import UserWorkoutsScreen from '../screens/UserWorkoutsScreen';
import ActivityDetailScreen from '../screens/ActivityDetailScreen';
import { UserContext } from '../components/context';
import EditActivity from '../screens/EditActivity';

const ProfileStack = createStackNavigator();


export default function ProfileTab({ navigation }) {

  const { user } = React.useContext(UserContext);
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Home"
        component={ProfileScreen}
        initialParams={{ user: user, refresh: false }}
      />
      <ProfileStack.Screen
        name="Workouts"
        component={UserWorkoutsScreen}
        initialParams={{ user: user }}
      />
      <ProfileStack.Screen
        name="Activities"
        component={ActivityFeedScreen}
        initialParams={{ user: user }}
      />
      <ProfileStack.Screen
        name="ActivityFromWorkout"
        component={ActivityFromWorkout}
        options={{ title: "New Activity" }}
      />
      <ProfileStack.Screen
        name="ActivityDetail"
        component={ActivityDetailScreen}
        options={{ title: "Activity" }}
      />
      <ProfileStack.Screen
        name="EditActivity"
        component={EditActivity}
        options={{ title: 'Edit Avtivity' }}
      />
    </ProfileStack.Navigator>
  );
}
