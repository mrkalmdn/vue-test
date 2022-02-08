import api from '@/api';

const state = {
  orders: [],
  order: {},
};

const mutations = {
  SET_ORDERS: (state, orders) => (state.orders = orders),
  SET_ORDER: (state, order) => (state.order = order),
  ADD_ORDER: (state, order) => state.orders.data.unshift(order),
  UPDATE_ORDER: (state, order) => {
    if (state.orders?.data?.length > 0) {
      const index = state.orders.data.findIndex((a) => a.id === order.id);
      const selected = state.orders.data[index];

      Object.assign(selected, order);
    } else {
      Object.assign(state.order.data, order);
    }
  },
  DELETE_ORDER: (state, id) => {
    const index = state.orders.data.findIndex((a) => a.id === id);
    state.orders.data.splice(index, 1);
  },
};

const actions = {
  async getOrders({ commit }, payload) {
    const { data } = await api.get('/api/orders?' + payload);

    commit('SET_ORDERS', data);
  },

  async getOrder({ commit }, id) {
    const { data } = await api.get(`/api/orders/${id}`);

    commit('SET_ORDER', data);
  },

  async addOrder({ commit }, payload) {
    const { data } = await api.post('/api/orders', payload);

    commit('ADD_ORDER', data.data);
  },

  async updateOrder({ commit }, payload) {
    const { data } = await api.put(`/api/orders/${payload.id}`, payload);

    commit('UPDATE_ORDER', data.data);
  },

  async deleteOrder({ commit }, id) {
    await api.delete(`/api/orders/${id}`);

    commit('DELETE_ORDER', id);
  },
};

const getters = {
  orders: (state) => state.orders,
  order: (state) => state.order,
};

export const order = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};