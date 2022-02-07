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
            /* webpackChunkName: "categories.create" */ '../views/category/CreateCategory.vue'
          ),
      },
      {
        path: ':id/edit',
        name: 'categories.edit',
        component: () =>
          import(
            /* webpackChunkName: "categories.edit" */ '../views/category/EditCategory.vue'
          ),
      },
    ],
  },
  {
    path: '/brands',
    name: 'brands',
    component: () =>
      import(/* webpackChunkName: "brands" */ '../views/brand/index.vue'),
  },
  {
    path: '/unit-of-measurements',
    name: 'uom',
    component: () =>
      import(/* webpackChunkName: "uom" */ '../views/uom/index.vue'),
  },
  {
    path: '/products',
    name: 'products',
    component: () =>
      import(/* webpackChunkName: "products" */ '../views/product/index.vue'),
  },
  {
    path: '/suppliers',
    name: 'suppliers',
    component: () => import('../views/supplier/index.vue'),
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('../views/user/index.vue'),
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
