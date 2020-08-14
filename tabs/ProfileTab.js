import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import ActivityFromWorkout from '../screens/ActivityFromWorkout';
import UserWorkoutsScreen from '../screens/UserWorkoutsScreen';
import ActivityDetailScreen from '../screens/ActivityDetailScreen';
import EditActivity from '../screens/EditActivity';
import EditProfile from '../screens/EditProfileScreen';
import WorkoutDetailScreen from '../screens/WorkoutDetailScreen';

const ProfileStack = createStackNavigator();

export default function ProfileTab({ navigation }) {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ user: null, hideCustomNav: false }}
      />
      <ProfileStack.Screen
        name="Workouts"
        component={UserWorkoutsScreen}
        initialParams={{ user: null }}
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
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ title: 'Edit Profile' }}
      />
      <ProfileStack.Screen
        name="WorkoutDetail"
        component={WorkoutDetailScreen}
        options={{ title: 'Workout Details' }}
      />
    </ProfileStack.Navigator>
  );
}
