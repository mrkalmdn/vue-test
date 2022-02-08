import api from '@/api';

const state = {
  inventories: [],
  inventory: {},
};

const mutations = {
  SET_INVENTORYS: (state, inventories) => (state.inventories = inventories),
  SET_INVENTORY: (state, inventory) => (state.inventory = inventory),
  ADD_INVENTORY: (state, inventory) =>
    state.inventories.data.unshift(inventory),
  UPDATE_INVENTORY: (state, inventory) => {
    if (state.inventories?.data?.length > 0) {
      const index = state.inventories.data.findIndex(
        (a) => a.id === inventory.id
      );
      const selected = state.inventories.data[index];

      Object.assign(selected, inventory);
    } else {
      Object.assign(state.inventory.data, inventory);
    }
  },
  DELETE_INVENTORY: (state, id) => {
    const index = state.inventories.data.findIndex((a) => a.id === id);
    state.inventories.data.splice(index, 1);
  },
};

const actions = {
  async getInventories({ commit }, payload) {
    const { data } = await api.get('/api/inventories?' + payload);

    commit('SET_INVENTORYS', data);
  },

  async getInventory({ commit }, id) {
    const { data } = await api.get(`/api/inventories/${id}`);

    commit('SET_INVENTORY', data);
  },

  async addInventory({ commit }, payload) {
    const { data } = await api.post('/api/inventories', payload);

    commit('ADD_INVENTORY', data.data);
  },

  async updateInventory({ commit }, payload) {
    const { data } = await api.put(`/api/inventories/${payload.id}`, payload);

    commit('UPDATE_INVENTORY', data.data);
  },

  async deleteInventory({ commit }, id) {
    await api.delete(`/api/inventories/${id}`);

    commit('DELETE_INVENTORY', id);
  },
};

const getters = {
  inventories: (state) => state.inventories,
  inventory: (state) => state.inventory,
};

export const inventory = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
