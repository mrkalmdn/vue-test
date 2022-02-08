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
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Input Items</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="onSubmit">Save</v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-container>
          <v-row>
            <v-col cols="12" lg="6" md="6">
              <v-form ref="form">
                <v-row class="mb-2">
                  <!-- Employee Name -->
                  <v-col cols="6">
                    <v-autocomplete
                      clearable
                      label="Employee *"
                      :items="users.data"
                      item-value="id"
                      item-text="full_name"
                      v-model="form.user_id"
                      :search-input.sync="searchUser"
                    />
                  </v-col>
                  <!-- Company Name Delivery -->
                  <v-col cols="6">
                    <v-autocomplete
                      clearable
                      label="Company Name*"
                      :items="suppliers.data"
                      item-value="id"
                      item-text="name"
                      v-model="form.supplier_id"
                      :search-input.sync="searchSupplier"
                    />
                  </v-col>
                  <!-- ** Search Product Database ** -->
                  <v-col cols="12">
                    <v-autocomplete
                      clearable
                      label="Product*"
                      :items="products.data"
                      item-value="id"
                      item-text="name"
                      v-model="form.product"
                      :search-input.sync="searchProduct"
                      return-object
                    />
                  </v-col>
                  <!-- ** Get Product UOM ** -->
                  <v-col cols="6">
                    <v-text-field
                      :value="uom"
                      label="Unit of Measure*"
                      readonly
                      disabled
                      required
                    />
                  </v-col>
                  <v-col cols="6" lg="6" md="6">
                    <v-text-field
                      v-model="form.quantity"
                      label="Quantity*"
                      type="number"
                      required
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      v-model="form.dr_number"
                      label="DR Number"
                      required
                    />
                  </v-col>

                  <small>*indicates required field</small>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close()">
                    Close
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="addItem()">
                    Add
                  </v-btn>
                </v-row>
                <v-divider></v-divider>
              </v-form>
              <!-- DELIVERY IN -->
            </v-col>
            <v-col cols="12" lg="6" md="6">
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Product Name</th>
                      <th class="text-left">Unit</th>
                      <th class="text-left">Quantity</th>
                      <th class="text-left">Price</th>
                      <th class="text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in form.items" :key="index">
                      <td>{{ item.product_name }}</td>
                      <td>{{ item.uom }}</td>
                      <td>{{ item.quantity }}</td>
                      <td>{{ item.price }}</td>
                      <td>
                        <v-btn
                          color="red mb-2 mt-1 white--text"
                          text
                          @click="removeItem(index)"
                        >
                          <v-icon>mdi-clipboard-remove-outline</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
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
        price: this.form.product.selling_price,
      });

      this.form.product = {};
      this.form.quantity = '';
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
  },

  watch: {
    searchUser() {
      const params = new URLSearchParams({
        'filter[full_name]': this.searchUser,
      });

      this.getUsers(params);
    },

    searchProduct() {
      const params = new URLSearchParams({
        'filter[name]': this.searchProduct,
        include: 'uom',
      });

      this.getProducts(params);
    },

    searchSupplier() {
      const params = new URLSearchParams({
        'filter[name]': this.searchSupplier,
      });

      this.getSuppliers(params);
    },
  },
};
</script>

<style lang="scss" scoped>
.pointer-cursor {
  cursor: pointer;
}
</style>
