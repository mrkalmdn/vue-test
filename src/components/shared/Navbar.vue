<template>
  <div>
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense nav>
        <v-list-item router to="/dashboard">
          <v-list-item-icon>
            <v-icon size="medium">dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item router to="/categories">
          <v-list-item-icon>
            <v-icon size="medium">dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Categories</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item router to="/brands">
          <v-list-item-icon>
            <v-icon size="medium">dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Brands</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <v-divider></v-divider>
        <div class="pa-2">
          <v-btn block depressed color="white" light @click="signOut">
            Log out
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar id="app-bar" app class="elevation-0 white" clipped-left>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <router-link to="/home" class="text-decoration-none">
        <v-toolbar-title>Vue2Test</v-toolbar-title>
      </router-link>

      <v-spacer></v-spacer>

      <v-avatar color="white" size="36" class="mr-2">
        <img :src="photo()" />
      </v-avatar>

      <router-link to="/dashboard" class="text-decoration-none">
        <span v-if="user">
          {{ user.first_name }}
        </span>
      </router-link>
    </v-app-bar>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      drawer: true,
    };
  },

  computed: {
    ...mapGetters('auth', ['user']),
  },

  methods: {
    ...mapActions('auth', ['logout']),

    photo() {
      if (!this.user) {
        return;
      }

      if (this.user.photo !== null) {
        return this.user.photo;
      }

      return `https://ui-avatars.com/api/?name=${this.user.first_name}+${this.user.last_name}`;
    },

    async signOut() {
      await this.logout();

      this.$router.push('/');
    },
  },
};
</script>

<style lang="scss" scoped>
#app-bar {
  border-width: 0 0 thin;
  border-style: solid;
  border-bottom-color: rgba(0, 0, 0, 0.12) !important;
}
</style>
