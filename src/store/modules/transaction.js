import api from '@/api';

const state = {
  transactions: {
    data: [],
  },
  transaction: {},
  transactionData: [],
};

const mutations = {
  SET_TRANSACTIONS: (state, transactions) =>
    (state.transactions = transactions),
  SET_TRANSACTION: (state, transaction) => (state.transaction = transaction),
  ADD_TRANSACTION: (state, transaction) =>
    state.transactions.data.unshift(transaction),
  UPDATE_TRANSACTION: (state, transaction) => {
    if (state.transactions?.data?.length > 0) {
      const index = state.transactions.data.findIndex(
        (a) => a.id === transaction.id
      );
      const selected = state.transactions.data[index];

      Object.assign(selected, transaction);
    } else {
      Object.assign(state.transaction.data, transaction);
    }
  },
  DELETE_TRANSACTION: (state, id) => {
    const index = state.transactions.data.findIndex((a) => a.id === id);
    state.transactions.data.splice(index, 1);
  },

  DELETE_TRANSACTION_ITEM: (state, payload) => {
    const { deliveryId, transactionId } = payload;

    const index = state.transactions.data.findIndex((a) => a.id === deliveryId);

    const selected = state.transactions.data[index];

    const transactionIndex = selected.items.findIndex(
      (a) => a.id === transactionId
    );

    selected.items.splice(transactionIndex, 1);
  },

  //
  VIEW_TRANSACTION: (state, data) => (state.transactionData = data),
  //
};

const actions = {
  async getTransactions({ commit }, payload) {
    const { data } = await api.get('/api/sales?' + payload);

    commit('SET_TRANSACTIONS', data);
  },

  async getTransaction({ commit }, id) {
    const { data } = await api.get(`/api/sales/${id}`);

    commit('SET_TRANSACTION', data);
  },

  async addTransaction({ commit }, payload) {
    const { data } = await api.post('/api/sales', payload);

    commit('ADD_TRANSACTION', data.data);
  },

  async updateTransaction({ commit }, payload) {
    const { data } = await api.put(`/api/sales/${payload.id}`, payload);

    commit('UPDATE_TRANSACTION', data.data);
  },

  async deleteTransaction({ commit }, id) {
    await api.delete(`/api/sales/${id}`);

    commit('DELETE_TRANSACTION', id);
  },

  async deleteTransactionItem({ commit }, payload) {
    const { deliveryId, transactionId } = payload;

    await api.delete(`api/sales/${deliveryId}/transactions/${transactionId}`);

    commit('DELETE_TRANSACTION_ITEM', payload);
  },

  //
  async getTransactionData({ commit }, id) {
    const response = await api.get(`api/sales-view/${id}`);
    commit('VIEW_TRANSACTION', response.data);
  },
  //
};

const getters = {
  transactions: (state) => state.transactions,
  transaction: (state) => state.transaction,
  transactionData: (state) => state.transactionData,
};

export const transaction = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
