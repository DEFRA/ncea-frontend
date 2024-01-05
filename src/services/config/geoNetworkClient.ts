import axios, { AxiosError } from 'axios';
import { apiBaseURL } from '../../utils/constants';

const geoNetworkClient = axios.create({
  baseURL: apiBaseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

geoNetworkClient.interceptors.response.use(undefined, (error: AxiosError) => {
  const status = error.response?.status;

  if (status && status !== 401) {
    // handle when the user token expires
  }
  return Promise.reject(error);
});

export { geoNetworkClient };
