<template>
  <div>
    <p style="color: red">Paragraph</p>

    <Child testProp="some-value" />

    <a href="https://google.com">Link</a>
  </div>
</template>

<script>
import Child from './Child.vue';

export default {
  props: ['item'],

  components: {
    Child,
  },
};
</script>
