import api from '@/api';

const state = {
  users: [],
  user: {},
};

const mutations = {
  SET_USERS: (state, users) => (state.users = users),
  SET_USER: (state, user) => (state.user = user),
  ADD_USER: (state, user) => state.users.data.unshift(user),
  UPDATE_USER: (state, user) => {
    if (state.users?.data?.length > 0) {
      const index = state.users.data.findIndex((a) => a.id === user.id);
      const selected = state.users.data[index];

      Object.assign(selected, user);
    } else {
      Object.assign(state.user.data, user);
    }
  },
  DELETE_USER: (state, id) => {
    const index = state.users.data.findIndex((a) => a.id === id);
    state.users.data.splice(index, 1);
  },
};

const actions = {
  async getUsers({ commit }, payload) {
    const { data } = await api.get('/api/users?' + payload);

    commit('SET_USERS', data);
  },

  async getUser({ commit }, id) {
    const { data } = await api.get(`/api/users/${id}`);

    commit('SET_USER', data);
  },

  async addUser({ commit }, payload) {
    const { data } = await api.post('/api/users', payload);

    commit('ADD_USER', data.data);
  },

  async updateUser({ commit }, payload) {
    const { data } = await api.put(`/api/users/${payload.id}`, payload);

    commit('UPDATE_USER', data.data);
  },

  async deleteUser({ commit }, id) {
    await api.delete(`/api/users/${id}`);

    commit('DELETE_USER', id);
  },
};

const getters = {
  users: (state) => state.users,
  user: (state) => state.user,
};

export const user = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
