<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" lg="4" v-for="(image, key) in images" :key="key">
          <v-img :src="image" @click="open(image)" />

          <v-dialog v-model="dialog" width="800">
            <v-img :src="selectedImage" />
          </v-dialog>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    selectedImage: null,
    images: [
      'https://images.pexels.com/photos/2693212/pexels-photo-2693212.png?auto=compress&cs=tinysrgb&dpr=1&w=500',
      'https://images.pexels.com/photos/2693212/pexels-photo-2693212.png?auto=compress&cs=tinysrgb&dpr=1&w=500',
      'https://images.pexels.com/photos/2693212/pexels-photo-2693212.png?auto=compress&cs=tinysrgb&dpr=1&w=500',
    ],
  }),

  methods: {
    open(image) {
      this.selectedImage = image;
      this.dialog = true;
    },
  },
};
</script>
