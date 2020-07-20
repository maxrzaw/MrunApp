import * as React from 'react';
import { 
  Text, 
  View, 
  Button,
  StyleSheet 
} from 'react-native';
import { AuthContext } from '../components/context'


export default function ProfileScreen({ navigation, route }) {
  // Get signOut() function from context
  const { signOut } = React.useContext(AuthContext);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => signOut()} title="Log Out"
        />
      )
    });
  }, [navigation])
  return (
    <View style={styles.container}>
      <Text>{route.params.user.first_name}'s Profile!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});