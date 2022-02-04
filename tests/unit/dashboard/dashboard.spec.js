import { mount, createLocalVue } from '@vue/test-utils';
import Dashboard from '@/views/Dashboard.vue';
import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

describe('Dashboard.vue', () => {
  let localVue;
  let vuetify;

  beforeEach(() => {
    localVue = createLocalVue();
    vuetify = new Vuetify();
  });

  it('renders the dashboard', () => {
    const wrapper = mount(Dashboard, {
      localVue,
      vuetify,
    });

    expect(wrapper.exists()).toBeTruthy();
  });
});
