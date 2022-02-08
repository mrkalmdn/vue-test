<template>
  <div>
    <v-btn v-if="isEmptyObject(order)" color="primary" depressed @click="open">
      New Stock
    </v-btn>

    <div
      v-else
      class="text-decoration-none font-weight-bold pointer-cursor"
      @click="open"
    >
      Edit
    </div>

    <v-dialog v-model="dialog" width="500" fullscreen persistent>
      <v-card>
        <v-toolbar tile flat dark color="primary">
          <v-btn icon dark @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>

          <v-toolbar-title>Create Delivery</v-toolbar-title>

          <v-spacer />

          <v-btn dark text @click="onSubmit">Save</v-btn>
        </v-toolbar>

        <v-container fluid>
          <v-row>
            <v-col cols="12" lg="6">
              <v-form ref="form">
                <v-row>
                  <v-col cols="12" lg="4">
                    <v-text-field
                      dense
                      outlined
                      hide-details="auto"
                      v-model="form.dr_number"
                      label="DR Number"
                      required
                    />
                  </v-col>

                  <v-col cols="12" lg="4">
                    <v-autocomplete
                      dense
                      outlined
                      clearable
                      label="Supplier"
                      hide-details="auto"
                      :items="suppliers.data"
                      item-value="id"
                      item-text="name"
                      v-model="form.supplier_id"
                      :search-input.sync="searchSupplier"
                    />
                  </v-col>

                  <v-col cols="12" lg="4">
                    <v-autocomplete
                      dense
                      outlined
                      clearable
                      label="Received By"
                      hide-details="auto"
                      :items="users.data"
                      item-value="id"
                      item-text="full_name"
                      v-model="form.user_id"
                      :search-input.sync="searchUser"
                    />
                  </v-col>

                  <v-col cols="12" lg="12">
                    <v-autocomplete
                      dense
                      outlined
                      clearable
                      placeholder="Search product..."
                      hide-details="auto"
                      :items="products.data"
                      item-value="id"
                      item-text="name"
                      v-model="form.product"
                      :search-input.sync="searchProduct"
                      return-object
                    />
                  </v-col>

                  <v-col cols="12" lg="4">
                    <v-text-field
                      dense
                      outlined
                      type="number"
                      label="Quantity"
                      hide-details="auto"
                      v-model.number="form.quantity"
                    />
                  </v-col>

                  <v-col cols="12" lg="4">
                    <v-text-field
                      dense
                      outlined
                      type="number"
                      label="Price"
                      hide-details="auto"
                      v-model.number="form.price"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-btn depressed color="primary" @click="addItem">
                      Add Item
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-col>
            <v-col cols="12" lg="6">
              <div style="background-color: gray; height: 90.5vh" class="pa-2">
                <v-row>
                  <v-col cols="12" lg="4" offset="8">
                    <v-card>
                      <v-card-text class="text-right">
                        <div>TOTAL</div>

                        <p class="pt-3 text-h4 text--primary">
                          {{ totalPrice }}
                        </p>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>

                <v-simple-table class="mt-3">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Product Name</th>
                        <th class="text-left">Unit</th>
                        <th class="text-center">Quantity</th>
                        <th class="text-right">Price</th>
                        <th class="text-right"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in form.items" :key="index">
                        <td>{{ item.product_name }}</td>
                        <td>{{ item.uom }}</td>
                        <td class="text-center">{{ item.quantity }}</td>
                        <td class="text-right">{{ item.price }}</td>
                        <td class="text-right">
                          <v-btn
                            color="red mb-2 mt-1 white--text"
                            small
                            icon
                            @click="removeItem(index)"
                          >
                            <v-icon small>delete_outline</v-icon>
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Helper from '@/mixins/helper';
import { debounce } from 'lodash';

export default {
  mixins: [Helper],

  props: {
    order: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      dialog: false,
      loading: false,
      searchUser: null,
      searchProduct: null,
      searchSupplier: null,
      form: {
        dr_number: '',
        user_id: '',
        product: {},
        supplier_id: '',
        quantity: '',
        price: '',
        items: [],
      },
    };
  },

  computed: {
    ...mapGetters('user', ['users']),
    ...mapGetters('product', ['products']),
    ...mapGetters('supplier', ['suppliers']),

    uom() {
      return this.form.product && this.form.product.uom
        ? this.form.product.uom.long_name
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
    ...mapActions('supplier', ['getSuppliers']),
    ...mapActions('order', ['addOrder', 'updateOrder']),

    open() {
      this.dialog = true;
    },

    close() {
      this.dialog = false;

      this.form = {
        dr_number: '',
        user_id: '',
        product: {},
        supplier_id: '',
        quantity: '',
        items: [],
      };
    },

    addItem() {
      this.form.items.push({
        product_id: this.form.product.id,
        product_name: this.form.product.name,
        uom: this.form.product?.uom?.long_name,
        quantity: this.form.quantity,
        price: this.form.price,
      });

      this.form.product = {};
      this.form.quantity = '';
      this.form.price = '';
    },

    removeItem(index) {
      this.form.items.splice(index, 1);
    },

    async onSubmit() {
      this.loading = true;
      await this.save();
    },

    async save() {
      try {
        await this.addOrder(this.form);

        this.close();
      } catch (error) {
        console.log(error);
        this.$refs.form.setErrors(error.response.data.errors);
      } finally {
        this.loading = false;
      }
    },

    fetchUser: debounce(async function () {
      const params = new URLSearchParams({
        'filter[full_name]': this.searchUser,
      });

      await this.getUsers(params);
    }, 350),

    fetchProduct: debounce(async function () {
      const params = new URLSearchParams({
        'filter[name]': this.searchProduct,
        include: 'uom',
      });

      await this.getProducts(params);
    }, 350),

    fetchSupplier: debounce(async function () {
      const params = new URLSearchParams({
        'filter[name]': this.searchSupplier,
      });

      await this.getSuppliers(params);
    }, 350),
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

    searchSupplier() {
      if (this.searchSupplier) {
        this.fetchSupplier();
      }
    },
  },
};
</script>
