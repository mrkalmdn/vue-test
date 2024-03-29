<template>
  <div>
    <v-btn v-if="isEmptyObject(client)" color="primary" depressed @click="open">
      New Client
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
          <v-toolbar-title v-if="isEmptyObject(client)">
            Create Client
          </v-toolbar-title>
          <v-toolbar-title v-else>Edit {{ client.name }}</v-toolbar-title>
        </v-toolbar>

        <validation-observer ref="form">
          <v-form @submit.prevent="onSubmit">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <validation-provider v-slot="{ errors }" name="client_name">
                    <v-text-field
                      dense
                      outlined
                      label="Client Name"
                      hide-details="auto"
                      :error-messages="errors"
                      v-model="form.client_name"
                    />
                  </validation-provider>
                </v-col>
                <v-col cols="12">
                  <validation-provider v-slot="{ errors }" name="business_name">
                    <v-text-field
                      dense
                      outlined
                      label="Company Name"
                      hide-details="auto"
                      :error-messages="errors"
                      v-model="form.business_name"
                    />
                  </validation-provider>
                </v-col>
                <v-col cols="12">
                  <validation-provider v-slot="{ errors }" name="address">
                    <v-text-field
                      dense
                      outlined
                      label="Address"
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
                      label="Contact"
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
    client: {
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
        client_name: '',
        address: '',
        contact: '',
        business_name: '',
      },
    };
  },

  methods: {
    ...mapActions('client', ['addClient', 'updateClient']),

    open() {
      this.dialog = true;

      if (!this.isEmptyObject(this.client)) {
        this.form.id = this.client.id;
        this.form.client_name = this.client.client_name;
        this.form.business_name = this.client.business_name;
        this.form.contact = this.client.contact;
        this.form.address = this.client.address;
      }
    },

    close() {
      this.dialog = false;

      this.form = {
        client_name: '',
        address: '',
        contact: '',
        business_name: '',
      };
    },

    async onSubmit() {
      this.loading = true;

      if (this.isEmptyObject(this.client)) {
        await this.save();
      } else {
        await this.update();
      }
    },

    async save() {
      try {
        await this.addClient(this.form);

        this.close();
      } catch (error) {
        this.$refs.form.setErrors(error.response.data.errors);
      } finally {
        this.loading = false;
      }
    },

    async update() {
      try {
        await this.updateClient(this.form);

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
