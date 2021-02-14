<template>
  <div class="home">
    <BleHci />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import BleHci from '@/components/BleHci.vue';

@Options({
  components: {
    BleHci,
  },
})
export default class Home extends Vue {}
</script>
