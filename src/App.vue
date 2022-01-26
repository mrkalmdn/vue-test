<template>
  <v-app>
    <template v-if="$route.meta.guest">
      <router-view />
    </template>

    <AuthLayout v-else />
  </v-app>
</template>

<script>
import AuthLayout from '@/views/Auth/Layout';

export default {
  name: 'App',

  components: {
    AuthLayout,
  },

  async mounted() {
    if (this.$store.state.auth.authenticated) {
      await this.$store.dispatch('auth/me');
    }
  },
};
</script>
