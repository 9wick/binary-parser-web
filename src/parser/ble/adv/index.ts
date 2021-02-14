import { getDefaultParser, getNestParser } from '@/parser/util';

const advFlags = getNestParser(parser => {
  parser
    //上位ビットから
    .bit3('BIT6-8_Reserved')
    .bit1('BIT5_Simultaneous_LE_and_BR_ERD_to_Same_Device_Capable_Host')
    .bit1('BIT4_Simultaneous_LE_and_BR_ERD_to_Same_Device_Capable_Controller')
    .bit1('BIT3_BR_EDR_Not_Supported')
    .bit1('BIT2_LE_General_Discoverable_Mode')
    .bit1('BIT1_LE_Limited_Discoverable_Mode');
});

const advUuid16 = getNestParser(parser => {
  parser.array('uuids', {
    type: getNestParser(p => {
      p.string('uuid', { length: 2, encoding: 'hex' });
    }),
    length: function() {
      // @ts-ignore
      return (this.length - 1) / 2;
    },
  });
});

const advUuid32 = getNestParser(parser => {
  parser.array('uuids', {
    type: getNestParser(p => {
      p.string('uuid', { length: 4, encoding: 'hex' });
    }),
    length: function() {
      // @ts-ignore
      return (this.length - 1) / 4;
    },
  });
});

const advLocalName = getNestParser(parser => {
  parser.string('localName', {
    length: function() {
      // @ts-ignore
      return this.length - 1;
    },
  });
});

const advDefault = getNestParser(parser => {
  parser.array('data', {
    type: 'uint8',
    length: function() {
      // @ts-ignore
      return this.length - 1;
    },
  });
});

const oneAdPaser = getDefaultParser(parser => {
  parser.uint8('length').enum('type', 'uint8', {
    list: {
      1: { meaning: 'Flags', choice: advFlags },
      2: { meaning: 'UUID 16bit(Incomplete)' },
      3: { meaning: 'UUID 16bit(Complete)' },
      4: { meaning: 'UUID 32bit(Incomplete)' },
      5: { meaning: 'UUID 32bit(Complete)' },
      6: { meaning: 'UUID 128bit(Incomplete)' },
      7: { meaning: 'UUID 128bit(Complete)' },
      8: { meaning: 'Shortened Local Name', choice: advLocalName },
      9: { meaning: 'Complete Local Name', choice: advLocalName },
      0x0a: { meaning: 'Tx Power Level' },
      0xff: { meaning: 'Manufacture data' },
    },
    defaultChoice: advDefault,
    nest: false,
  });
});

export const BleAdvertisementParser = getDefaultParser(parser => {
  parser.endianess('little').array('adv', {
    type: oneAdPaser,
    readUntil: function(item, subArray) {
      // @ts-ignore
      return subArray.length === 0;
    },
  });
});
