<template>
  <div>
    <v-toolbar flat color="transparent">
      <v-container>
        <h1>Create Category</h1>
      </v-container>
    </v-toolbar>

    <v-container>
      <div class="mt-5">
        <v-row>
          <v-col cols="12" lg="8">
            <v-card outlined class="pa-2">
              <validation-observer ref="form">
                <v-col cols="12" lg="5">
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
              </validation-observer>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-btn color="primary" depressed @click="save">Save</v-btn>

            <v-btn outlined class="ml-2" :to="{ name: 'categories' }">
              Cancel
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { ValidationObserver, ValidationProvider } from 'vee-validate';

export default {
  components: {
    ValidationObserver,
    ValidationProvider,
  },

  data: () => ({
    form: {
      name: '',
    },
  }),

  methods: {
    ...mapActions('category', ['addCategory']),

    async save() {
      try {
        await this.addCategory(this.form);

        this.$router.push('/categories');
      } catch (error) {
        this.$refs.form.setErrors(error.response.data.errors);
      }
    },
  },
};
</script>
