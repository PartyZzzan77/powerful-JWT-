import axios, { AxiosHeaders } from 'axios'

const API_URL = 'http//localhost:3000/api'

export const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

$api.interceptors.request.use(config => {
    config.headers = { ...config.headers } as AxiosHeaders;

    const token = `Bearer ${localStorage.getItem('token')}`
    config.headers.set('Authorization', token);

    return config
})