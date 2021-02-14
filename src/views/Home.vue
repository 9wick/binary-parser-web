<template>
  <div class="home">
    <BleAdvertisement />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import BleAdvertisement from '@/components/BleAdvertisement.vue';

@Options({
  components: {
    BleAdvertisement,
  },
})
export default class Home extends Vue {}
</script>
