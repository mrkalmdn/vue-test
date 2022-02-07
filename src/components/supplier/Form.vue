<template>
  <div>
    <v-btn
      v-if="isEmptyObject(supplier)"
      color="primary"
      depressed
      @click="open"
    >
      New Supplier
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
          <v-toolbar-title v-if="isEmptyObject(supplier)">
            Create Supplier
          </v-toolbar-title>
          <v-toolbar-title v-else>Edit {{ supplier.name }}</v-toolbar-title>
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
                      label="Company Name"
                      hide-details="auto"
                      :error-messages="errors"
                      v-model="form.name"
                    />
                  </validation-provider>
                </v-col>

                <v-col cols="12">
                  <validation-provider v-slot="{ errors }" name="address">
                    <v-text-field
                      dense
                      outlined
                      label="Company Address"
                      hide-details="auto"
                      :error-messages="errors"
                      v-model="form.address"
                    />
                  </validation-provider>
                </v-col>

                <v-col cols="12">
                  <validation-provider v-slot="{ errors }" name="contact">
                    <v-text-field
                      dense
                      outlined
                      label="Company Contact"
                      hide-details="auto"
                      :error-messages="errors"
                      v-model="form.contact"
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
import { mapActions } from 'vuex';
import Helper from '@/mixins/helper';

export default {
  mixins: [Helper],

  props: {
    supplier: {
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
      form: {
        name: '',
        address: '',
        contact: '',
      },
    };
  },

  methods: {
    ...mapActions('supplier', ['addSupplier', 'updateSupplier']),

    open() {
      this.dialog = true;

      if (!this.isEmptyObject(this.supplier)) {
        this.form.id = this.supplier.id;
        this.form.name = this.supplier.name;
        this.form.address = this.supplier.address;
        this.form.contact = this.supplier.contact;
      }
    },

    close() {
      this.dialog = false;

      this.form = {
        name: '',
        address: '',
        contact: '',
      };
    },

    async onSubmit() {
      this.loading = true;

      if (this.isEmptyObject(this.supplier)) {
        await this.save();
      } else {
        await this.update();
      }
    },

    async save() {
      try {
        await this.addSupplier(this.form);

        this.close();
      } catch (error) {
        this.$refs.form.setErrors(error.response.data.errors);
      } finally {
        this.loading = false;
      }
    },

    async update() {
      try {
        await this.updateSupplier(this.form);

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
