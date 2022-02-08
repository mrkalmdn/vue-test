import api from '@/api';

const state = {
  clients: [],
  client: {},
};

const mutations = {
  SET_CLIENTS: (state, clients) => (state.clients = clients),
  SET_CLIENT: (state, client) => (state.client = client),
  ADD_CLIENT: (state, client) => state.clients.data.unshift(client),
  UPDATE_CLIENT: (state, client) => {
    if (state.clients?.data?.length > 0) {
      const index = state.clients.data.findIndex((a) => a.id === client.id);
      const selected = state.clients.data[index];

      Object.assign(selected, client);
    } else {
      Object.assign(state.client.data, client);
    }
  },
  DELETE_CLIENT: (state, id) => {
    const index = state.clients.data.findIndex((a) => a.id === id);
    state.clients.data.splice(index, 1);
  },
};

const actions = {
  async getClients({ commit }, payload) {
    const { data } = await api.get('/api/clients?' + payload);

    commit('SET_CLIENTS', data);
  },

  async getClient({ commit }, id) {
    const { data } = await api.get(`/api/clients/${id}`);

    commit('SET_CLIENT', data);
  },

  async addClient({ commit }, payload) {
    const { data } = await api.post('/api/clients', payload);

    commit('ADD_CLIENT', data.data);
  },

  async updateClient({ commit }, payload) {
    const { data } = await api.put(`/api/clients/${payload.id}`, payload);

    commit('UPDATE_CLIENT', data.data);
  },

  async deleteClient({ commit }, id) {
    await api.delete(`/api/clients/${id}`);

    commit('DELETE_CLIENT', id);
  },
};

const getters = {
  clients: (state) => state.clients,
  client: (state) => state.client,
};

export const client = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
