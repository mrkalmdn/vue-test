<template>
  <div>
    <v-btn v-if="isEmptyObject(uom)" color="primary" depressed @click="open">
      New UOM
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
          <v-toolbar-title v-if="isEmptyObject(uom)">
            Create UOM
          </v-toolbar-title>
          <v-toolbar-title v-else>Edit {{ uom.name }}</v-toolbar-title>
        </v-toolbar>

        <validation-observer ref="form">
          <v-form @submit.prevent="onSubmit">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <validation-provider v-slot="{ errors }" name="short_name">
                    <v-text-field
                      dense
                      outlined
                      label="Short Name"
                      hide-details="auto"
                      :error-messages="errors"
                      v-model="form.short_name"
                    />
                  </validation-provider>
                </v-col>

                <v-col cols="12">
                  <validation-provider v-slot="{ errors }" name="long_name">
                    <v-text-field
                      dense
                      outlined
                      label="Long Name"
                      hide-details="auto"
                      :error-messages="errors"
                      v-model="form.long_name"
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
    uom: {
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
        short_name: '',
        long_name: '',
      },
    };
  },

  methods: {
    ...mapActions('uom', ['addUOM', 'updateUOM']),

    open() {
      this.dialog = true;

      if (!this.isEmptyObject(this.uom)) {
        this.form.id = this.uom.id;
        this.form.short_name = this.uom.short_name;
        this.form.long_name = this.uom.long_name;
      }
    },

    close() {
      this.dialog = false;

      this.form = {
        short_name: '',
        long_name: '',
      };
    },

    async onSubmit() {
      this.loading = true;

      if (this.isEmptyObject(this.uom)) {
        await this.save();
      } else {
        await this.update();
      }
    },

    async save() {
      try {
        await this.addUOM(this.form);

        this.close();
      } catch (error) {
        this.$refs.form.setErrors(error.response.data.errors);
      } finally {
        this.loading = false;
      }
    },

    async update() {
      try {
        await this.updateUOM(this.form);

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
