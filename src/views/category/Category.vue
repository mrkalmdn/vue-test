<template>
  <div>
    <v-toolbar flat color="transparent">
      <h1>Categories</h1>

      <v-spacer />

      <v-btn color="primary" depressed :to="{ name: 'categories.create' }">
        New Category
      </v-btn>
    </v-toolbar>

    <v-container>
      <v-card outlined>
        <v-data-table
          :headers="headers"
          :items="[]"
          class="mt-12"
        ></v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    headers: [
      { text: 'Name', value: 'name' },
      { text: 'Description', value: 'description' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
  }),
};
</script>
