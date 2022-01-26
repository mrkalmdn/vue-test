<template>
  <div>
    <Navbar />

    <v-main>
      <router-view />
    </v-main>
  </div>
</template>

<script>
import Navbar from '@/components/shared/Navbar';

export default {
  components: {
    Navbar,
  },
};
</script>
