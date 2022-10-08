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
            <a href="#" @click="viewOrder(item)">
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
    <v-dialog v-model="dialog2" persistent max-width="1400">
      <v-card>
        <!-- <v-card-title class="text-h5 teal lighten-2">
          <span class="white--text">
            Delivery ID : {{ selectedOrder.invoice }}
          </span>
        </v-card-title> -->

        <v-toolbar dark color="primary">
          <v-toolbar-title>
            Delivery ID : {{ selectedOrder.invoice }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>

        <v-stepper alt-labels v-model="e1">
          <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" step="1">
              Verify Orders
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="e1 > 2" step="2">
              Verify Payment
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3">Complete Order</v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <!-- 1 -->
            <v-stepper-content step="1">
              <!-- body 1 -->
              <v-card-text>
                <v-row>
                  <v-col cols="6">
                    <v-data-table
                      dense
                      :headers="headers2"
                      :items="selectedOrder.items"
                      item-key="name"
                      class="elevation-1"
                      hide-default-footer
                    >
                      <template v-slot:item.total_price="{ item }">
                        {{ item.price * item.quantity }}
                      </template>
                      <template v-slot:item.actions="{ item }">
                        <v-row>
                          <v-btn
                            class="ma-2"
                            text
                            icon
                            color="green darken-1"
                            @click="edit(item)"
                          >
                            <v-icon>mdi-clipboard-text-search-outline</v-icon>
                          </v-btn>
                          <v-btn
                            class="ma-2"
                            text
                            icon
                            color="red darken-1"
                            @click="deleteDeliveryProduct(item.id)"
                          >
                            <v-icon>mdi-clipboard-remove-outline</v-icon>
                          </v-btn>
                        </v-row>
                      </template>
                    </v-data-table>
                  </v-col>
                  <v-col cols="6">
                    <v-form ref="form" v-model="valid" lazy-validation>
                      <v-text-field
                        outlined
                        label="Product name"
                        required
                        disabled
                        v-on:keydown.enter.prevent="save()"
                        v-model="form2.product"
                      ></v-text-field>

                      <v-row>
                        <v-col cols="9">
                          <v-text-field
                            type="number"
                            outlined
                            label="Price"
                            required
                            :disabled="editMode == false"
                            v-on:keydown.enter.prevent="save()"
                            v-model="form2.price"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="3">
                          <v-text-field
                            type="number"
                            outlined
                            label="SRP"
                            required
                            disabled
                            v-on:keydown.enter.prevent="save()"
                            v-model="form.unit_cost"
                          ></v-text-field>
                        </v-col>
                      </v-row>

                      <v-text-field
                        type="number"
                        outlined
                        label="Quantity"
                        required
                        :disabled="editMode == false"
                        v-on:keydown.enter.prevent="save()"
                        v-model="form2.quantity"
                      ></v-text-field>

                      <v-text-field
                        outlined
                        label="Total Price"
                        required
                        disabled
                        v-on:keydown.enter.prevent="save()"
                        v-model="form2.total"
                      ></v-text-field>
                      <v-row>
                        <v-col cols="6">
                          <v-btn
                            block
                            depressed
                            class="mr-4 red white--text"
                            type="submit"
                            :disabled="editMode == false"
                            @click="cancel()"
                          >
                            Cancel
                          </v-btn>
                        </v-col>
                        <v-col cols="6">
                          <v-btn
                            block
                            depressed
                            class="mr-4 green white--text"
                            type="submit"
                            :disabled="editMode == false"
                          >
                            Submit
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <span class="h2 font-weight-black text-decoration-underline">
                  Grand Total = P {{ grandTotal }}
                </span>
                <v-spacer></v-spacer>
                <v-btn :disabled="editMode == true" @click="close()">
                  Cancel
                </v-btn>
                <v-btn
                  color="primary"
                  text
                  :disabled="editMode == true"
                  @click="e1 = 2"
                >
                  Confirm
                </v-btn>
              </v-card-actions>
              <!-- body 1 -->
            </v-stepper-content>
            <!-- 1 -->

            <!-- 2 -->
            <v-stepper-content step="2">
              <!-- body 2 -->
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  class="mt-3"
                  outlined
                  label="Payment Type"
                  required
                  v-on:keydown.enter.prevent="save()"
                  v-model="form.payment_method"
                ></v-text-field>

                <v-text-field
                  type="number"
                  outlined
                  label="Payment Amount"
                  required
                  v-on:keydown.enter.prevent="save()"
                  v-model="form.amount"
                ></v-text-field>

                <v-text-field
                  type="number"
                  outlined
                  label="Transaction Amount"
                  required
                  :disabled="editMode == false"
                  v-on:keydown.enter.prevent="save()"
                  v-model="form.transaction_amount"
                ></v-text-field>

                <v-text-field
                  outlined
                  label="Change"
                  required
                  disabled
                  v-on:keydown.enter.prevent="save()"
                  v-model="form.change"
                ></v-text-field>

                <v-divider></v-divider>
                <div hidden>
                  <h5 class="mb-3">Check Details</h5>

                  <v-text-field
                    outlined
                    label="Client"
                    required
                    v-on:keydown.enter.prevent="save()"
                    v-model="form.client"
                  ></v-text-field>
                  <!-- CREATE CLIENT BANK DETAIL TABLE -->

                  <v-text-field
                    outlined
                    label="Bank Type"
                    required
                    v-on:keydown.enter.prevent="save()"
                    v-model="form.bank_type"
                  ></v-text-field>

                  <v-text-field
                    outlined
                    label="Check Number"
                    required
                    v-on:keydown.enter.prevent="save()"
                    v-model="form.check_number"
                  ></v-text-field>

                  <v-text-field
                    outlined
                    label="Check Date"
                    required
                    v-on:keydown.enter.prevent="save()"
                    v-model="form.check_date"
                  ></v-text-field>
                </div>

                <v-card-actions>
                  <span class="h2 font-weight-black text-decoration-underline">
                    Grand Total = P {{ grandTotal }}
                  </span>
                  <v-spacer></v-spacer>
                  <v-btn @click="e1 = 1">Cancel</v-btn>
                  <v-btn color="primary" text @click="e1 = 3">Confirm</v-btn>
                </v-card-actions>
              </v-form>
              <!-- body 2 -->
            </v-stepper-content>
            <!-- 2 -->

            <!-- 3 -->
            <v-stepper-content step="3">
              <!-- body 3 -->
              <v-card-text>
                <v-row>
                  <v-col cols="6">
                    <v-data-table
                      dense
                      :headers="headers3"
                      :items="selectedOrder.items"
                      item-key="name"
                      class="elevation-1"
                      hide-default-footer
                    >
                      <template v-slot:item.total_price="{ item }">
                        {{ item.price * item.quantity }}
                      </template>
                      <template v-slot:item.income="{ item }">
                        <v-chip :color="getColor(item.income)" dark>
                          <!-- {{ 25 }} -->
                          {{
                            item.price * item.quantity -
                            item.unit_cost * item.quantity
                          }}
                        </v-chip>
                      </template>
                    </v-data-table>
                  </v-col>
                  <v-col cols="6">
                    <v-form ref="form" v-model="valid" lazy-validation>
                      <v-text-field
                        outlined
                        label="Client name"
                        required
                        disabled
                        v-on:keydown.enter.prevent="save()"
                        value="Mark Almadin"
                      ></v-text-field>

                      <v-row>
                        <v-col cols="4">
                          <v-text-field
                            outlined
                            label="Payment Type"
                            required
                            :disabled="editMode == false"
                            v-on:keydown.enter.prevent="save()"
                            value="Cash"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="4">
                          <v-text-field
                            type="number"
                            outlined
                            label="Payment Amount"
                            required
                            :disabled="editMode == false"
                            v-on:keydown.enter.prevent="save()"
                            value="4000"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="4">
                          <v-text-field
                            type="number"
                            outlined
                            label="Transaction Amount"
                            required
                            :disabled="editMode == false"
                            v-on:keydown.enter.prevent="save()"
                            value="4000"
                          ></v-text-field>
                        </v-col>
                      </v-row>

                      <v-text-field
                        type="number"
                        outlined
                        label="Change"
                        required
                        :disabled="editMode == false"
                        v-on:keydown.enter.prevent="save()"
                        value="0"
                      ></v-text-field>
                    </v-form>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-divider></v-divider>
              <v-card-actions>
                <span class="h2 font-weight-black text-decoration-underline">
                  Grand Total = P 4000
                </span>
                <v-spacer></v-spacer>
                <v-btn :disabled="editMode == true" @click="e1 = 2">
                  Cancel
                </v-btn>
                <v-btn
                  color="primary"
                  text
                  :disabled="editMode == true"
                  @click="close()"
                >
                  Confirm
                </v-btn>
              </v-card-actions>

              <span class="h2 ml-2 font-weight-black text-decoration-underline">
                Total Gross Income = P 3000
              </span>
              <!-- body 3 -->
            </v-stepper-content>
            <!-- 3 -->
          </v-stepper-items>
        </v-stepper>
      </v-card>
    </v-dialog>
    <!-- dialog2 -->

    <!-- snackbar -->
    <v-snackbar
      v-model="snackbar"
      color="success"
      outlined
      top
      right
      elevation="3"
      :timeout="timeout"
    >
      <v-icon color="success" class="mr-1">mdi-check-circle-outline</v-icon>
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="success" text v-bind="attrs" @click="snackbar = false">
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <!-- snackbar -->
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
    snackbar: false,
    text: `Transaction Complete !`,
    timeout: 3000,
    e1: 1,
    valid: true,
    editMode: false,
    selectedOrder: {},
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
        value: 'product.unique_name',
      },
      { text: 'Quantity', value: 'quantity' },
      { text: 'Price', value: 'price' },
      { text: 'SRP', value: 'unit_cost' },
      { text: 'Total Price', value: 'total_price' },
      { text: 'Action', value: 'actions' },
    ],
    headers3: [
      {
        text: 'Product Name',
        align: 'start',
        sortable: false,
        value: 'product.unique_name',
      },
      { text: 'Quantity', value: 'quantity' },
      { text: 'Total Price', value: 'total_price' },
      { text: 'Income', value: 'income' },
    ],
    form: {
      product: '',
      quantity: '',
      total: '',
      price: '',
      unit_cost: '',
      transaction_amount: 0,
      payment_method: '',
      items: [],
    },
    form2: {
      id: '',
      price: '',
      product: '',
      quantity: '',
      total: '',
    },
  }),
  computed: {
    ...mapGetters('transaction', ['transactions', 'transactionData']),
    total() {
      if (!this.transactions) {
        return 0;
      }
      return this.transactions?.meta?.total;
    },
    grandTotal() {
      if (!this.selectedOrder?.items) {
        return 0;
      }

      return this.selectedOrder.items.reduce(
        (acc, curr) => acc + curr.total * -1,
        0
      );
    },
  },
  methods: {
    ...mapActions('transaction', [
      'getTransactions',
      'deleteTransaction',
      'getTransaction',
      'getTransactionData',
    ]),

    viewOrder(item) {
      console.log(item);
      this.selectedOrder = item;
      this.dialog2 = true;
      this.form = this.selectedOrder;
    },

    edit(item) {
      this.editMode = !this.editMode;

      const index = this.form.items.findIndex((a) => a.id === item.id);
      const selected = this.form.items[index];

      this.form2 = {
        id: selected.id,
        price: selected.price,
        quantity: selected.quantity,
        total: selected.total,
        product: selected.product.unique_name,
      };
    },

    cancel() {
      this.editMode = false;
    },

    close() {
      this.dialog2 = false;
      this.e1 = 1;
      this.snackbar = true;
    },

    getColor(income) {
      if (income > 400) return 'red';
      // sale
      else return 'green';
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
