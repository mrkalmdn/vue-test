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
              <validation-observer ref="form" v-slot="{ handleSubmit }">
                <v-form @submit.prevent="handleSubmit(addItem)">
                  <v-row>
                    <v-col cols="12" lg="4">
                      <validation-provider
                        rules="required"
                        v-slot="{ errors }"
                        name="dr_number"
                      >
                        <v-text-field
                          dense
                          outlined
                          hide-details="auto"
                          v-model="form.dr_number"
                          label="DR Number"
                          :error-messages="errors"
                        />
                      </validation-provider>
                    </v-col>

                    <v-col cols="12" lg="4">
                      <validation-provider
                        rules="required"
                        v-slot="{ errors }"
                        name="supplier_id"
                      >
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
                          :error-messages="errors"
                        />
                      </validation-provider>
                    </v-col>

                    <v-col cols="12" lg="4">
                      <validation-provider
                        rules="required"
                        v-slot="{ errors }"
                        name="user_id"
                      >
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
                          :error-messages="errors"
                        />
                      </validation-provider>
                    </v-col>

                    <v-col cols="12" lg="12">
                      <validation-provider
                        rules="required"
                        v-slot="{ errors }"
                        name="product"
                      >
                        <v-autocomplete
                          dense
                          outlined
                          clearable
                          placeholder="Search product..."
                          hide-details="auto"
                          :items="products.data"
                          item-value="id"
                          item-text="unique_name"
                          v-model="form.product"
                          :search-input.sync="searchProduct"
                          return-object
                          :error-messages="errors"
                        />
                      </validation-provider>
                    </v-col>

                    <v-col cols="12" lg="4">
                      <validation-provider
                        rules="required|min:1"
                        v-slot="{ errors }"
                        name="quantity"
                      >
                        <v-text-field
                          dense
                          outlined
                          type="number"
                          label="Quantity"
                          hide-details="auto"
                          v-model.number="form.quantity"
                          :error-messages="errors"
                        />
                      </validation-provider>
                    </v-col>

                    <v-col cols="12" lg="4">
                      <validation-provider
                        rules="required|min:0.01"
                        v-slot="{ errors }"
                        name="price"
                      >
                        <v-text-field
                          dense
                          outlined
                          type="number"
                          label="Price"
                          hide-details="auto"
                          v-model.number="form.price"
                          :error-messages="errors"
                        />
                      </validation-provider>
                    </v-col>

                    <v-col cols="12">
                      <v-btn depressed type="submit" color="primary">
                        Add Item
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </validation-observer>
            </v-col>
            <v-col cols="12" lg="6">
              <div
                style="
                  background-color: gray;
                  height: 90.5vh;
                  overflow-x: hidden;
                  overflow-y: auto;
                "
                class="pa-2"
              >
                <v-row>
                  <v-col cols="12" v-if="errors && errors.items">
                    <v-alert dense type="error">
                      {{ errors.items[0] }}
                    </v-alert>
                  </v-col>
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
                        <td class="text-center">
                          <v-tooltip
                            small
                            v-if="hasError(index, 'quantity')"
                            bottom
                          >
                            <template v-slot:activator="{ on }">
                              <v-icon color="red" v-on="on">error</v-icon>
                            </template>
                            <span>
                              {{ errors[`items.${index}.quantity`][0] }}
                            </span>
                          </v-tooltip>

                          {{ item.quantity }}
                        </td>
                        <td class="text-right">
                          <v-tooltip
                            small
                            v-if="hasError(index, 'price')"
                            bottom
                          >
                            <template v-slot:activator="{ on }">
                              <v-icon color="red" v-on="on">error</v-icon>
                            </template>
                            <span>
                              {{ errors[`items.${index}.price`][0] }}
                            </span>
                          </v-tooltip>

                          {{ item.price }}
                        </td>
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
import { debounce } from 'lodash';
import {
  ValidationObserver,
  ValidationProvider,
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
    ValidationObserver,
    ValidationProvider,
  },

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
      errors: null,
      form: {
        dr_number: '',
        user_id: '',
        product: '',
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

    removeItem(index) {
      this.form.items.splice(index, 1);
    },

    hasError(index, type) {
      if (this.errors && this.errors[`items.${index}.${type}`]) {
        return true;
      }

      return false;
    },

    async onSubmit() {
      this.loading = true;
      this.errors = null;
      await this.save();
    },

    async save() {
      try {
        await this.addOrder(this.form);

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
    }, 350),

    fetchProduct: debounce(async function () {
      const params = new URLSearchParams({
        'filter[unique_name]': this.searchProduct,
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
