<template>
  <div>
    <h1>BLE adv analyze</h1>
    <br />
    <br />
    Input advertisement data or scan response (space or comma separated data)<br />
    <input type="text" v-model="inputText" style="width:100%" /><br />
    number type :
    <input
      type="radio"
      name="number_type"
      id="number_type_hex"
      v-model="inputType"
      value="hex"
    /><label for="number_type_hex">HEX(0x0〜0xFF)</label>
    <input
      type="radio"
      name="number_type"
      id="number_type_dec"
      v-model="inputType"
      value="dec"
    /><label for="number_type_dec">DEC(0~255)</label><br />

    <button v-on:click="startParse">Parse</button>
    <br />
    <br />
    results: <br />
    <json-tree :data="results" :level="1" :key="resetKey"></json-tree>

    <code class="code">{{ code }}</code>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import JsonTree from 'vue-json-tree';
import { BleAdvertisementParser } from '@/parser/ble/adv';

@Options({
  components: {
    JsonTree,
  },
})
export default class BleAdvertisement extends Vue {
  name = 'BleAdvertisement';
  inputText = '02 01 1A 07 09 53 61 6D 70 6C 65';
  inputType = 'hex';
  results: any = { error: 'no input' };
  resetKey = 1;
  code = '';

  mounted() {
    this.code = BleAdvertisementParser.getCode();
    console.log(this.code);
  }

  startParse() {
    try {
      const dataArray = this.getInputDataArray();
      this.results = BleAdvertisementParser.parse(
        Buffer.from(dataArray),
        false
      );
      // .split('\n')
      // .join('<br/>');
      this.resetKey++;
    } catch (e) {
      debugger;
      this.results = { error: e.message, e };
    }
  }

  getInputDataArray() {
    const dataString = this.inputText;
    let dataArray = [];
    if (dataString.indexOf(',') >= 0) {
      dataArray = dataString
        .trim()
        .split(',')
        .map(e => {
          return e.trim();
        })
        .filter(e => {
          return e.length > 0;
        });
    } else {
      dataArray = dataString
        .trim()
        .split(' ')
        .map(e => {
          return e.trim();
        })
        .filter(e => {
          return e.length > 0;
        });
    }
    if (this.inputType === 'hex') {
      dataArray = dataArray.map(e => {
        return parseInt(e, 16);
      });
    } else {
      dataArray = dataArray.map(e => {
        return parseInt(e);
      });
    }
    return dataArray;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

code {
  text-align: left;
}
</style>
