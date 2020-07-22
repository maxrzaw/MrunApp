import * as React from 'react';
import { useContext, useEffect, useLayoutEffect } from 'react';
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

  };

  // Gets the comments
  const getComments = async () => {

  };

  // render item functiion
  const renderItem = ({ item }) => (
    <View>
      <Text>
        Comment here
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
});