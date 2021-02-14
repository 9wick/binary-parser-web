<template>
  <div>
    <h1>BLE HCI analyze</h1>
    <br />
    <br />
    <ParserView :getParser="getParser"></ParserView>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { BleHciParser } from '@/parser/ble/hci';
import ParserView from '@/components/ParserView.vue';

@Options({
  components: {
    ParserView,
  },
})
export default class BleHci extends Vue {
  getParser() {
    return BleHciParser;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
