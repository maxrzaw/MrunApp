import React, { useContext, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { mapCategory } from '../helpers';
import Feather from 'react-native-vector-icons/Feather';
import { AuthContext } from '../contexts/AuthContext';

export default function Suggestion({ navigation, item, loggedUser, deleteItem, disableDelete }) {

  Suggestion.defaultProps = {
    disableDelete: false,
    deleteItem: (id) => console.log(`Deleted Item ${id}`),
  }

  const { groupDict } = useContext(AuthContext);

  const canDelete = (loggedUser.is_staff) && !disableDelete;

  const onDelete = () => {
    Alert.alert(
      'Are you sure?',
      'This will permanently delete the suggestion',
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
      {/* <TouchableOpacity
        onPress={() => navigation.push('SuggestionDetail', { deleteItem, item })}
      > */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.titleText}>{item.workout.title}</Text>
          {canDelete ?
            <Feather
              name="trash-2"
              size={20}
              color="darkred"
              style={{ marginRight: 5 }}
              onPress={() => onDelete()}
            />
            : null
          }

        </View>
        <Text style={styles.descriptionText}>{item.workout.description}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.categoryText}>
            {groupDict[item.group].name}
          </Text>
          <Text style={styles.categoryText}>
            {mapCategory[item.category]}
          </Text>
        </View>
      {/* </TouchableOpacity> */}
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