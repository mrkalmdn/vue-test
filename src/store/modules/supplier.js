import api from '@/api';

const state = {
  suppliers: [],
  supplier: {},
};

const mutations = {
  SET_SUPPLIERS: (state, suppliers) => (state.suppliers = suppliers),
  SET_SUPPLIER: (state, supplier) => (state.supplier = supplier),
  ADD_SUPPLIER: (state, supplier) => state.suppliers.data.unshift(supplier),
  UPDATE_SUPPLIER: (state, supplier) => {
    if (state.suppliers?.data?.length > 0) {
      const index = state.suppliers.data.findIndex((a) => a.id === supplier.id);
      const selected = state.suppliers.data[index];

      Object.assign(selected, supplier);
    } else {
      Object.assign(state.supplier.data, supplier);
    }
  },
  DELETE_SUPPLIER: (state, id) => {
    const index = state.suppliers.data.findIndex((a) => a.id === id);
    state.suppliers.data.splice(index, 1);
  },
};

const actions = {
  async getSuppliers({ commit }, payload) {
    const { data } = await api.get('/api/suppliers?' + payload);

    commit('SET_SUPPLIERS', data);
  },

  async getSupplier({ commit }, id) {
    const { data } = await api.get(`/api/suppliers/${id}`);

    commit('SET_SUPPLIER', data);
  },

  async addSupplier({ commit }, payload) {
    const { data } = await api.post('/api/suppliers', payload);

    commit('ADD_SUPPLIER', data.data);
  },

  async updateSupplier({ commit }, payload) {
    const { data } = await api.put(`/api/suppliers/${payload.id}`, payload);

    commit('UPDATE_SUPPLIER', data.data);
  },

  async deleteProduct({ commit }, id) {
    await api.delete(`/api/suppliers/${id}`);

    commit('DELETE_SUPPLIER', id);
  },
};

const getters = {
  suppliers: (state) => state.suppliers,
  supplier: (state) => state.supplier,
};

export const supplier = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
