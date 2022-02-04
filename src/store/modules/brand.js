import api from '@/api';

const state = {
  brands: [],
  brand: {},
};

const mutations = {
  SET_BRANDS: (state, brands) => (state.brands = brands),
  SET_BRAND: (state, brand) => (state.brand = brand),
  ADD_BRAND: (state, brand) => state.brands.data.unshift(brand),
  UPDATE_BRAND: (state, brand) => {
    if (state.brands?.data?.length > 0) {
      const index = state.brands.data.findIndex((a) => a.id === brand.id);
      const selected = state.brands.data[index];

      Object.assign(selected, brand);
    } else {
      Object.assign(state.brand.data, brand);
    }
  },
  DELETE_BRAND: (state, id) => {
    const index = state.brands.data.findIndex((a) => a.id === id);
    state.brands.data.splice(index, 1);
  },
};

const actions = {
  async getBrands({ commit }, payload) {
    const { data } = await api.get('/api/brands?' + payload);

    commit('SET_BRANDS', data);
  },

  async getBrand({ commit }, id) {
    const { data } = await api.get(`/api/brands/${id}`);

    commit('SET_BRAND', data);
  },

  async addBrand({ commit }, payload) {
    const { data } = await api.post('/api/brands', payload);

    commit('ADD_BRAND', data.data);
  },

  async updateBrand({ commit }, payload) {
    const { data } = await api.put(`/api/brands/${payload.id}`, payload);

    commit('UPDATE_BRAND', data.data);
  },

  async deleteBrand({ commit }, id) {
    await api.delete(`/api/brands/${id}`);

    commit('DELETE_BRAND', id);
  },
};

const getters = {
  brands: (state) => state.brands,
  brand: (state) => state.brand,
};

export const brand = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
