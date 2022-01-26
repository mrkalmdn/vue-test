<template>
  <div>
    <v-toolbar flat color="transparent">
      <v-container>
        <h1 v-if="category && category.data">Edit {{ category.data.name }}</h1>
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
import { mapActions, mapGetters } from 'vuex';
import { ValidationObserver, ValidationProvider } from 'vee-validate';

export default {
  components: {
    ValidationObserver,
    ValidationProvider,
  },

  data() {
    return {
      form: {
        id: '',
        name: '',
      },
    };
  },

  computed: {
    ...mapGetters('category', ['category']),
  },

  methods: {
    ...mapActions('category', ['updateCategory', 'getCategory']),

    async save() {
      try {
        await this.updateCategory(this.form);
      } catch (error) {
        this.$refs.form.setErrors(error.response.data.errors);
      }
    },
  },

  async mounted() {
    await this.getCategory(this.$route.params.id);

    this.form.id = this.category.data.id;
    this.form.name = this.category.data.name;
  },
};
</script>
