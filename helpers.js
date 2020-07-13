// Some helper functions an constants

// export const BASE_URL = "http://localhost:8000/api/v1/"
export const BASE_URL = "http://10.0.0.234:8000/api/v1/"


export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
