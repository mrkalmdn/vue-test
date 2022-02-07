<template>
  <div>
    <v-btn v-if="isEmptyObject(user)" color="primary" depressed @click="open">
      New User
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
          <v-toolbar-title v-if="isEmptyObject(user)">
            Create User
          </v-toolbar-title>
          <v-toolbar-title v-else>Edit {{ user.name }}</v-toolbar-title>
        </v-toolbar>

        <validation-observer ref="form">
          <v-form @submit.prevent="onSubmit">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <validation-provider v-slot="{ errors }" name="username">
                    <v-text-field
                      dense
                      outlined
                      label="Username"
                      hide-details="auto"
                      :error-messages="errors"
                      v-model="form.username"
                    />
                  </validation-provider>
                </v-col>
                <v-col cols="6">
                  <validation-provider v-slot="{ errors }" name="firstname">
                    <v-text-field
                      dense
                      outlined
                      label="First Name"
                      hide-details="auto"
                      :error-messages="errors"
                      v-model="form.firstname"
                    />
                  </validation-provider>
                </v-col>
                <v-col cols="6">
                  <validation-provider v-slot="{ errors }" name="lastname">
                    <v-text-field
                      dense
                      outlined
                      label="Last Name"
                      hide-details="auto"
                      :error-messages="errors"
                      v-model="form.lastname"
                    />
                  </validation-provider>
                </v-col>
                <v-col cols="12">
                  <validation-provider v-slot="{ errors }" name="user_type">
                    <v-autocomplete
                      dense
                      outlined
                      label="User Type"
                      :items="items"
                      hide-details="auto"
                      :error-messages="errors"
                      v-model="form.user_type"
                    />
                  </validation-provider>
                </v-col>
                <v-col cols="6">
                  <validation-provider v-slot="{ errors }" name="password">
                    <v-text-field
                      type="password"
                      dense
                      outlined
                      label="Password"
                      hide-details="auto"
                      :error-messages="errors"
                      v-model="form.password"
                    />
                  </validation-provider>
                </v-col>
                <v-col cols="6">
                  <validation-provider
                    v-slot="{ errors }"
                    name="confirm_password"
                  >
                    <v-text-field
                      type="password"
                      dense
                      outlined
                      label="Confirm Password"
                      hide-details="auto"
                      :error-messages="errors"
                      v-model="form.confirm_password"
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
    user: {
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
      items: ['Admin', 'Secretary', 'Cashier'],
      values: ['1', '2', '3'],
      value: null,
      dialog: false,
      loading: false,
      form: {
        username: '',
        firstname: '',
        lastname: '',
        password: '',
        confirm_password: '',
        user_type: '',
      },
    };
  },

  methods: {
    ...mapActions('user', ['addUser', 'updateUser']),

    open() {
      this.dialog = true;

      if (!this.isEmptyObject(this.user)) {
        this.form.id = this.user.id;
        this.form.username = this.user.username;
        this.form.firstname = this.user.firstname;
        this.form.lastname = this.user.lastname;
        this.form.user_type = this.user.user_type;
      }
    },

    close() {
      this.dialog = false;

      this.form = {
        username: '',
        firstname: '',
        lastname: '',
        user_type: '',
        password: '',
        confirm_password: '',
      };
    },

    async onSubmit() {
      this.loading = true;

      if (this.isEmptyObject(this.user)) {
        await this.save();
      } else {
        await this.update();
      }
    },

    async save() {
      try {
        await this.addUser(this.form);

        this.close();
      } catch (error) {
        this.$refs.form.setErrors(error.response.data.errors);
      } finally {
        this.loading = false;
      }
    },

    async update() {
      try {
        await this.updateUser(this.form);

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
