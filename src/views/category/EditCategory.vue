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

            <div class="mt-3">
              <v-btn color="primary" depressed @click="save">Save</v-btn>

              <v-btn
                text
                class="ml-2 black--text"
                @click="$router.push('/categories')"
              >
                Cancel
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12" lg="4">
            <v-card outlined>
              <v-card-text>
                <b>Created at</b>
                <p v-if="category && category.data">
                  {{ dateFromNow(category.data.created_at) }}
                </p>

                <b>Last modified at</b>
                <p v-if="category && category.data">
                  {{ dateFromNow(category.data.updated_at) }}
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12"></v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

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

        this.$router.push('/categories');
      } catch (error) {
        this.$refs.form.setErrors(error.response.data.errors);
      }
    },

    dateFromNow(date) {
      dayjs.extend(relativeTime);

      return dayjs(date).fromNow();
    },
  },

  async mounted() {
    await this.getCategory(this.$route.params.id);

    this.form.id = this.category.data.id;
    this.form.name = this.category.data.name;
  },
};
</script>
