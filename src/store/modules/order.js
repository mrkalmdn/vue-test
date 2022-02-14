import api from '@/api';

const state = {
  orders: {
    data: [],
  },
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

  DELETE_TRANSACTION_ITEM: (state, payload) => {
    const { deliveryId, transactionId } = payload;

    const index = state.orders.data.findIndex((a) => a.id === deliveryId);

    const selected = state.orders.data[index];

    const transactionIndex = selected.items.findIndex(
      (a) => a.id === transactionId
    );

    selected.items.splice(transactionIndex, 1);
  },
};

const actions = {
  async getOrders({ commit }, payload) {
    const { data } = await api.get('/api/deliveries?' + payload);

    commit('SET_ORDERS', data);
  },

  async getOrder({ commit }, id) {
    const { data } = await api.get(`/api/deliveries/${id}`);

    commit('SET_ORDER', data);
  },

  async addOrder({ commit }, payload) {
    const { data } = await api.post('/api/deliveries', payload);

    commit('ADD_ORDER', data.data);
  },

  async updateOrder({ commit }, payload) {
    const { data } = await api.put(`/api/deliveries/${payload.id}`, payload);

    commit('UPDATE_ORDER', data.data);
  },

  async deleteOrder({ commit }, id) {
    await api.delete(`/api/deliveries/${id}`);

    commit('DELETE_ORDER', id);
  },

  async deleteTransactionItem({ commit }, payload) {
    const { deliveryId, transactionId } = payload;

    await api.delete(
      `api/deliveries/${deliveryId}/transactions/${transactionId}`
    );

    commit('DELETE_TRANSACTION_ITEM', payload);
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
