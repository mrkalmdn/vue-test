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
          <!-- <ViewForm /> -->

          <template v-slot:[`item.invoice`]="{ item }">
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

    <!-- dialog2 -->
    <v-dialog v-model="dialog2" width="1200">
      <v-card>
        <v-card-title class="text-h5 teal lighten-2">
          <span class="white--text">Delivery ID : {{ idHeader }}</span>
        </v-card-title>

        <v-card-text class="mt-5">
          <v-data-table
            dense
            :headers="headers2"
            :items="transactionData"
            item-key="name"
            class="elevation-1"
            hide-default-footer
          >
            <template v-slot:item.actions="{ item }">
              <v-btn class="success mb-2 mt-1 mr-2" @click="edit(item)">
                <v-icon>mdi-clipboard-text-search-outline</v-icon>
              </v-btn>
              <v-btn
                class="red mb-2 mt-1 white--text"
                @click="deleteDeliveryProduct(item.id)"
              >
                <v-icon>mdi-clipboard-remove-outline</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <span class="h2 font-weight-black text-decoration-underline">
            Grand Total = P 5400
          </span>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog2 = false">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- dialog2 -->
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Form from '@/components/order/Form';
// import ViewForm from '@/components/order/View';
import Delete from '@/components/shared/Delete';
import Helper from '@/mixins/helper';
export default {
  components: {
    Form,
    // ViewForm,
    Delete,
  },
  mixins: [Helper],
  data: () => ({
    idHeader: '',
    dialog2: false,
    options: {},
    headers: [
      { text: 'Invoice / DR Number', value: 'invoice' },
      { text: 'Total Amount', value: 'total' },
      //  TransactionID clickable
      { text: 'Created at', value: 'created_at' },
      { text: 'Updated at', value: 'updated_at' },
      { text: '', value: 'actions', sortable: false, align: 'right' },
    ],
    headers2: [
      {
        text: 'Product Name',
        align: 'start',
        sortable: false,
        value: 'uniquename',
      },
      { text: 'Quantity', value: 'quantity' },
      { text: 'Price', value: 'price' },
      { text: 'Total Price', value: 'total_price' },
      { text: 'Action', value: 'actions' },
    ],
  }),
  computed: {
    ...mapGetters('transaction', ['transactions', 'transactionData']),
    total() {
      if (!this.transactions) {
        return 0;
      }
      return this.transactions?.meta?.total;
    },
  },
  methods: {
    ...mapActions('transaction', [
      'getTransactions',
      'deleteTransaction',
      'getTransaction',
      'getTransactionData',
    ]),

    viewOrder(invoice) {
      this.getTransactionData(invoice);
      this.dialog2 = true;
      this.idHeader = invoice;
    },

    // viewOrder(item) {
    //   this.getTransactionData(item.id);
    //   this.dialog2 = true;
    //   this.idHeader = item.invoice;
    // },

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
