import Vue from 'vue';
import Vuex from 'vuex';
import { auth } from './modules/auth';
import { category } from './modules/category';
import { brand } from './modules/brand';
import { uom } from './modules/uom';
import { product } from './modules/product';
import { supplier } from './modules/supplier';
import { user } from './modules/user';
import { order } from './modules/order';
import { replace } from './modules/replace';
import { inventory } from './modules/inventory';
import { client } from './modules/client';
import { transaction } from './modules/transaction'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    category,
    brand,
    uom,
    product,
    supplier,
    user,
    order,
    replace,
    inventory,
    client,
    transaction
  },
});
