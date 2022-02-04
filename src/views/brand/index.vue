<template>
  <div>
    <v-toolbar flat color="transparent">
      <h1>Brands</h1>

      <v-spacer />

      <Form />
    </v-toolbar>

    <v-container>
      <v-card outlined>
        <v-data-table
          :headers="headers"
          :items="brands.data"
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
              <Form :brand="item" />

              <Delete :item="item" :name="item.name" :delete="deleteBrand" />
            </div>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Form from '@/components/brand/Form';
import Delete from '@/components/shared/Delete';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

export default {
  components: {
    Form,
    Delete,
  },

  data: () => ({
    options: {},
    headers: [
      { text: 'Name', value: 'name' },
      { text: 'Created at', value: 'created_at' },
      { text: 'Updated at', value: 'updated_at' },
      { text: '', value: 'actions', sortable: false, align: 'right' },
    ],
  }),

  computed: {
    ...mapGetters('brand', ['brands']),

    total() {
      if (!this.brands) {
        return 0;
      }

      return this.brands?.meta?.total;
    },
  },

  methods: {
    ...mapActions('brand', ['getBrands', 'deleteBrand']),

    async fetch() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      console.log(sortBy[0] ?? '', sortDesc[0] ?? '', page, itemsPerPage);

      const params = new URLSearchParams({
        page: page,
        per_page: itemsPerPage,
      });

      this.getBrands(params);
    },

    dateFromNow(date) {
      dayjs.extend(relativeTime);

      return dayjs(date).fromNow();
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
