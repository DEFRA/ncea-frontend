/**
 * elasticSearchClient
 *
 * This module provides an Axios client instance configured with the necessary settings to make HTTP requests to a Geo Network API.
 * It includes request and response interceptors for modifying requests and handling responses.
 */

import { Config } from './environmentConfig';
import axios, { AxiosError, AxiosResponse } from 'axios';

/**
 * The Axios client instance for making HTTP requests to the Geo Network API.
 */
const elasticSearchClient = axios.create({
  baseURL: Config.elasticSearchAPI,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 *
 * Modifies the request configuration before sending the request.
 *
 * @param config - The request configuration object.
 * @returns The modified request configuration.
 */
elasticSearchClient.interceptors.request.use(
  (config) => {
    // Modify config before sending the request
    // config.headers['Authorization'] = 'Bearer YOUR_ACCESS_TOKEN';
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/**
 * Response interceptor
 *
 * Handles the response received from the server.
 *
 * @param response - The response object received from the server.
 * @returns The response object.
 */
elasticSearchClient.interceptors.response.use(
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
  }
);

export { elasticSearchClient };
