<template>
  <div>
    <a href="#" @click="viewOrder(item)">
      {{ item.invoice }}
    </a>

    <!-- dialog2 -->
    <v-dialog v-model="dialog2" width="1200">
      <v-card>
        <v-card-title class="text-h5 teal lighten-2">
          <span class="white--text">
            Delivery ID : {{ selectedOrder.invoice }}
          </span>
        </v-card-title>

        <v-card-text class="mt-5">
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
                  v-model="form.product"
                ></v-text-field>

                <v-text-field
                  type="number"
                  outlined
                  label="Price"
                  required
                  :disabled="editMode == false"
                  v-on:keydown.enter.prevent="save()"
                  v-model="form.price"
                ></v-text-field>

                <v-text-field
                  type="number"
                  outlined
                  label="Quantity"
                  required
                  :disabled="editMode == false"
                  v-on:keydown.enter.prevent="save()"
                  v-model="form.quantity"
                ></v-text-field>

                <v-text-field
                  outlined
                  label="Total Price"
                  required
                  disabled
                  v-on:keydown.enter.prevent="save()"
                  v-model="form.total_price"
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
          <v-btn
            color="primary"
            text
            :disabled="editMode == true"
            @click="close()"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- dialog2 -->
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { debounce } from 'lodash';
import {
  //   ValidationObserver,
  //   ValidationProvider,
  extend,
  setInteractionMode,
} from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import Helper from '@/mixins/helper';

setInteractionMode('eager');

extend('required', {
  ...required,
  message: 'The {_field_} is required.',
});

extend('min', {
  validate(value, { length }) {
    return value >= length;
  },
  params: ['length'],
  message: 'The {_field_} field must be at least {length}.',
});

export default {
  mixins: [Helper],

  components: {
    // ValidationObserver,
    // ValidationProvider,
  },

  props: {
    transaction: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      dialog: false,
      dialog2: false,
      loading: false,
      searchUser: null,
      searchProduct: null,
      searchClient: null,
      errors: null,
      form: {
        dr_number: this.transaction.or_number ?? '',
        invoice: this.transaction.invoice ?? '',
        user_id: this.transaction?.receiver?.id ?? '',
        amount: this.transaction.amount ?? '',
        product: '',
        cliend_id: this.transaction.client ?? '',
        quantity: '',
        price: '',
        payment_method: this.transaction?.payment_method ?? 'Cash',
        payment_amount: this.transaction?.amount ?? '',
        items: [],
      },
      method_items: ['Cash', 'Check', 'Debt'],
    };
  },
  computed: {
    ...mapGetters('user', ['users']),
    ...mapGetters('product', ['products']),
    ...mapGetters('client', ['clients']),

    uom() {
      return this.form.product && this.form.product.uom
        ? this.form.product.uom.long_name
        : '';
    },

    price() {
      return this.form.product && this.form.price
        ? this.form.product.price
        : '';
    },

    totalPrice() {
      if (this.form.items.length) {
        return this.form.items.reduce((total, item) => {
          return total + item.price * item.quantity;
        }, 0);
      }
      return 0;
    },
  },
  methods: {
    ...mapActions('user', ['getUsers']),
    ...mapActions('product', ['getProducts']),
    ...mapActions('client', ['getClients']),
    ...mapActions('transaction', [
      'addTransaction',
      'updateTransaction',
      'deleteTransactionItem',
    ]),

    open() {
      this.dialog = true;

      if (!this.isEmptyObject(this.transaction)) {
        // this.$store.commit('client/ADD_CLIENT', this.transaction.client);
        this.$store.commit('user/ADD_USER', this.transaction.receiver);

        this.form.id = this.transaction.id;
        this.form.items = this.transaction.items.map((item) => {
          return {
            id: item.id,
            product_id: item.product.id,
            product_name: item.product.unique_name,
            uom: item.product?.uom?.long_name,
            quantity: item.quantity,
            price: item.price,
          };
        });
      }
    },

    async update() {
      try {
        await this.updateTransaction(this.form);
        this.close();
      } catch (error) {
        const errors = error.response.data.errors;
        this.errors = errors;
        this.$refs.form.setErrors(errors);
      } finally {
        this.loading = false;
      }
    },

    async removeItem(index) {
      if (confirm('Are you sure you want to delete this item?')) {
        const selected = this.form.items[index];
        if (selected.id) {
          await this.deleteTransactionItem({
            deliveryId: this.form.id,
            transactionId: selected.id,
          });
          this.form.items = this.transaction.items.map((item) => {
            return {
              id: item.id,
              product_id: item.product.id,
              product_name: item.product.unique_name,
              uom: item.product?.uom?.long_name,
              quantity: item.quantity,
              price: item.price,
            };
          });
        } else {
          this.form.items.splice(index, 1);
        }
      }
    },

    close() {
      this.dialog = false;
      this.dialog2 = false;

      this.form = {
        dr_number: '',
        user_id: '',
        product: {},
        client_id: '',
        quantity: '',
        items: [],
      };

      this.$refs.form.reset();
    },

    addItem() {
      this.form.items.push({
        product_id: this.form.product.id,
        product_name: this.form.product.unique_name,
        uom: this.form.product?.uom?.long_name,
        quantity: this.form.quantity,
        price: this.form.price,
      });

      this.form.product = '';
      this.form.quantity = '';
      this.form.price = '';
      this.$refs.form.reset();
    },

    updatePrice() {
      this.form.price = this.form.product.selling_price;
    },

    hasError(index, type) {
      if (this.errors && this.errors[`items.${index}.${type}`]) {
        return true;
      }
      return false;
    },

    ConfirmModal() {
      this.dialog2 = true;
    },

    async onSubmit() {
      this.loading = true;
      this.errors = null;

      if (this.isEmptyObject(this.transaction)) {
        await this.save(this.form);
      } else {
        await this.update(this.form);
      }
    },

    async save() {
      try {
        await this.addTransaction(this.form);
        this.close();
      } catch (error) {
        const errors = error.response.data.errors;
        this.errors = errors;
        this.$refs.form.setErrors(errors);
      } finally {
        this.loading = false;
      }
    },

    fetchUser: debounce(async function () {
      const params = new URLSearchParams({
        'filter[full_name]': this.searchUser,
      });
      await this.getUsers(params);
    }, 100),

    fetchProduct: debounce(async function () {
      const params = new URLSearchParams({
        'filter[unique_name]': this.searchProduct,
        include: 'uom',
      });
      await this.getProducts(params);
    }, 250),

    fetchClient: debounce(async function () {
      const params = new URLSearchParams({
        'filter[business_name]': this.searchClient,
      });
      await this.getClients(params);
    }, 100),
  },

  watch: {
    searchUser() {
      if (this.searchUser) {
        this.fetchUser();
      }
    },

    searchProduct() {
      if (this.searchProduct) {
        this.fetchProduct();
      }
    },

    searchClient() {
      if (this.searchClient) {
        this.fetchClient();
      }
    },
  },
};
</script>
