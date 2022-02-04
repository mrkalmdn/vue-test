import api from '@/api';

const state = {
  uoms: [],
  uom: {},
};

const mutations = {
  SET_UOMS: (state, uoms) => (state.uoms = uoms),
  SET_UOM: (state, uom) => (state.uom = uom),
  ADD_UOM: (state, uom) => state.uoms.data.unshift(uom),
  UPDATE_UOM: (state, uom) => {
    if (state.uoms?.data?.length > 0) {
      const index = state.uoms.data.findIndex((a) => a.id === uom.id);
      const selected = state.uoms.data[index];

      Object.assign(selected, uom);
    } else {
      Object.assign(state.uom.data, uom);
    }
  },
  DELETE_UOM: (state, id) => {
    const index = state.uoms.data.findIndex((a) => a.id === id);
    state.uoms.data.splice(index, 1);
  },
};

const actions = {
  async getUOMs({ commit }, payload) {
    const { data } = await api.get('/api/uoms?' + payload);

    commit('SET_UOMS', data);
  },

  async getUOM({ commit }, id) {
    const { data } = await api.get(`/api/uoms/${id}`);

    commit('SET_UOM', data);
  },

  async addUOM({ commit }, payload) {
    const { data } = await api.post('/api/uoms', payload);

    commit('ADD_UOM', data.data);
  },

  async updateUOM({ commit }, payload) {
    const { data } = await api.put(`/api/uoms/${payload.id}`, payload);

    commit('UPDATE_UOM', data.data);
  },

  async deleteUOM({ commit }, id) {
    await api.delete(`/api/uoms/${id}`);

    commit('DELETE_UOM', id);
  },
};

const getters = {
  uoms: (state) => state.uoms,
  uom: (state) => state.uom,
};

export const uom = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
