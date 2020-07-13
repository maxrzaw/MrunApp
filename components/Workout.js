import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default class Workout extends React.Component {
    constructor(props) {
        super(props)
        /*
        props:
        navigation
        id - for navigation
        title
        description
        category
        owner
        */
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.titleText}>
                    400 Repeats
                </Text>
                <Text style={styles.descriptionText}>
                    4x400m with 4 min rest{"\n"}
                    Spikes are not reccomended{"\n"}
                    70% effort
                </Text>
                <View>
                    <TouchableOpacity>
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