import Axios from 'axios';
import store from '@/store';

const api = Axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  function (config) {
    const accessToken = store.state.auth.token;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default api;
