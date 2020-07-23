import * as React from 'react';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import {
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet

} from 'react-native';
import { AuthContext, UserContext } from '../components/context';
import { BASE_URL } from '../helpers';
import Feather from 'react-native-vector-icons/Feather';

/*  TODO:
      Add the activity as a header.
      Modify the API to return user objects.
      Add comments in the renderItem.
      Stuff I am missing.
      Make the edit modal. (I think I waant it to be a modal)
*/


export default function ActivityDetailScreen({ navigation, item_id }) {

  const { user: loggedUser, token } = React.useContext(UserContext);
  const [itemState, setItemState] = useState({
    id: null,
    user: null,
    time: null,
    comment: null,
    workout: null,
  });

  const [commentState, setCommentState] = useState({
    data: null,
    next: 1,
    refreshing: false,
  });

  // Sets the Right header button to be an Edit button
  useLayoutEffect(() => {
    if (loggedUser.id == user.id) {
      navigation.setOptions({
        headerRight: () => (
          <Button
            title="Edit"
            onPress={() => console.log(`Navigate somewhere to edit Activity ${item.id}`)}
          />
        ),
      });
    }
  }, [navigation]);

  // Gets the activity object
  const getActivity = async () => {
    try {
      response = await fetch(`${BASE_URL}activities/${item_id}/`, {
        method: 'GET',
        headers: {
          'Authorization': 'Token ' + token
        },
      });
      data = await response.json();
      setItemState({
        ...itemState,
        ...data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Gets the comments
  const getComments = async () => {
    if (commentState.next != null) {
      try {
        url = `${BASE_URL}activities/${item_id}/comments/?page=${commentState.next}`;
        response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': 'Token ' + token
          },
        });
        let result = await response.json();
        setCommentState({
          ...commentState,
          data:
            commentState.next == 1
              ? result['comments']
              : [...commentState.data, ...result['comments']],
          next: result['next'],
          refreshing: false,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };


  const getDate = () => {
    const itemTime = new Date(itemState.time)
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
    return `${day} at ${time}`; // Removed the leading zero
  }

  // render item functiion
  const renderItem = ({ item }) => (
    <View style={styles.commentView}>
      <Text style={styles.usernameText}>
        {item.user}
        {/* I need to change this later.
        I should update the api to return a user object instead of just an id.
        */}
      </Text>
      <Text style={styles.commentText}>
        {item.text}
      </Text>
    </View>
  );

  // refresh function
  const onRefresh = () => {
    setCommentState({
      ...commentState,
      data: null,
      next: 1,
      refreshing: true,
    });
  };

  // This handles refreshing once state is updated
  useEffect(() => {
    if (commentState.refreshing) {
      getActivity();
      getComments();
    }
  }, [commentState.refreshing])



  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Activity Detail!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commentView: {
    borderTopColor: 'grey',
    borderTopWidth: 1,
    alignSelf: 'stretch',
    flexDirection: 'row',
    paddingVertical: 5,
    marginHorizontal: 5,
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
    flex: 1,
  },
});