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

const oneAdPaser = getDefaultParser(parser => {
  parser
    .uint8('length')
    .uint8('type')
    .meaning('typeString', {
      tag: 'type',
      meanings: {
        1: 'Flags',
      },
    })
    .choice({
      tag: 'type',
      choices: {
        1: advFlags,
      },
      defaultChoice: getNestParser(p => {
        p.array('data', {
          length: function() {
            // @ts-ignore
            return this.length - 1;
          },
          type: 'uint8',
        });
      }),
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
