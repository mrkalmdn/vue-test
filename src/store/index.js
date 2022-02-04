import Vue from 'vue';
import Vuex from 'vuex';
import { auth } from './modules/auth';
import { category } from './modules/category';
import { brand } from './modules/brand';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    category,
    brand,
  },
});
