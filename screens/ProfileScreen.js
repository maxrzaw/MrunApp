import * as React from 'react';
import { Text, View, Button } from 'react-native';
import { AuthContext } from '../components/context'


export default function ProfileScreen({ navigation }) {
    // Get signOut() function from context
    const { signOut } = React.useContext(AuthContext);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Profile!</Text>
        <Button title="Sign Out" onPress={() => signOut()}/>
      </View>
    );
  }