import api from '@/api';

const state = {
  products: [],
  product: {},
};

const mutations = {
  SET_PRODUCTS: (state, products) => (state.products = products),
  SET_PRODUCT: (state, product) => (state.product = product),
  ADD_PRODUCT: (state, product) => state.products.data.unshift(product),
  UPDATE_PRODUCT: (state, product) => {
    if (state.products?.data?.length > 0) {
      const index = state.products.data.findIndex((a) => a.id === product.id);
      const selected = state.products.data[index];

      Object.assign(selected, product);
    } else {
      Object.assign(state.product.data, product);
    }
  },
  DELETE_PRODUCT: (state, id) => {
    const index = state.products.data.findIndex((a) => a.id === id);
    state.products.data.splice(index, 1);
  },
};

const actions = {
  async getProducts({ commit }, payload) {
    const { data } = await api.get('/api/products?' + payload);

    commit('SET_PRODUCTS', data);
  },

  async getProduct({ commit }, id) {
    const { data } = await api.get(`/api/products/${id}`);

    commit('SET_PRODUCT', data);
  },

  async addProduct({ commit }, payload) {
    const { data } = await api.post('/api/products', payload);

    commit('ADD_PRODUCT', data.data);
  },

  async updateProduct({ commit }, payload) {
    const { data } = await api.put(`/api/products/${payload.id}`, payload);

    commit('UPDATE_PRODUCT', data.data);
  },

  async deleteProduct({ commit }, id) {
    await api.delete(`/api/products/${id}`);

    commit('DELETE_PRODUCT', id);
  },
};

const getters = {
  products: (state) => state.products,
  product: (state) => state.product,
};

export const product = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
