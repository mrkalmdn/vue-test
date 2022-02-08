<template>
  <div>
    <v-btn
      v-if="isEmptyObject(replace)"
      color="primary"
      depressed
      @click="open"
    >
      Add Return
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
          <v-toolbar-title v-if="isEmptyObject(replace)">
            Create Return
          </v-toolbar-title>
          <v-toolbar-title v-else>Edit {{ replace.name }}</v-toolbar-title>
        </v-toolbar>

        <validation-observer ref="form">
          <v-form @submit.prevent="onSubmit">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-autocomplete
                    dense
                    outlined
                    label="Transaction ID / Sales Invoice No."
                    :items="items"
                    hide-details="auto"
                    :error-messages="errors"
                    :search-input.sync="searchTransactionID"
                  />
                </v-col>
                <v-col cols="12">
                  <validation-provider v-slot="{ errors }" name="name">
                    <v-autocomplete
                      dense
                      outlined
                      label="Catch Products"
                      :items="items"
                      hide-details="auto"
                      :error-messages="errors"
                      :search-input.sync="searchProduct"
                    />
                  </validation-provider>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    dense
                    outlined
                    label="Quantity"
                    hide-details="auto"
                    :error-messages="errors"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    dense
                    outlined
                    label="Amount"
                    hide-details="auto"
                    :error-messages="errors"
                  />
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
    replace: {
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
      },
    };
  },

  methods: {
    ...mapActions('replace', ['addReplace', 'updateReplace']),

    open() {
      this.dialog = true;

      if (!this.isEmptyObject(this.replace)) {
        this.form.id = this.replace.id;
        this.form.name = this.replace.name;
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

      if (this.isEmptyObject(this.replace)) {
        await this.save();
      } else {
        await this.update();
      }
    },

    async save() {
      try {
        await this.addReplace(this.form);

        this.close();
      } catch (error) {
        this.$refs.form.setErrors(error.response.data.errors);
      } finally {
        this.loading = false;
      }
    },

    async update() {
      try {
        await this.updateReplace(this.form);

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
