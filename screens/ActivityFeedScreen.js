import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  FlatList
} from 'react-native';
import Activity from '../components/Activity';
import { AuthContext } from '../contexts/AuthContext';
import { BASE_URL } from '../helpers';


export default function ActivityFeedScreen({ navigation, route }) {

  

  const { user: loggedUser, token } = React.useContext(AuthContext);

  const [state, setState] = useState({
    data: null,
    next: 1,
    refreshing: true,
  });

  // This handles refreshing once state is updated
  useEffect(() => {
    if (state.refreshing) {
      getData();
    }
  }, [state.refreshing])


  const renderItem = ({ item }) => (
    <Activity
      item={item}
      navigation={navigation}
    />
  );




  const onRefresh = () => {
    setState({
      ...state,
      data: null,
      next: 1,
      refreshing: true,
    });
  }



  const getData = async () => {
    if (state.next != null) {
      try {
        url = `${BASE_URL}activities/?page=${state.next}`
        let response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': 'Token ' + token
          },
        });
        let result = await response.json();
        setState({
          ...state,
          data:
            state.next == 1
              ? result["activities"]
              : [...state.data, ...result["activities"]],
          next: result["next"],
          refreshing: false,
        });
      } catch (error) {
        console.log(error)
      }
    }
  }
  return (
    <View style={[styles.container, { alignItems: 'stretch' }]}>
      <FlatList
        style={styles.flatlist}
        data={state.data}
        renderItem={renderItem}
        onRefresh={() => onRefresh()}
        refreshing={state.refreshing}
        keyExtractor={item => item.id.toString()}
        onEndReached={() => getData()}
        onEndReachedThreshold={0.5}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  flatlist: {
    width: '100%',
  },
});