<template>
  <div>
    <div
      class="ml-2 font-weight-bold red--text pointer-cursor"
      color="error"
      @click="open"
    >
      Delete
    </div>

    <v-dialog v-model="dialog" width="400">
      <v-card class="mx-auto">
        <v-container>
          <h2 class="text-center">Delete</h2>

          <p class="text-center mt-3">
            Are you sure you would like to do this?
          </p>
        </v-container>

        <v-divider></v-divider>

        <v-container>
          <v-row>
            <v-col>
              <v-btn block depressed color="error" @click="onClick">
                Delete {{ name }}
              </v-btn>
            </v-col>

            <v-col>
              <v-btn text block @click="close">Cancel</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },

    item: {
      type: Object,
      required: true,
    },

    delete: {
      type: Function,
      required: true,
    },
  },

  data: () => ({
    dialog: false,
  }),

  methods: {
    open() {
      this.dialog = true;
    },

    close() {
      this.dialog = false;
    },

    onClick() {
      this.delete(this.item.id);
      this.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.pointer-cursor {
  cursor: pointer;
}
</style>
