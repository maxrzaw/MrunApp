import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
// import CoachScreen from '../screens/CoachScreen'

import { createStackNavigator } from '@react-navigation/stack'

// const TodayStack = createStackNavigator();

export default function TodayTab({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Coach Screen</Text>
        </View>
    );
}

styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});