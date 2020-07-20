import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  FlatList
} from 'react-native';
import { AuthContext, UserContext } from '../components/context'
import { BASE_URL } from '../helpers';


export default function ProfileScreen({ navigation, route }) {
  // Get signOut() function from context
  const { signOut } = React.useContext(AuthContext);
  const { user: loggedUser, token } = React.useContext(UserContext);
  const { user: selectedUser } = route.params;

  const [userGroup, setUserGroup] = useState(null);
  const [userInGroup, setUserInGroup] = useState(false);

  const FlatListHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.fullNameText}>{`${selectedUser.first_name} ${selectedUser.last_name}`}</Text>
          {userInGroup ?
            <Text style={styles.groupText}>{userGroup.name}</Text>
            : null
          }
        </View>
        <Text style={styles.bioText}>{selectedUser.bio}</Text>
      </View>
    );
  }
  useEffect(() => {
    async function fetchData() {
      console.log("Fetch ran!");
      try {
        response = await fetch(`${BASE_URL}membership/?user=${selectedUser.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token,
          },
        });
        let response_data = await response.json();
        if (response.ok) {
          setUserGroup(response_data['group']);
          setUserInGroup(true);
        } else {
          setUserInGroup(false);
        }

        console.log(response_data);
      } catch (error) {
        console.log(error);
      }
    }
    console.log("WTF!");
    fetchData();
  }, [])


  React.useLayoutEffect(() => {
    if (loggedUser.id == selectedUser.id) {
      navigation.setOptions({
        headerRight: () => (
          <Button
            onPress={() => signOut()} title="Log Out"
          />
        )
      });
    }
  }, [navigation])
  return (
    <View style={styles.container}>
      <FlatListHeader />
      <View style={{width: '98%', backgroundColor: 'red'}}>
        <Text>Hi</Text>
      </View>
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
    width: '98%',
    alignSelf: "center",
    backgroundColor: 'white',
    padding: 5,
    marginBottom: 10,
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
});