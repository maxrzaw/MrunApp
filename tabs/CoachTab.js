import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import GroupModal from '../components/GroupModal';
// import CoachScreen from '../screens/CoachScreen'

import { createStackNavigator } from '@react-navigation/stack'

// const TodayStack = createStackNavigator();


export default function TodayTab({ navigation }) {

  const [visible, setVisible] = React.useState(false);

  const onGroupChange = (val) => {
    //setVisible(false);
  }

  return (
    <>
      <View style={styles.container}>
        <Text>Coach Screen</Text>
      </View>
      <GroupModal
        onChange={onGroupChange}
        visible={visible}
        setVisible={setVisible}
      />
      <Button
        title="Show Modal"
        onPress={() => setVisible(true)}
      />
      <Button
        title="Hide Modal"
        onPress={() => setVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});