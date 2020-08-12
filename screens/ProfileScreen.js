import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { BASE_URL, handleNetworkError } from '../helpers';
import Feather from 'react-native-vector-icons/Feather';
import Activity from '../components/Activity';
import axios from 'axios';


export default function ProfileScreen({ navigation, route }) {
  const { user: loggedUser, token, signOut, group } = React.useContext(AuthContext);
  const { user: routeUser } = route.params;

  // Set selected user to logged user if no user is given
  const selectedUser = (routeUser === null) ? loggedUser : routeUser;

  const [userGroup, setUserGroup] = useState(group);
  const [state, setState] = useState({
    data: null,
    next: 1,
    refreshing: true,
  });

  const axiosBase = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
  });

  const getData = async () => {
    if (state.next != null) {
      try {
        url = `/users/${selectedUser.id}/activities/?page=${state.next}`;
        let response = await axiosBase.get(url);
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
        handleNetworkError(error);
        setState({
          ...state,
          refreshing: false,
        })
      }
    }
  }

  const deleteItem = async (id) => {
    try {
      let response = await axiosBase.delete(`/activities/${id}/`);
      if (response.status == 204) {
        setState({
          ...state,
          data: state.data.filter(activity => activity.id !== id),
        });
        navigation.popToTop();
      } else {
        Alert.alert("Unable to delete");
      }
    } catch (error) {
      handleNetworkError(error);
    }
  }


  const renderItem = ({ item }) => (
    <Activity
      item={item}
      navigation={navigation}
      deleteItem={deleteItem}
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

  // This handles refreshing once state is updated
  useEffect(() => {
    if (state.refreshing) {
      getData();
    }
  }, [state.refreshing])

  const FlatListHeader = () => {
    return (
      <>
        <View style={styles.headerContainer} key={selectedUser}>
          <View style={styles.headerRow}>
            <Text style={styles.fullNameText}>{`${selectedUser.first_name} ${selectedUser.last_name}`}</Text>
            <Text style={styles.groupText}>{userGroup.name}</Text>
          </View>
          <Text style={styles.bioText}>{selectedUser.bio}</Text>
        </View>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.push('Workouts', { user: selectedUser })}
            style={styles.workoutsRow}
          >
            <Text style={styles.workoutsText}>All Workouts</Text>
            <Feather
              name="chevron-right"
              size={25} color="grey"
              style={styles.workoutsArrow}
            />
          </TouchableOpacity>
        </View>
      </>
    );
  }
  useEffect(() => {
    async function fetchData() {
      try {
        console.log('Code ran');
        response = await axiosBase.get(`/membership/?user=${selectedUser.id}`);
        let response_data = await response.data;
        setUserGroup(response_data['group']);
      } catch (error) {
        handleNetworkError(error);
      }
    }
    if (routeUser !== null) {
      fetchData();
    } else {
      setUserGroup(group);
    }
  }, [group, selectedUser])


  React.useLayoutEffect(() => {
    if (loggedUser.id == selectedUser.id) {
      navigation.setOptions({
        headerLeft: () => (
          <Button
            onPress={() => navigation.navigate('EditProfile')}
            title="Edit Profile"
          />
        ),
        headerRight: () => (
          <Button
            onPress={() => signOut()}
            title="Log Out"
          />
        ),
      });
    }
    navigation.setOptions({
      title: selectedUser.first_name,
    });
  }, [navigation, selectedUser]);

  return (
    <View style={[styles.container, { alignItems: 'stretch' }]}>
      <FlatList
        style={styles.flatlist}
        ListHeaderComponent={FlatListHeader}
        data={state.data}
        renderItem={renderItem}
        onRefresh={() => onRefresh()}
        refreshing={state.refreshing}
        keyExtractor={item => item.id.toString()}
        onEndReached={() => getData()}
        onEndReachedThreshold={0.5}
        key={selectedUser}
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
  headerContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    alignSelf: "center",
    backgroundColor: 'white',
    padding: 5,
    marginBottom: 3,
    paddingHorizontal: 10,
  },
  fullNameText: {
    fontSize: 35,
  },
  bioText: {
    fontSize: 15,
  },
  groupText: {
    fontSize: 15,
    paddingRight: 10,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
  },
  workoutsRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutsText: {
    fontSize: 20,
    paddingVertical: 10,
  },
  workoutsArrow: {
  },
  flatlist: {
    width: '100%',
  },
});