<template>
  <div>
    Input data (space or comma separated data)<br />
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

    <button v-on:click="addQuery">Parse</button>
    <br />
    <br />
    results: <br />
    <json-tree :data="results" :level="1" :key="resetKey"></json-tree>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import JsonTree from 'vue-json-tree';
import { Prop, Watch } from 'vue-property-decorator';
import { CustomParser } from '@/parser/util';

@Options({
  components: {
    JsonTree,
  },
})
export default class ParserView extends Vue {
  inputText = '';
  inputType = 'dec';
  results: any = { error: 'no input' };
  resetKey = 1;

  @Prop({ type: Function })
  getParser!: () => CustomParser;

  mounted() {
    console.log(this.getParser().getCode());
    this.startParse();
  }

  addQuery() {
    this.$router.push({
      query: { text: this.inputText, type: this.inputType },
    });
  }

  startParse() {
    this.inputText = this.$route.query.text ? '' + this.$route.query.text : '';
    this.inputType = this.$route.query.type
      ? '' + this.$route.query.type
      : 'hex';
    try {
      const dataArray = this.getInputDataArray();
      if (dataArray.length === 0) {
        this.results = { error: 'no input' };
        return;
      }
      this.results = this.getParser().parse(Buffer.from(dataArray));
      this.resetKey++;
    } catch (e) {
      console.error(e);
      this.results = { error: e.message, e };
    }
  }

  getInputDataArray() {
    const dataString = this.$route.query.text
      ? '' + this.$route.query.text
      : '';
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

  @Watch('$route')
  routeChange(from: any, to: any) {
    this.startParse();
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
