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
            <v-btn dark text @click="transationComplete">Save</v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-container>
          <v-row>
            <v-col cols="12" lg="6" md="6">
              <v-form ref="form" v-model="valid">
                <v-row class="mb-2">
                  <!-- Employee Name -->
                  <v-col cols="6">
                    <v-autocomplete
                      auto-select-first
                      clearable
                      label="Employee Checker*"
                      :items="allProducts"
                      :rules="nameRules"
                      item-value="id"
                      item-text="uniquename"
                      v-model="form.product"
                      @change="fillForm(form.product)"
                      return-object
                      validate-on-blur
                    />
                  </v-col>
                  <!-- Company Name Delivery -->
                  <v-col cols="6">
                    <v-autocomplete
                      auto-select-first
                      clearable
                      label="Company Name*"
                      :items="allProducts"
                      :rules="nameRules"
                      item-value="id"
                      item-text="uniquename"
                      v-model="form.product"
                      @change="fillForm(form.product)"
                      return-object
                      validate-on-blur
                    />
                  </v-col>
                  <!-- ** Search Product Database ** -->
                  <v-col cols="12">
                    <v-autocomplete
                      auto-select-first
                      clearable
                      label="Product*"
                      :items="allProducts"
                      :rules="nameRules"
                      item-value="id"
                      item-text="uniquename"
                      v-model="form.product"
                      @change="fillForm(form.product)"
                      return-object
                      validate-on-blur
                    />
                  </v-col>
                  <!-- ** Get Product UOM ** -->
                  <v-col cols="6">
                    <v-text-field
                      v-model="form.uom"
                      label="Unit of Measure*"
                      readonly
                      disabled
                      required
                      :rules="nameRules"
                      validate-on-blur
                    />
                  </v-col>
                  <v-col cols="6" lg="6" md="6">
                    <v-text-field
                      v-model="form.quantity"
                      label="Quantity*"
                      type="number"
                      required
                      :rules="nameRules"
                      validate-on-blur
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
                      <th class="text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in transactions" :key="index">
                      <td>{{ item.product_name }}</td>
                      <td>{{ item.uom }}</td>
                      <td>{{ item.quantity }}</td>
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
import { mapActions } from 'vuex';
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
      form: {
        customer_name: '',
        status: '',
        // status of transaction "1" pending for confirmation
        // status "       "      "2" complete
      },
    };
  },

  methods: {
    ...mapActions('order', ['addOrder', 'updateOrder']),

    open() {
      this.dialog = true;
    },

    close() {
      this.dialog = false;

      this.form = {
        customer_name: '',
      };
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
        this.$refs.form.setErrors(error.response.data.errors);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pointer-cursor {
  cursor: pointer;
}
</style>
