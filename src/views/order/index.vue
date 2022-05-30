<template>
  <div>
    <v-toolbar flat color="transparent">
      <h1>Orders</h1>

      <v-spacer />

      <Form />
    </v-toolbar>

    <!-- SHOW TO ADMIN ONLY -->
    <v-container>
      <v-card outlined>
        <v-data-table
          :headers="headers"
          :items="transactions.data"
          :options.sync="options"
          :server-items-length="total"
          class="mt-12"
        >
          <template v-slot:item.invoice="{ item }">
            <a href="#" @click="viewOrder(item.invoice)">
              {{ item.invoice }}
            </a>
          </template>

          <template v-slot:[`item.created_at`]="{ item }">
            {{ dateFromNow(item.created_at) }}
          </template>

          <template v-slot:[`item.updated_at`]="{ item }">
            {{ dateFromNow(item.updated_at) }}
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <div class="d-flex justify-end align-center">
              <Form :transaction="item" />

              <Delete
                :item="item"
                :name="item.invoice"
                :delete="deleteTransaction"
              />
            </div>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
    <!-- SHOW TO ADMIN ONLY -->
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Form from '@/components/order/Form';
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
      { text: 'Invoice / DR Number', value: 'invoice' },
      { text: 'Total Amount', value: 'total' },
      //  TransactionID clickable
      { text: 'Created at', value: 'created_at' },
      { text: 'Updated at', value: 'updated_at' },
      { text: '', value: 'actions', sortable: false, align: 'right' },
    ],
  }),
  computed: {
    ...mapGetters('transaction', ['transactions']),
    total() {
      if (!this.transactions) {
        return 0;
      }
      return this.transactions?.meta?.total;
    },
  },
  methods: {
    ...mapActions('transaction', ['getTransactions', 'deleteTransaction']),

    viewOrder(invoice) {
      this.getDeliveryData(invoice);
      this.dialog2 = true;
      this.idHeader = invoice;
    },

    async fetch() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;
      console.log(sortBy[0] ?? '', sortDesc[0] ?? '', page, itemsPerPage);
      const params = new URLSearchParams({
        page: page,
        per_page: itemsPerPage,
        include: ['transactions', 'transactions.product', 'receiver', 'client'],
      });
      this.getTransactions(params);
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
