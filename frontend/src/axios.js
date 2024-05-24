import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true, // Important for cookies to be sent with requests
});

export default axiosInstance;
