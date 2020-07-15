import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function Workout({ navigation, item }) {
    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>{item.title}</Text>
            <Text style={styles.descriptionText}>{item.description}</Text>
            <View>
                <TouchableOpacity
                  onPress={() => navigation.navigate("WorkoutDetail", {item: item})}
                >
                    <View style={styles.runWorkoutView}>
                        <Text style={styles.runWorkoutText}>
                            Run Workout
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        justifyContent: "flex-start",
        alignItems: 'stretch',
        borderWidth: 1,
        borderColor: 'black',
        marginVertical: 5,
        marginHorizontal: 5,
        borderRadius: 10,
        
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left',
        marginTop: 5,
        marginHorizontal: 5,
    },
    descriptionText: {
        textAlign: 'left',
        paddingHorizontal: 5,
    },
    footer: {
        flexDirection: 'row',
    },
    runWorkoutView: {
        padding: 6,
        margin: 5,
        backgroundColor: '#00274C',
        borderRadius: 5,
        borderWidth: 1,
        width: 98,
        alignContent: 'center',
        borderColor: '#00274C',
    },
    runWorkoutText: {
        color: '#FFCB05',
    },
});