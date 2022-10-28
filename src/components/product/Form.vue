<template>
  <div>
    <v-btn
      v-if="isEmptyObject(product)"
      color="primary"
      depressed
      @click="open"
    >
      New Product
    </v-btn>

    <div
      v-else
      class="text-decoration-none font-weight-bold pointer-cursor"
      @click="open"
    >
      Edit
    </div>

    <v-dialog v-model="dialog" width="800" persistent>
      <v-card>
        <v-toolbar dense flat>
          <v-toolbar-title v-if="isEmptyObject(product)">
            Create Product
          </v-toolbar-title>
          <v-toolbar-title v-else>Edit {{ product.name }}</v-toolbar-title>
        </v-toolbar>

        <validation-observer ref="form">
          <v-form @submit.prevent="onSubmit">
            <v-container>
              <v-row>
                <v-col cols="6">
                  <validation-provider v-slot="{ errors }" name="name">
                    <v-text-field
                      dense
                      outlined
                      label="Name"
                      hide-details="auto"
                      :error-messages="errors"
                      v-model="form.name"
                    />
                  </validation-provider>
                </v-col>

                <v-col cols="6">
                  <validation-provider v-slot="{ errors }" name="brand_id">
                    <v-autocomplete
                      dense
                      outlined
                      label="Brand"
                      item-value="id"
                      item-text="name"
                      :items="brands.data"
                      hide-details="auto"
                      :error-messages="errors"
                      :search-input.sync="searchBrand"
                      v-model="form.brand_id"
                    />
                  </validation-provider>
                </v-col>

                <v-col cols="4">
                  <validation-provider v-slot="{ errors }" name="code">
                    <v-text-field
                      dense
                      outlined
                      label="Code"
                      hide-details="auto"
                      :error-messages="errors"
                      v-model="form.code"
                    />
                  </validation-provider>
                </v-col>

                <v-col cols="4">
                  <validation-provider v-slot="{ errors }" name="color">
                    <v-text-field
                      dense
                      outlined
                      label="Color"
                      hide-details="auto"
                      :error-messages="errors"
                      v-model="form.color"
                    />
                  </validation-provider>
                </v-col>

                <v-col cols="4">
                  <validation-provider v-slot="{ errors }" name="size">
                    <v-text-field
                      dense
                      outlined
                      label="Size"
                      hide-details="auto"
                      :error-messages="errors"
                      v-model="form.size"
                    />
                  </validation-provider>
                </v-col>

                <v-col cols="6">
                  <validation-provider v-slot="{ errors }" name="category_id">
                    <v-autocomplete
                      dense
                      outlined
                      label="Category"
                      item-value="id"
                      item-text="name"
                      :items="categories.data"
                      hide-details="auto"
                      :error-messages="errors"
                      :search-input.sync="searchCategory"
                      v-model="form.category_id"
                    />
                  </validation-provider>
                </v-col>
                <v-col cols="6">
                  <validation-provider v-slot="{ errors }" name="u_o_m_id">
                    <v-autocomplete
                      dense
                      outlined
                      label="Unit of Measure"
                      item-value="id"
                      item-text="long_name"
                      :items="uoms.data"
                      hide-details="auto"
                      :error-messages="errors"
                      :search-input.sync="searchUOMs"
                      v-model="form.u_o_m_id"
                    />
                  </validation-provider>
                </v-col>

                <v-col cols="12">
                  <validation-provider v-slot="{ errors }" name="price">
                    <v-text-field
                      type="number"
                      dense
                      outlined
                      label="Selling Price"
                      hide-details="auto"
                      :error-messages="errors"
                      v-model="form.price"
                    />
                  </validation-provider>
                </v-col>
              </v-row>
            </v-container>

            <v-divider></v-divider>

            <v-container>
              <v-row>
                <v-col>
                  <v-btn
                    block
                    depressed
                    color="primary"
                    type="submit"
                    :disabled="loading"
                    :loading="loading"
                  >
                    Save
                  </v-btn>
                </v-col>

                <v-col>
                  <v-btn text block @click="close" :disabled="loading">
                    Cancel
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </validation-observer>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { mapActions, mapGetters } from 'vuex';
import Helper from '@/mixins/helper';

export default {
  mixins: [Helper],

  props: {
    product: {
      type: Object,
      default: () => ({}),
    },
  },

  components: {
    ValidationObserver,
    ValidationProvider,
  },

  data() {
    return {
      dialog: false,
      loading: false,
      searchCategory: null,
      searchBrand: null,
      searchUOMs: null,
      form: {
        name: '',
        brand_id: '',
        category_id: '',
        u_o_m_id: '',
        price: '',
        code: '',
        color: '',
        size: '',
      },
    };
  },

  computed: {
    ...mapGetters({
      categories: 'category/categories',
      brands: 'brand/brands',
      uoms: 'uom/uoms',
    }),
  },

  methods: {
    ...mapActions('product', ['addProduct', 'updateProduct']),
    ...mapActions('category', ['getCategories']),
    ...mapActions('brand', ['getBrands']),
    ...mapActions('uom', ['getUOMs']),

    open() {
      this.dialog = true;

      if (!this.isEmptyObject(this.product)) {
        this.form.id = this.product.id;
        this.form.name = this.product.name;
        this.form.price = this.product.selling_price;
        this.form.code = this.product.code;
        this.form.color = this.product.color;
        this.form.size = this.product.size;
        this.form.brand_id = this.product.brand.id;
        this.form.category_id = this.product.category.id;
        this.form.u_o_m_id = this.product.uom.id;
      }
    },

    close() {
      this.dialog = false;

      this.form = {
        name: '',
      };
    },

    async onSubmit() {
      this.loading = true;

      if (this.isEmptyObject(this.product)) {
        await this.save();
      } else {
        await this.update();
      }
    },

    async save() {
      try {
        await this.addProduct(this.form);

        this.close();
      } catch (error) {
        this.$refs.form.setErrors(error.response.data.errors);
      } finally {
        this.loading = false;
      }
    },

    async update() {
      try {
        await this.updateProduct(this.form);

        this.close();
      } catch (error) {
        this.$refs.form.setErrors(error.response.data.errors);
      } finally {
        this.loading = false;
      }
    },
  },

  watch: {
    searchCategory() {
      const params = new URLSearchParams({
        'filter[name]': this.searchCategory,
      });

      this.getCategories(params);
    },

    searchBrand() {
      const params = new URLSearchParams({
        'filter[name]': this.searchBrand,
      });

      this.getBrands(params);
    },

    searchUOMs() {
      const params = new URLSearchParams({
        'filter[name]': this.searchBrand,
      });

      this.getUOMs(params);
    },
  },
};
</script>

<style lang="scss" scoped>
.pointer-cursor {
  cursor: pointer;
}
</style>
