import { mount, createLocalVue } from '@vue/test-utils';
import Login from '@/views/Login.vue';
import Vue from 'vue';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import Cookies from 'js-cookie';

Vue.use(Vuetify);

describe('Login.vue', () => {
  let localVue;
  let vuetify;
  let store;
  let state;
  let actions;
  let mutations;
  let getters;
  let router;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    localVue.use(VueRouter);

    state = {
      user: null,
      token: null,
      authenticated: !!Cookies.get('token'),
    };
    actions = {
      login: jest.fn(),
    };
    mutations = {
      SET_USER: jest.fn(),
      SET_TOKEN: jest.fn(),
      SET_AUTHENTICATED: jest.fn(),
    };
    getters = {
      user: jest.fn(),
      token: jest.fn(),
      authenticated: jest.fn(),
    };

    vuetify = new Vuetify();
    router = new VueRouter();
    store = new Vuex.Store({
      modules: {
        auth: {
          namespaced: true,
          state,
          actions,
          mutations,
          getters,
        },
      },
    });
  });

  it('renders the login', () => {
    const wrapper = mount(Login, {
      localVue,
      vuetify,
    });

    expect(wrapper.exists()).toBeTruthy();
  });

  it('redirects the user when authenticated', async () => {
    const wrapper = mount(Login, {
      localVue,
      vuetify,
      store,
      router,
    });

    const textFields = wrapper.findAll('.v-text-field input');

    textFields.at(0).setValue('test@example.com');
    textFields.at(1).setValue('password');

    wrapper.find('form').trigger('submit');
  });
});
