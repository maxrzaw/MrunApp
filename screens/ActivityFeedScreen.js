import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  FlatList,
  Alert
} from 'react-native';
import Activity from '../components/Activity';
import { AuthContext } from '../contexts/AuthContext';
import { BASE_URL } from '../helpers';
import { ButtonGroup } from 'react-native-elements';
import { throttle } from 'underscore';


export default function ActivityFeedScreen({ navigation, route }) {



  const { user: loggedUser, token, group } = React.useContext(AuthContext);
  var name = group ? group.name : 'My Group';

  const buttons = ['All', name];

  const [state, setState] = useState({
    data: null,
    next: 1,
    refreshing: true,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    onRefresh();
  }, [selectedIndex]);

  // This handles refreshing once state is updated
  useEffect(() => {
    if (state.refreshing) {
      getData();
    }
  }, [state.refreshing])


  const deleteItem = async (id) => {
    try {
      let response = await fetch(`${BASE_URL}activities/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      });
      if (response.ok) {
        setState({
          ...state,
          data: state.data.filter(activity => activity.id !== id),
        });
        navigation.popToTop();
      } else {
        Alert.alert("Unable to delete");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Unable to reach server");
    }
  }


  const renderItem = ({ item }) => (
    <Activity
      item={item}
      deleteItem={deleteItem}
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
  };



  const getData = async () => {
    if (state.next != null) {
      try {
        let filter = selectedIndex ? '&filter=group' : '';
        url = `${BASE_URL}activities/?page=${state.next}${filter}`
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
      <ButtonGroup
        selectedIndex={selectedIndex}
        buttons={buttons}
        containerStyle={styles.btnGroup}
        onPress={(val) => setSelectedIndex(val)}
      />
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
  btnGroup: {
    height: 35,
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 0,
  },
});