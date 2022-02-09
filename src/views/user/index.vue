<template>
  <div>
    <v-toolbar flat color="transparent">
      <h1>Users</h1>

      <v-spacer />

      <Form />
    </v-toolbar>

    <v-container>
      <v-card outlined>
        <v-data-table
          :headers="headers"
          :items="users.data"
          :options.sync="options"
          :server-items-length="total"
          class="mt-12"
        >
          <template v-slot:[`item.created_at`]="{ item }">
            {{ dateFromNow(item.created_at) }}
          </template>

          <template v-slot:[`item.updated_at`]="{ item }">
            {{ dateFromNow(item.updated_at) }}
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <div class="d-flex justify-end align-center">
              <Form :user="item" />

              <Delete :item="item" :name="item.name" :delete="deleteUser" />
            </div>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Form from '@/components/user/Form';
import Delete from '@/components/shared/Delete';
import Helper from '@/mixins/helper';

export default {
  components: {
    Form,
    Delete,
  },

  mixins: [Helper],

  data: () => ({
    options: {},
    headers: [
      { text: 'Name', value: 'full_name' },
      { text: 'Created at', value: 'created_at' },
      { text: 'Updated at', value: 'updated_at' },
      { text: '', value: 'actions', sortable: false, align: 'right' },
    ],
  }),

  computed: {
    ...mapGetters('user', ['users']),

    total() {
      if (!this.users) {
        return 0;
      }

      return this.users?.meta?.total;
    },
  },

  methods: {
    ...mapActions('user', ['getUsers', 'deleteUser']),

    async fetch() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      console.log(sortBy[0] ?? '', sortDesc[0] ?? '', page, itemsPerPage);

      const params = new URLSearchParams({
        page: page,
        per_page: itemsPerPage,
      });

      this.getUsers(params);
    },
  },

  watch: {
    options: {
      handler() {
        this.fetch();
      },
      deep: true,
    },
  },
};
</script>
