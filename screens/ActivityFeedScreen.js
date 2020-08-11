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
import axios from 'axios';


export default function ActivityFeedScreen({ navigation, route }) {

  const { user: loggedUser, token, group } = React.useContext(AuthContext);
  const axiosActivitiesBase = axios.create({
    baseURL: `${BASE_URL}/activities`,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    }
  });
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
      let response = await axiosActivitiesBase.delete(`/${id}/`);
      if (response.status == 204) {
        setState({
          ...state,
          data: state.data.filter(activity => activity.id !== id),
        });
        navigation.popToTop();
      }

    } catch (error) {
      if (error.code == 'ECONNABORTED') {
        Alert.alert("Check your internet connection");
      } else {
        Alert.alert("Error deleting");
      }
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
        let response = await axiosActivitiesBase.get(`/?page=${state.next}${filter}`);
        let result = await response.data;
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
        if (error.code == 'ECONNABORTED') {
          Alert.alert("Check your internet connection");
          setState({
            ...state,
            refreshing: false,
          });
        } else {
          Alert.alert("Error Refreshing", "", [{
            text: "OK?", onPress: () => setState({
              ...state,
              refreshing: false,
            })
          }]);
        }
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