import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { mapCategory, colors } from '../helpers'
import Feather from 'react-native-vector-icons/Feather';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function Workout({ navigation, item, loggedUser, deleteItem, disableDelete }) {

  Workout.defaultProps = {
    disableDelete: false,
    deleteItem: (id) => console.log(`Deleted Item ${id}`),
  }


  const canDelete = (item.owner == loggedUser.id) && !disableDelete;

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
          onPress: () => deleteItem(item.id),
          style: 'destructive'
        }
      ],
      { cancelable: false }
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.push('WorkoutDetail', {deleteItem, item})}
      >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={styles.titleText}>{item.title}</Text>
        {canDelete ?
          <Feather
            name="trash-2"
            size={20} 
            color={colors.deleteRed}
            style={{ marginRight: 5 }}
            onPress={() => onDelete()}
          />
          : null
        }

      </View>
      <Text style={styles.descriptionText}>{item.description}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ActivityFromWorkout", { item })}
        >
          <View style={styles.runWorkoutView}>
            <Text style={styles.maizeText}>
              Run Workout
            </Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.categoryText}>
          {mapCategory[item.category]}
        </Text>
      </View>
      </TouchableOpacity>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    justifyContent: "flex-start",
    alignItems: 'stretch',
    borderWidth: 1,
    borderColor: 'black',
    marginVertical: 5,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    //marginTop: 5,
    marginHorizontal: 5,
    paddingVertical: 5,
  },
  descriptionText: {
    textAlign: 'left',
    paddingHorizontal: 5,
  },
  footer: {
    flexDirection: 'row',
  },
  runWorkoutView: {
    padding: 6,
    margin: 5,
    backgroundColor: colors.blue,
    borderRadius: 5,
    borderWidth: 1,
    alignContent: 'center',
    borderColor: colors.blue,
  },
  maizeText: {
    color: colors.maize,
    textAlign: 'center'
  },
  categoryText: {
    padding: 6,
    margin: 5,
    color: '#000',
    fontWeight: 'bold',
  },
});