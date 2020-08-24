import * as React from 'react';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import {
  Text,
  View,
  Button,
  FlatList,
  StyleSheet,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
} from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { BASE_URL, handleNetworkError, colors } from '../helpers';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';


export default function ActivityDetailScreen({ navigation, route }) {

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  useEffect(() => {
    return () => {
      source.cancel('Clean up from Activity Detail Screen');
    }
  }, []);

  const { item, deleteItem } = route.params;

  const { user: loggedUser, token } = useContext(AuthContext);
  const [itemState, setItemState] = useState({
    id: item.id,
    user: item.user,
    time: item.time,
    comment: item.comment,
    workout: item.workout,
    refreshing: true,
  });

  const axiosBase = axios.create({
    baseURL: BASE_URL,
    timout: 5000,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
    cancelToken: source.token,
  });



  const [commentState, setCommentState] = useState({
    data: null,
    next: 1,
    refreshing: true,
  });

  const [refreshing, setRefreshing] = useState(true);
  // This handles the global refreshing
  useEffect(() => {
    setRefreshing(commentState.refreshing || itemState.refreshing);
  }, [commentState.refreshing, itemState.refreshing]);

  const [newCommentState, setNewCommentState] = useState({
    text: '',
    valid: false,
  });

  const onTextChange = (val) => {
    valid = (val.trim().length !== 0);
    setNewCommentState({
      ...setCommentState,
      text: val,
      valid: valid,
    });
  }


  // Sets the Right header button to be an Edit button
  useLayoutEffect(() => {
    if (loggedUser.id == itemState.user.id) {
      navigation.setOptions({
        headerRight: () => (
          <Button
            title="Edit"
            onPress={() => navigation.navigate('EditActivity', { activity: item, deleteItem })}
          />
        ),
      });
    }
  }, [navigation]);

  // Gets the ativity object
  const getActivity = async () => {
    try {
      response = await axiosBase.get(`/activities/${item.id}/`);
      data = await response.data;
      setItemState({
        ...itemState,
        ...data,
        refreshing: false,
      });
    } catch (error) {
      console.log(error.request);
      handleNetworkError(error);
      setItemState({
        ...itemState,
        refreshing: false,
      });
    }
  };

  // Gets the comments
  const getComments = async () => {
    if (commentState.next != null) {
      try {
        response = await axiosBase.get(`/activities/${item.id}/comments/?page=${commentState.next}`);
        let result = await response.data;
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
        handleNetworkError(error);
        setCommentState({
          ...commentState,
          refreshing: false,
        });
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

  const newComment = async () => {
    if (newCommentState.valid) {
      Keyboard.dismiss();
      try {
        let body_data = {
          activity: itemState.id,
          text: newCommentState.text,
        };
        response = await axiosBase.post(`/comments/`, body_data);
        result = await response.data;
        result.user = loggedUser;
        setNewCommentState({
          ...newCommentState,
          text: '',
          valid: false,
        })
        setCommentState({
          ...commentState,
          data: [...commentState.data, result],
        });
      } catch (error) {
        console.log(error.request);
        handleNetworkError(error);
      }
    }
  }


  const deleteComment = async (comment_id) => {
    try {
      let response = await axiosBase.delete(`/comments/${comment_id}/`);
      // Wait for the response data
      if (response.status == 204) {
        setCommentState({
          ...commentState,
          data: commentState.data.filter(item => item.id != comment_id),
        });
      }
    } catch (error) {
      handleNetworkError(error);
    }
  };

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
  // and when the app first loads
  useEffect(() => {
    if (commentState.refreshing) {
      getActivity();
      getComments();
    }
  }, [commentState.refreshing]);
  // render item functiion
  const renderItem = ({ item }) => (
    <View style={styles.commentView}>
      <Text>
        <Text 
          style={styles.usernameText}
          onPress={() => navigation.push('Profile', { user: item.user, hideCustomNav: true })}
        >
          {item.user.username + ' '}
        </Text>
        <Text style={styles.commentText}>
          {item.text}
        </Text>
      </Text>
      {(item.user.id == loggedUser.id)
        ? <Feather
          name="trash-2"
          size={15}
          color="darkred"
          onPress={() => deleteComment(item.id)}
        />
        : null
      }
    </View>
  );

  const FlatListHeader = () => {
    return (
      <>
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
            <Text
              style={styles.usernameText}
              onPress={() => navigation.push('Profile', { user: item.user, hideCustomNav: true })}
            >
              {itemState.user.username + ' '}
            </Text>
            <Text style={styles.commentText}>
              {itemState.comment}
            </Text>
          </Text>
        </View>
      </>
    );
  }


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="height"
      keyboardVerticalOffset={65}
    >
      <FlatList
        style={{ flex: 1, alignSelf: 'stretch' }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={FlatListHeader}
        data={commentState.data}
        renderItem={renderItem}
        onRefresh={() => onRefresh()}
        refreshing={refreshing}
        keyExtractor={item => item.id.toString()}
        onEndReached={() => getComments()}
        onEndReachedThreshold={0.5}
        extraData={itemState}
      />
      <View style={styles.footerContainer}>
        <TextInput
          style={styles.textInput}
          value={newCommentState.text}
          onChangeText={(val) => onTextChange(val)}
          placeholder="Add a comment..."
          autoCapitalize="sentences"
          multiline
        />
        <Button
          title="Send"
          disabled={!newCommentState.valid}
          onPress={() => newComment()}
        />
      </View>
    </KeyboardAvoidingView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: colors.background,
  },
  headerContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingTop: 5,
    paddingBottom: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 5,
    fontSize: 15,
  },
  time: {
    marginTop: 5,
    fontSize: 12,
    color: '#606060'
  },
  commentView: {
    borderTopColor: 'grey',
    borderTopWidth: 1,
    alignSelf: 'stretch',
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    minHeight: 35,
    alignItems: 'center'
  },
  usernameText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 5,
    paddingRight: 5,
    color: '#000',
  },
  usernameTextPressed: {
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 5,
    paddingRight: 5,
    color: '#777',
  },
  commentText: {
    flex: 1,
  },
  footerContainer: {
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center'
  },
  textInput: {
    flex: 1,
    marginVertical: 10,
    marginLeft: 10,
    color: 'black',
  },
});