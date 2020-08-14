import React, { useContext } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Alert
} from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { mapCategory } from '../helpers'


export default function WorkoutDetailScreen({ navigation, route }) {

  WorkoutDetailScreen.defaultProps = {
    disableDelete: false,
    deleteItem: (id) => console.log(`Deleted Item ${id}`),
  }

  const { item, deleteItem, disableDelete } = route.params;
  const { user } = useContext(AuthContext);

  const onDeleteConfirmed = async () => {
    try {
      await deleteItem(item.id);
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  }

  const onDelete = () => {
    Alert.alert(
      'Are you sure?',
      'This will permanently delete the workout',
      [
        {
          text: 'Cancel',
          onPress: () => null
        },
        {
          text: 'Delete',
          onPress: () => onDeleteConfirmed(),
          style: 'destructive'
        }
      ],
      { cancelable: false }
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.workoutView}>
        <Text style={styles.titleText}>{item.title}</Text>
        <Text style={styles.categoryText}>{mapCategory[item.category]}</Text>
        <View style={styles.descriptionView}>
          <Text style={styles.descriptionText}>{item.description}</Text>
        </View>

        {/* Title, Description, Category, owner_id */}
      </View>
      <View style={styles.buttonView}>
        <Pressable
          onPress={() => navigation.navigate("ActivityFromWorkout", { item })}
        >
          <Text style={[styles.runWorkoutText, styles.button]}>Run Workout</Text>
        </Pressable>
        {
          user.is_staff ?
            <Pressable
              onPress={() => navigation.navigate('SuggestionFromWorkout', { item })}
            >
              <Text style={[styles.runWorkoutText, styles.button]}>Suggest Workout</Text>
            </Pressable>
            : null
        }
        {
          item.owner == user.id && !disableDelete ?
            <Pressable
              onPress={() => onDelete()}
            >
              <Text style={[styles.deleteText, styles.button]}>Delete Workout</Text>
            </Pressable>
            : null
        }
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#fff',
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'left',
    marginHorizontal: 5,
  },
  descriptionView: {
    marginHorizontal: 5,
    marginVertical: 5,
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  descriptionText: {
    fontSize: 15,
    fontWeight: 'normal',
    textAlign: 'left',

  },
  categoryText: {
    marginLeft: 5,
    fontWeight: 'bold',
    fontSize: 12,
    color: '#000',
  },
  workoutView: {
    flex: 1,
  },
  buttonView: {
    flex: 0,
  },
  button: {
    fontSize: 20,
    fontWeight: '500',
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginHorizontal: 5,
    justifyContent: 'center',
    textAlign: "center",
    marginBottom: 5,
  },
  runWorkoutText: {
    color: '#FFCB05',
    backgroundColor: '#00274C',
  },
  deleteText: {
    color: '#fff',
    backgroundColor: 'darkred',
  }
});