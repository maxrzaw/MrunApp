// Some helper functions an constants
import { StyleSheet } from 'react-native'

// export const BASE_URL = "http://localhost:80/api/v1/"
export const BASE_URL = "https://api.maxzawisa.com/api/v1/"

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

