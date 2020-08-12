// Some helper functions an constants
import { StyleSheet, Alert } from 'react-native'

// export const BASE_URL = "http://localhost/api/v1"
export const BASE_URL = "https://api.maxzawisa.com/api/v1"

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    }
})

export const mapCategory = {
    'T': 'Track',
    'S': 'Speed',
    'H': 'Hill',
    'L': 'Long',
    'C': 'Core',
}

export const mapYear = {
    'FR': 'Freshman',
    'SO': 'Sophomore',
    'JR': 'Junior',
    'SR': 'Senior',
    'GR': 'Graduate',
}

export const handleNetworkError = (error) => {
    if (error.code == 'ECONNABORTED') {
        Alert.alert("Check your internet connection");
    } else if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    } else if (error.request) {
        console.log(error.request);
        Alert.alert("Check your internet connection");
    } else {
        console.log(error);
    }

}
