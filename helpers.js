// Some helper functions an constants

export const BASE_URL = "http://localhost:8000/api/v1/"
//'http://192.168.1.15:8000/api/v1/'

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
