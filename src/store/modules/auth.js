import api from '@/api';
import Cookies from 'js-cookie';

const state = {
  user: null,
  token: null,
  authenticated: !!Cookies.get('token'),
};

const mutations = {
  SET_USER: (state, user) => (state.user = user),
  SET_TOKEN: (state, token) => Cookies.set('token', token),
  SET_AUTHENTICATED: (state, authenticated) =>
    (state.authenticated = authenticated),
};

const actions = {
  async login({ commit }, payload) {
    const { data } = await api.post('/api/login', payload);

    commit('SET_USER', data.user);
    commit('SET_TOKEN', data.token);
    commit('SET_AUTHENTICATED', true);
  },

  async me({ commit }) {
    const { data } = await api.get('/api/me');

    commit('SET_USER', data);
  },

  async logout({ commit }) {
    await api.post('/api/logout');

    Cookies.remove('token');
    commit('SET_AUTHENTICATED', false);
  },
};

const getters = {
  user: (state) => state.user,
  token: (state) => state.token,
  authenticated: (state) => state.authenticated,
};

export const auth = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
