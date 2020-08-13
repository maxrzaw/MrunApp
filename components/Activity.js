import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { mapCategory } from '../helpers'

export default function Activity({ navigation, item, deleteItem }) {

  const { workout, user } = item;

  const getDate = () => {
    const itemTime = new Date(item.time)
    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    let day = ''
    if (today.toDateString() == itemTime.toDateString()) {
      day = 'Today';
    } else if (yesterday.toDateString() == itemTime.toDateString()) {
      day = 'Yesterday';
    } else {
      day = itemTime.toLocaleDateString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
    time = itemTime.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
    return `${day} at ${time}`;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.push('ActivityDetail', { item, deleteItem })}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
          <Text style={styles.titleText}>{workout.title}</Text>
          <Text style={styles.date}>{getDate()}</Text>

        </View>

        <View style={{ flexDirection: 'row', alignItems: "flex-start", justifyContent: 'space-between' }}>
          <Text style={styles.descriptionText}>{workout.description}</Text>
          <Text style={styles.categoryText}>
            {mapCategory[workout.category]}
          </Text>
        </View>
        <View style={styles.commentView}>
          <Text style={styles.usernameText}>{user.username}</Text>
          <Text style={styles.commentText}>{item.comment}</Text>
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
    flex: 1,
    textAlign: 'left',
    paddingHorizontal: 5,
    //width: '80%', // TODO: I don't like this
    //backgroundColor: 'red',
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
    flex: 0,
    color: '#000',
    fontWeight: 'bold',
    marginHorizontal: 5,
    //backgroundColor: 'red'
  },
  date: {
    paddingRight: 5,
  },
  commentView: {
    borderTopColor: 'grey',
    borderTopWidth: 1,
    alignSelf: 'stretch',
    flexDirection: 'row',
    paddingVertical: 5,
    marginHorizontal: 5,
    marginTop: 5,
    justifyContent: 'flex-start'
  },
  usernameText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 5,
    flex: 0,

  },
  commentText: {
    paddingRight: 5,
    marginRight: 5,
    flex: 1,
  },
});