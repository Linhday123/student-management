import axios from 'axios';
import API_BASE_URL from './api/config';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
