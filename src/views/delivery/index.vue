<template>
  <div>
    <v-toolbar flat color="transparent">
      <h1>Deliveries</h1>

      <v-spacer />

      <Form />
    </v-toolbar>

    <v-container>
      <v-card outlined>
        <v-data-table
          :headers="headers"
          :items="orders.data"
          :options.sync="options"
          :server-items-length="total"
          @toggle-select-all="selectAll"
          v-model="selected"
          :show-select="hasUnpublished"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-btn
                v-if="selected.length > 0"
                depressed
                @click="publish"
                :disabled="publishing"
                :loading="publishing"
              >
                Publish
              </v-btn>

              <v-spacer />

              <v-text-field
                dense
                outlined
                placeholder="Search..."
                hide-details
              />
            </v-toolbar>
          </template>

          <template v-slot:[`item.data-table-select`]="{ item }">
            <v-checkbox
              v-if="item.published_at === null"
              multiple
              v-model="selected"
              :value="item"
              color="grey darken-1"
            />
          </template>

          <template v-slot:[`item.published_at`]="{ item }">
            <v-btn
              rounded
              :class="{
                'red lighten-5 red--text text-darken-4':
                  item.published_at === null,
                'green lighten-5 green--text text-darken-4':
                  item.published_at !== null,
              }"
              depressed
              x-small
            >
              {{ item.status }}
            </v-btn>
          </template>

          <template v-slot:[`item.created_at`]="{ item }">
            {{ dateFromNow(item.created_at) }}
          </template>

          <template v-slot:[`item.updated_at`]="{ item }">
            {{ dateFromNow(item.updated_at) }}
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <div
              class="d-flex justify-end align-center"
              v-if="item.published_at === null"
            >
              <Form :order="item" />

              <Delete
                :item="item"
                :name="item.dr_number"
                :delete="deleteOrder"
              />
            </div>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Form from '@/components/inventory/Form';
import Delete from '@/components/shared/Delete';
import Helper from '@/mixins/helper';

export default {
  components: {
    Form,
    Delete,
  },

  mixins: [Helper],

  data: () => ({
    publishing: false,
    selected: [],
    options: {},
    headers: [
      { text: 'Status', value: 'published_at', width: '10%' },
      { text: 'DR Number', value: 'dr_number' },
      { text: 'Supplier', value: 'supplier.name' },
      { text: 'Receiver', value: 'receiver.full_name' },
      { text: 'Delivery Date', value: 'created_at' },
      { text: '', value: 'actions', sortable: false, align: 'right' },
    ],
  }),

  computed: {
    ...mapGetters('order', ['orders']),

    total() {
      if (!this.orders) {
        return 0;
      }

      return this.orders?.meta?.total;
    },

    hasUnpublished() {
      return this.orders?.data?.some((order) => order.published_at === null);
    },
  },

  methods: {
    ...mapActions('order', ['getOrders', 'deleteOrder', 'publishOrders']),

    selectAll(e) {
      this.selected = e?.items.filter((item) => item.published_at === null);
    },

    async publish() {
      this.publishing = true;

      try {
        const payload = {
          ids: this.selected.map((item) => item.id),
        };

        await this.publishOrders(payload);

        this.selected = [];
      } catch (error) {
        console.log(error);
      } finally {
        this.publishing = false;
      }
    },

    async fetch() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      console.log(sortBy[0] ?? '', sortDesc[0] ?? '', page, itemsPerPage);

      const params = new URLSearchParams({
        page: page,
        per_page: itemsPerPage,
        include: ['transactions.product.uom', 'supplier', 'receiver'],
      });

      this.getOrders(params);
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
