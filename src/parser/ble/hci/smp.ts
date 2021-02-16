import { CustomParser, getDefaultParser, getNestParser } from '@/parser/util';

export const smpParser = getDefaultParser(parser => {
  parser.enum('opCode', 'uint8', {
    list: {
      0x01: { meaning: 'PAIRING_REQUEST' },
      0x02: { meaning: 'PAIRING_RESPONSE' },
      0x03: { meaning: 'PAIRING_CONFIRM' },
      0x04: { meaning: 'PAIRING_RANDOM' },
      0x05: { meaning: 'PAIRING_FAILED' },
      0x06: { meaning: 'ENCRYPT_INFO' },
      0x07: { meaning: 'MASTER_IDENT' },
      0x0b: { meaning: 'SMP_SECURITY_REQUEST' },
    },
  });
});
