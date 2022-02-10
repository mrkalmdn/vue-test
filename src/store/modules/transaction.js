import api from '@/api';

const state = {
  transactions: [],
  transaction: {},
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
};

const getters = {
  transactions: (state) => state.transactions,
  transaction: (state) => state.transaction,
};

export const transaction = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
