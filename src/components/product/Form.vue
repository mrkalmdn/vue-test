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

    <v-dialog v-model="dialog" width="500" persistent>
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
                <v-col cols="12">
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

                <v-col cols="12">
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
      form: {
        name: '',
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

    open() {
      this.dialog = true;

      if (!this.isEmptyObject(this.product)) {
        this.form.id = this.product.id;
        this.form.name = this.product.name;
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
      this.getCategories();
    },
  },
};
</script>

<style lang="scss" scoped>
.pointer-cursor {
  cursor: pointer;
}
</style>
