import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { mapCategory } from '../helpers'
import Feather from 'react-native-vector-icons/Feather';

export default function Workout({ navigation, item, deleteItem }) {


  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <Text style={styles.titleText}>{item.title}</Text>
        <Feather 
          name="trash-2" 
          size={20} color="darkred" 
          style={{marginRight: 5}}
          onPress={() => deleteItem(item.id)}
        />
      </View>
      <Text style={styles.descriptionText}>{item.description}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("WorkoutDetail", { item: item })}
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
    backgroundColor: '#00274C',
    borderRadius: 5,
    borderWidth: 1,
    alignContent: 'center',
    borderColor: '#00274C',
  },
  maizeText: {
    color: '#FFCB05',
    textAlign: 'center'
  },
  categoryText: {
    padding: 6,
    margin: 5,
    color: '#000',
    fontWeight: 'bold',
  },

});