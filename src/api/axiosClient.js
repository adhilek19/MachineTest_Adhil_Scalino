import axios from 'axios';
import { API_BASE_URL } from '../utils/constants.js';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

axiosClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (data && typeof data === 'object') {
      // Backend returns HTTP 200 even when ResponseCode indicates failure (e.g. 404, 500)
      const hasResponseCode = 'ResponseCode' in data;
      const isNon200Code = hasResponseCode && Number(data.ResponseCode) !== 200;
      const isFailedMessage = typeof data.Message === 'string' && data.Message.trim().toLowerCase() === 'failed';

      if (isNon200Code || isFailedMessage) {
        const error = new Error(data.Message || `Request failed with code ${data.ResponseCode || 'ERROR'}`);
        error.responseCode = data.ResponseCode;
        error.isBusinessError = true;
        error.backendResponse = data;
        return Promise.reject(error);
      }
    }
    return data;
  },
  (error) => {
    let message = 'An unexpected error occurred. Please try again.';
    if (error.response) {
      const responseData = error.response.data;
      if (responseData) {
        if (responseData.ExceptionMessage) {
          message = responseData.ExceptionMessage;
        } else if (responseData.Message) {
          message = responseData.Message;
        }
      } else if (error.response.status === 404) {
        message = 'Requested resource was not found.';
      } else if (error.response.status === 500) {
        message = 'Backend server error. Please check your submission data.';
      }
    } else if (error.request) {
      message = 'Unable to reach the server. Please check your internet connection.';
    } else if (error.message) {
      message = error.message;
    }

    const enhancedError = new Error(message);
    enhancedError.originalError = error;
    enhancedError.status = error.response?.status;
    return Promise.reject(enhancedError);
  }
);

export default axiosClient;
