import axios from 'axios'
import { CONSTANTS } from '../constants'
import { AuthResponse } from '../models/response/AuthResponse'

export const API_URL = 'http://localhost:3000/api'

export const $api = axios.create({
    withCredentials: true,
    baseURL: "" + API_URL
})

$api.interceptors.request.use((config) => {
    if (config.headers) {

        config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
        return config;
    }
})

$api.interceptors.response.use((config) => {
    return config;
}, async err => {
    const originalRequest = err.config
    if (err.response.status === 401 && err.config && !err.config._isRetry) {
        originalRequest._isRetry = true
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials: true })

            localStorage.setItem('token', response.data.accessToken)

            return $api.request(originalRequest)
        } catch {
            console.log(CONSTANTS.NOT_AUTH);
        }
    }
    throw err
})