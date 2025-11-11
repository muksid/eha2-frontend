import axios from 'axios';

import { BASE_URL } from 'configs/auth.config';


const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axios.defaults.withCredentials = true;

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
