<template>
  <div>
    <v-container fluid class="pa-0 ma-0">
      <v-row no-gutters>
        <v-col cols="12" lg="8" sm="4" class="bg-image primary"></v-col>

        <v-col cols="12" xs="12" sm="8" lg="4">
          <div class="login d-flex align-center py-5 px-5">
            <v-container>
              <div class="d-flex align-center justify-center">
                <v-img
                  :src="require('../assets/logo.png')"
                  max-width="250"
                ></v-img>
              </div>

              <v-row>
                <v-col class="mx-auto">
                  <h2>Vue2Test</h2>

                  <h4 class="mt-5 mb-5">
                    <span>Log in</span>
                    <br />
                    <small class="caption">Sign in to your account</small>
                  </h4>

                  <v-alert v-if="error" dense text type="error">
                    {{ error }}
                  </v-alert>

                  <validation-observer ref="observer" v-slot="{ passes }">
                    <v-form @submit.prevent="passes(onSubmit)">
                      <validation-provider v-slot="{ errors }" name="email">
                        <v-text-field
                          label="Email"
                          outlined
                          type="email"
                          v-model="form.email"
                          :error-messages="errors"
                        ></v-text-field>
                      </validation-provider>

                      <validation-provider v-slot="{ errors }" name="password">
                        <v-text-field
                          label="Password"
                          outlined
                          type="password"
                          v-model="form.password"
                          :error-messages="errors"
                        ></v-text-field>
                      </validation-provider>

                      <v-btn
                        depressed
                        x-large
                        block
                        dark
                        color="primary"
                        type="submit"
                        :loading="loading"
                      >
                        <span>Submit</span>
                        <v-icon right class="ml-3 outlined">mdi-send</v-icon>
                      </v-btn>
                    </v-form>
                  </validation-observer>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { ValidationObserver, ValidationProvider } from 'vee-validate';

export default {
  name: 'Home',

  components: {
    ValidationObserver,
    ValidationProvider,
  },

  data() {
    return {
      error: null,
      loading: false,
      form: {
        email: '',
        password: '',
      },
    };
  },

  methods: {
    ...mapActions('auth', ['login']),

    async onSubmit() {
      this.error = null;
      this.loading = true;

      try {
        await this.login(this.form);

        this.$router.push('/dashboard');
      } catch (error) {
        console.log(error);
        this.$refs.observer.setErrors(error.response.data.errors);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  min-height: 100vh;
}
</style>
