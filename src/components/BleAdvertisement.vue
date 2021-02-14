<template>
  <div>
    <h1>BLE adv analyze</h1>
    <br />
    <br />
    <ParserView :getParser="getParser"></ParserView>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { BleAdvertisementParser } from '@/parser/ble/adv';
import ParserView from '@/components/ParserView.vue';

@Options({
  components: {
    ParserView,
  },
})
export default class BleAdvertisement extends Vue {
  getParser() {
    return BleAdvertisementParser;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
