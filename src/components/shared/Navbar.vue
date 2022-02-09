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

        <v-subheader class="pt-5 pb-3">MASTER FILES</v-subheader>

        <v-list-item router to="/brands">
          <v-list-item-icon>
            <v-icon size="medium">shopping_bag</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Brands</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item router to="/categories">
          <v-list-item-icon>
            <v-icon size="medium">category</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Categories</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item router to="/clients">
          <v-list-item-icon>
            <v-icon size="medium">contact_page</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Clients</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item router to="/products">
          <v-list-item-icon>
            <v-icon size="medium">inventory_2</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Products</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item router to="/suppliers">
          <v-list-item-icon>
            <v-icon size="medium">local_shipping</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Suppliers</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item router to="/unit-of-measurements">
          <v-list-item-icon>
            <v-icon size="medium">straighten</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>UOM</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item router to="/users">
          <v-list-item-icon>
            <v-icon size="medium">account_circle</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Users</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-subheader class="pt-5 pb-3">TRANSACTIONS</v-subheader>

        <v-list-item router to="/orders">
          <v-list-item-icon>
            <v-icon size="medium">shopping_cart</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Orders</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item router to="/returns">
          <v-list-item-icon>
            <v-icon size="medium">remove_shopping_cart</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Returns</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item router to="/sales">
          <v-list-item-icon>
            <v-icon size="medium">trending_up</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Sales</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item router to="/deliveries">
          <v-list-item-icon>
            <v-icon size="medium">local_shipping</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Deliveries</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-subheader class="pt-5 pb-3">REPORTS</v-subheader>

        <v-list-item router to="/inventory">
          <v-list-item-icon>
            <v-icon size="medium">maps_home_work</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Inventory</v-list-item-title>
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
