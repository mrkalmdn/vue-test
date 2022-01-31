<template>
  <div>
    <v-toolbar flat color="transparent">
      <h1>Categories</h1>

      <v-spacer />

      <v-btn color="primary" depressed :to="{ name: 'categories.create' }">
        New Category
      </v-btn>
    </v-toolbar>

    <v-container>
      <v-card outlined>
        <v-data-table
          :headers="headers"
          :items="categories.data"
          :options.sync="options"
          :server-items-length="total"
          class="mt-12"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <div class="d-flex justify-end align-center">
              <router-link
                class="text-decoration-none font-weight-bold"
                :to="{ name: 'categories.edit', params: { id: item.id } }"
              >
                Edit
              </router-link>

              <Confirmation
                :item="item"
                :name="item.name"
                :delete="deleteCategory"
              />
            </div>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Confirmation from '@/components/shared/Confirmation';

export default {
  components: {
    Confirmation,
  },

  data: () => ({
    options: {},
    headers: [
      { text: 'Name', value: 'name' },
      { text: '', value: 'actions', sortable: false, align: 'right' },
    ],
  }),

  computed: {
    ...mapGetters('category', ['categories']),

    total() {
      if (!this.categories) {
        return 0;
      }

      return this.categories?.meta?.total;
    },
  },

  methods: {
    ...mapActions('category', ['getCategories', 'deleteCategory']),

    async fetch() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      console.log(sortBy[0] ?? '', sortDesc[0] ?? '', page, itemsPerPage);

      const params = new URLSearchParams({
        page: page,
        per_page: itemsPerPage,
      });

      this.getCategories(params);
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
