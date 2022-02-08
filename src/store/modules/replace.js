import api from '@/api';

const state = {
  replaces: [],
  replace: {},
};

const mutations = {
  SET_REPLACES: (state, replaces) => (state.replaces = replaces),
  SET_REPLACE: (state, replace) => (state.replace = replace),
  ADD_REPLACE: (state, replace) => state.replaces.data.unshift(replace),
  UPDATE_REPLACE: (state, replace) => {
    if (state.replaces?.data?.length > 0) {
      const index = state.replaces.data.findIndex((a) => a.id === replace.id);
      const selected = state.replaces.data[index];

      Object.assign(selected, replace);
    } else {
      Object.assign(state.replace.data, replace);
    }
  },
  DELETE_REPLACE: (state, id) => {
    const index = state.replaces.data.findIndex((a) => a.id === id);
    state.replaces.data.splice(index, 1);
  },
};

const actions = {
  async getReplaces({ commit }, payload) {
    const { data } = await api.get('/api/returns?' + payload);

    commit('SET_REPLACES', data);
  },

  async getReplace({ commit }, id) {
    const { data } = await api.get(`/api/returns/${id}`);

    commit('SET_REPLACE', data);
  },

  async addReplace({ commit }, payload) {
    const { data } = await api.post('/api/returns', payload);

    commit('ADD_REPLACE', data.data);
  },

  async updateReplace({ commit }, payload) {
    const { data } = await api.put(`/api/returns/${payload.id}`, payload);

    commit('UPDATE_REPLACE', data.data);
  },

  async deleteReplace({ commit }, id) {
    await api.delete(`/api/returns/${id}`);

    commit('DELETE_REPLACE', id);
  },
};

const getters = {
  replaces: (state) => state.replaces,
  replace: (state) => state.replace,
};

export const replace = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
