import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/Login.vue';
import store from '@/store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: {
      guest: true,
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
  },
  {
    path: '/categories',
    redirect: { name: 'categories' },
    component: () =>
      import(
        /* webpackChunkName: "categories.index" */ '../views/category/index.vue'
      ),
    children: [
      {
        path: '',
        name: 'categories',
        component: () =>
          import(
            /* webpackChunkName: "categories" */ '../views/category/Category.vue'
          ),
      },
      {
        path: 'create',
        name: 'categories.create',
        component: () =>
          import(
            /* webpackChunkName: "categories" */ '../views/category/CreateCategory.vue'
          ),
      },
      {
        path: ':id/edit',
        name: 'categories.edit',
        component: () =>
          import(
            /* webpackChunkName: "categories" */ '../views/category/EditCategory.vue'
          ),
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const guest = to.matched.some((record) => record.meta.guest);
  const authenticated = store.getters['auth/authenticated'];

  if (!guest && !authenticated) {
    return next({
      path: '/',
    });
  }

  if (authenticated && guest) {
    return next('/dashboard');
  }

  next();
});

export default router;
