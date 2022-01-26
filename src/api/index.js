import Axios from 'axios';
import Cookie from 'js-cookie';

const api = Axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});

if (Cookie.get('token')) {
  api.defaults.headers.common.Authorization = `Bearer ${Cookie.get('token')}`;
}

export default api;
