import * as React from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';


export default function WorkoutDetailScreen({ navigation, route: { params: { item } } }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.headerContainer}>
          <Text style={styles.title}>
            {itemState.workout.title}
          </Text>

          <Text style={styles.description}>
            {itemState.workout.description}
          </Text>
          <Text style={styles.time}>
            {getDate()}
          </Text>
        </View>
        <View style={styles.commentView}>
          <Text>
            <Text style={styles.usernameText}>
              {itemState.user.username + '  '}
            </Text>
            <Text style={styles.commentText}>
              {itemState.comment}
            </Text>
          </Text>
        </View>
    </View>
  );
}
const styles = StyleSheet.create({
  usernameText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 5,
    paddingRight: 5,

  },
  commentText: {
    flex: 1,
  },
});