import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import ActivityFeedScreen from '../screens/ActivityFeedScreen';
import ActivityFromWorkout from '../screens/ActivityFromWorkout';
import UserWorkoutsScreen from '../screens/UserWorkoutsScreen';
import ActivityDetailScreen from '../screens/ActivityDetailScreen';
import EditActivity from '../screens/EditActivity';
import EditProfile from '../screens/EditProfileScreen';
import WorkoutDetailScreen from '../screens/WorkoutDetailScreen';
import { AuthContext } from '../contexts/AuthContext';

const ActivityStack = createStackNavigator();


export default function ActivityTab({ navigation }) {
  const { user } = React.useContext(AuthContext);

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
        initialParams={{ user: null, hideCustomNav: true }}
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
      <ActivityStack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ title: 'Edit Profile' }}
      />
      <ActivityStack.Screen
        name="WorkoutDetail"
        component={WorkoutDetailScreen}
        options={{ title: 'Workout Details' }}
      />
      <ActivityStack.Screen
        name="ActivityFromWorkout"
        component={ActivityFromWorkout}
        options={{ title: "New Activity" }}
      />
    </ActivityStack.Navigator>
  );
}