import { CustomParser, getDefaultParser, getNestParser } from '@/parser/util';

const AttErrorCodes = {
  0x01: { meaning: 'Invalid Handle' },
  0x02: { meaning: 'Read Not Permitted' },
  0x03: { meaning: 'Write Not Permitted' },
  0x04: { meaning: 'Invalid PDU' },
  0x05: { meaning: 'Insufficient Authentication' },
  0x06: { meaning: 'Request Not Supported' },
  0x07: { meaning: 'Invalid Offset' },
  0x08: { meaning: 'Insufficient Authorization' },
  0x09: { meaning: 'Prepare Queue Full' },
  0x0a: { meaning: 'Attribute Not Found' },
  0x0b: { meaning: 'Attribute Not Long' },
  0x0c: { meaning: 'Insufficient Encryption Key Size' },
  0x0d: { meaning: 'Invalid Attribute Value Length' },
  0x0e: { meaning: 'Unlikely Error' },
  0x0f: { meaning: 'Insufficient Encryption' },
  0x10: { meaning: 'Unsupported Group Type' },
  0x11: { meaning: 'Insufficient Resources' },
  0x12: { meaning: 'Database Out Of Sync' },
  0x13: { meaning: 'Value Not Allowed' },
};

const AttOpCodes = {
  0x01: {
    meaning: 'Error Response',
    choice: getNestParser(p => {
      p.uint8('erroredOpCode')
        .uint16le('handle')
        .uint8('errorCode')
        .meaning('errorCodeString', {
          tag: 'errorCode',
          meanings: CustomParser.list2meaning(AttErrorCodes),
        });
    }),
  },
  0x02: {
    meaning: 'Exchange MTU Request',
    choice: getNestParser(p => p.uint16le('client Rx mtu size')),
  },
  0x03: {
    meaning: 'Exchange MTU Response',
    choice: getNestParser(p => p.uint16le('server Rx mtu size')),
  },
  0x04: {
    meaning: 'Find Information Request',
    choice: getNestParser(p => p.uint16le('startHandle').uint16le('endHandle')),
  },
  0x05: {
    meaning: 'Find Information Response',
    choice: getDefaultParser(p =>
      p.enum('format', 'uint8', {
        list: {
          1: {
            meaning: '16bit uuid',
            choice: getNestParser(p2 => {
              p2.array('uuids', {
                type: getNestParser(p3 => {
                  p3.uint16le('handle').hex('uuid', {
                    length: 2,
                  });
                }),
                readUntil: 'eof',
              });
            }),
          },
          2: {
            meaning: '128bit uuid',
            choice: getNestParser(p2 => {
              p2.array('uuids', {
                type: getNestParser(p3 => {
                  p3.uint16le('handle').hex('uuid', {
                    length: 16,
                  });
                }),
                readUntil: 'eof',
              });
            }),
          },
        },
      })
    ),
  },
  0x06: {
    meaning: 'Find By Type Value Request',
    choice: getNestParser(p => p.uint16le('startHandle').uint16le('endHandle'))
      .uint16le('attributeType')
      .buffer('attributeValue', { readUntil: 'eof' }),
  },
  0x07: { meaning: 'Find By Type Value Response' },
  0x08: { meaning: 'Read By Type Request' },
  0x09: { meaning: 'Read By Type Response' },
  0x0a: { meaning: 'Read Request' },
  0x0b: { meaning: 'Read Response' },
  0x0c: { meaning: 'Read Blob Request' },
  0x0d: { meaning: 'Read Blob Response' },
  0x0e: { meaning: 'Read Multiple Request' },
  0x0f: { meaning: 'Read Multiple Response' },
  0x10: { meaning: 'Read by Group Type Request' },
  0x11: { meaning: 'Read by Group Type Response' },
  0x12: { meaning: 'Write Request' },
  0x13: { meaning: 'Write Response' },
  0x16: { meaning: 'Prepare Write Request' },
  0x17: { meaning: 'Prepare Write Response' },
  0x18: { meaning: 'Execute Write Request' },
  0x19: { meaning: 'Execute Write Response' },
  0x1b: { meaning: 'Handle Value Notification' },
  0x1d: { meaning: 'Handle Value Indication' },
  0x1e: { meaning: 'Handle Value Confirmation' },
  0x52: { meaning: 'Write command' },
  0xd2: { meaning: 'Signed Write command' },
};

export const attParser = getDefaultParser(parser => {
  parser.enum('opCode', 'uint8', {
    list: AttOpCodes,
  });
});
