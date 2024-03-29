<template>
  <div>
    <v-toolbar flat color="transparent">
      <h1>Returns</h1>

      <v-spacer />

      <Form />
    </v-toolbar>

    <v-container>
      <v-card outlined>
        <v-data-table
          :headers="headers"
          :items="replaces.data"
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
              <Form :replace="item" />

              <Delete :item="item" :name="item.name" :delete="deleteReplace" />
            </div>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Form from '@/components/return/Form';
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
      { text: 'Transaction ID', value: 'name' },
      { text: 'Product', value: 'name' },
      { text: 'Price', value: 'name' },
      { text: 'Quantity', value: 'name' },
      { text: 'Total Amount', value: 'name' },
      { text: 'Returned Date', value: 'created_at' },
      { text: '', value: 'actions', sortable: false, align: 'right' },
    ],
  }),

  computed: {
    ...mapGetters('replace', ['replaces']),

    total() {
      if (!this.replaces) {
        return 0;
      }

      return this.replaces?.meta?.total;
    },
  },

  methods: {
    ...mapActions('replace', ['getReplaces', 'deleteReplace']),

    async fetch() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      console.log(sortBy[0] ?? '', sortDesc[0] ?? '', page, itemsPerPage);

      const params = new URLSearchParams({
        page: page,
        per_page: itemsPerPage,
      });

      this.getReplaces(params);
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
