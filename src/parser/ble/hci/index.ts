import { getDefaultParser } from '@/parser/util';
import { BleAdvertisementParser } from '@/parser/ble/adv';

export const BleHciParser = getDefaultParser(parser => {
  parser
    .endianess('little')
    .uint8('type')
    .meaning('typeMeaning', { tag: 'type', meanings: { 1: 'adv' } })
    .choice('data', { tag: 'type', choices: { 1: BleAdvertisementParser } });
});
