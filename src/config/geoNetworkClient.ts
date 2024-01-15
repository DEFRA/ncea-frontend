import { apiBaseURL } from '../utils/constants';
import axios, { AxiosError, AxiosResponse } from 'axios';

const geoNetworkClient = axios.create({
  baseURL: apiBaseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request interceptor
geoNetworkClient.interceptors.request.use(
  (config) => {
    // Modify config before sending the request
    // config.headers['Authorization'] = 'Bearer YOUR_ACCESS_TOKEN';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor

geoNetworkClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // if (check config condition) {
    // Trigger a toast/notification to handle message
    // }
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status && status !== 401) {
      // handle when the user token expires
    }
    return Promise.reject(error);
  },
);

export { geoNetworkClient };
