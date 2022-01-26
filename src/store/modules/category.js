import api from '@/api';

const state = {
  categories: [],
  category: {},
};

const mutations = {
  SET_CATEGORIES: (state, categories) => (state.categories = categories),
  SET_CATEGORY: (state, category) => (state.category = category),
  ADD_CATEGORY: (state, category) => state.categories.data.unshift(category),
  UPDATE_CATEGORY: (state, category) => {
    if (state.categories?.data?.length > 0) {
      const index = state.categories.data.findIndex(
        (a) => a.id === category.id
      );
      const selected = state.categories.data[index];

      Object.assign(selected, category);
    } else {
      Object.assign(state.category.data, category);
    }
  },
  DELETE_CATEGORY: (state, category) => {
    const index = state.categories.data.findIndex((a) => a.id === category.id);
    state.categories.data.splice(index, 1);
  },
};

const actions = {
  async getCategories({ commit }) {
    const { data } = await api.get('/api/categories');

    commit('SET_CATEGORIES', data);
  },

  async getCategory({ commit }, id) {
    const { data } = await api.get(`/api/categories/${id}`);

    commit('SET_CATEGORY', data);
  },

  async addCategory({ commit }, payload) {
    const { data } = await api.post('/api/categories', payload);

    commit('ADD_CATEGORY', data.data);
  },

  async updateCategory({ commit }, payload) {
    const { data } = await api.put(`/api/categories/${payload.id}`, payload);

    commit('UPDATE_CATEGORY', data.data);
  },

  async deleteCategory({ commit }, id) {
    await api.delete(`/api/categories/${id}`);

    commit('DELETE_CATEGORY', id);
  },
};

const getters = {
  categories: (state) => state.categories,
  category: (state) => state.category,
};

export const category = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
