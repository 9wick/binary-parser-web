import { getDefaultParser, getNestParser } from '@/parser/util';
import { BleAdvertisementParser } from '@/parser/ble/adv';
import { attParser } from '@/parser/ble/hci/att';
import { smpParser } from '@/parser/ble/hci/smp';

const HciErrorCodes = {
  0x00: { meaning: 'Success' },
  0x01: { meaning: 'Unknown HCI Command' },
  0x02: { meaning: 'Unknown Connection Identifier' },
  0x03: { meaning: 'Hardware Failure' },
  0x04: { meaning: 'Page Timeout' },
  0x05: { meaning: 'Authentication Failure' },
  0x06: { meaning: 'PIN or Key Missing' },
  0x07: { meaning: 'Memory Capacity Exceeded' },
  0x08: { meaning: 'Connection Timeout' },
  0x09: { meaning: 'Connection Limit Exceeded' },
  0x0a: { meaning: 'Synchronous Connection Limit To A Device Exceeded' },
  0x0b: { meaning: 'Connection Already Exists' },
  0x0c: { meaning: 'Command Disallowed' },
  0x0d: { meaning: 'Connection Rejected due to Limited Resources' },
  0x0e: { meaning: 'Connection Rejected Due To Security Reasons' },
  0x0f: { meaning: 'Connection Rejected due to Unacceptable BD_ADDR' },
  0x10: { meaning: 'Connection Accept Timeout Exceeded' },
  0x11: { meaning: 'Unsupported Feature or Parameter Value' },
  0x12: { meaning: 'Invalid HCI Command Parameters' },
  0x13: { meaning: 'Remote User Terminated Connection' },
  0x14: {
    meaning: 'Remote Device Terminated Connection due to Low Resources ',
  },
  0x15: { meaning: 'Remote Device Terminated Connection due to Power Off' },
  0x16: { meaning: 'Connection Terminated By Local Host' },
  0x17: { meaning: 'Repeated Attempts' },
  0x18: { meaning: 'Pairing Not Allowed' },
  0x19: { meaning: 'Unknown LMP PDU' },
  0x1a: { meaning: 'Unsupported Remote Feature / Unsupported LMP Feature' },
  0x1b: { meaning: 'SCO Offset Rejected' },
  0x1c: { meaning: 'SCO Interval Rejected' },
  0x1d: { meaning: 'SCO Air Mode Rejected' },
  0x1e: { meaning: 'Invalid LMP Parameters / Invalid LL Parameters' },
  0x1f: { meaning: 'Unspecified Error' },
  0x20: {
    meaning:
      'Unsupported LMP Parameter Value / Unsupported LL Parameter Value ',
  },
  0x21: { meaning: 'Role Change Not Allowed' },
  0x22: { meaning: 'LMP Response Timeout / LL Response Timeout' },
  0x23: {
    meaning: 'LMP Error Transaction Collision / LL Procedure Collision ',
  },
  0x24: { meaning: 'LMP PDU Not Allowed' },
  0x25: { meaning: 'Encryption Mode Not Acceptable' },
  0x26: { meaning: 'Link Key cannot be Changed' },
  0x27: { meaning: 'Requested QoS Not Supported' },
  0x28: { meaning: 'Instant Passed' },
  0x29: { meaning: 'Pairing With Unit Key Not Supported' },
  0x2a: { meaning: 'Different Transaction Collision' },
  0x2b: { meaning: 'Reserved for future use' },
  0x2c: { meaning: 'QoS Unacceptable Parameter' },
  0x2d: { meaning: 'QoS Rejected' },
  0x2e: { meaning: 'Channel Classification Not Supported' },
  0x2f: { meaning: 'Insufficient Security' },
  0x30: { meaning: 'Parameter Out Of Mandatory Range' },
  0x31: { meaning: 'Reserved for future use' },
  0x32: { meaning: 'Role Switch Pending' },
  0x33: { meaning: 'Reserved for future use' },
  0x34: { meaning: 'Reserved Slot Violation' },
  0x35: { meaning: 'Role Switch Failed' },
  0x36: { meaning: 'Extended Inquiry Response Too Large' },
  0x37: { meaning: 'Secure Simple Pairing Not Supported By Host' },
  0x38: { meaning: 'Host Busy - Pairing' },
  0x39: { meaning: 'Connection Rejected due to No Suitable Channel Found' },
  0x3a: { meaning: 'Controller Busy' },
  0x3b: { meaning: 'Unacceptable Connection Parameters' },
  0x3c: { meaning: 'Advertising Timeout' },
  0x3d: { meaning: 'Connection Terminated due to MIC Failure' },
  0x3e: {
    meaning: 'Connection Failed to be Established / Synchronization Timeout ',
  },
  0x3f: { meaning: 'MAC Connection Failed' },
  0x40: {
    meaning:
      'Coarse Clock Adjustment Rejected but Will Try to Adjust Using Clock Dragging ',
  },
  0x41: { meaning: 'Type0 Submap Not Defined' },
  0x42: { meaning: 'Unknown Advertising Identifier' },
  0x43: { meaning: 'Limit Reached' },
  0x44: { meaning: 'Operation Cancelled by Host' },
  0x45: { meaning: 'Packet Too Long' },
};

const aclStartParser = getDefaultParser(parser => {
  parser.uint16le('length').enum('cid', 'uint16le', {
    list: {
      6: { meaning: 'SMP', choice: smpParser },
      5: { meaning: 'SIGNALING' },
      4: { meaning: 'ATT', choice: attParser },
    },
  });
});

const onHciAclDataParser = getDefaultParser(parser => {
  parser
    .uint8('handle_l')
    .bit4('flags')
    .bit4('handle_h')
    .uint16le('length')
    .enum('flags', null, {
      list: {
        2: { meaning: 'ACL_START', choice: aclStartParser },
        1: { meaning: 'ACL_CONTINUE' },
        0: { meaning: 'ACL_START_NO_FLUSH', choice: aclStartParser },
      },
    });
});

const onHciLeEventParser = getDefaultParser(parser => {
  parser.enum('subEventCode', 'uint8', {
    list: {
      0x01: { meaning: 'LE Connection Complete' },
      0x02: { meaning: 'LE Advertising Report' },
      0x03: { meaning: 'LE Connection Update Complete' },
      0x04: { meaning: 'LE Read Remote Used Features Complete' },
      0x05: { meaning: 'LE Long Term Key Requested' },
      0x06: { meaning: 'LE Remote Connection Parameter Request' },
      0x07: { meaning: 'LE Data Length Change' },
      0x08: { meaning: 'LE Read Local P256 Public Key Complete' },
      0x09: { meaning: 'LE Generate DHKey Complete' },
      0x0a: { meaning: 'LE Enhanced Connection Complete' },
      0x0b: { meaning: 'LE Direct Advertising Report' },
    },
  });
});
const onHciEventParser = getDefaultParser(parser => {
  parser
    .uint8('eventCode')
    .uint8('length')
    .enum('eventCode', null, {
      list: {
        0x05: { meaning: 'Disconnection Complete' },
        0x08: { meaning: 'Encryption Change' },
        0x0c: { meaning: 'Read Remote Version Information Complete' },
        0x0e: { meaning: 'Command Complete' },
        0x0f: { meaning: 'Command Status' },
        0x10: { meaning: 'Hardware Error (optional)' },
        0x13: {
          meaning: 'Number Of Completed Packets',
          choice: getDefaultParser(p => {
            p.uint8('number of handle')
              .array('connection handles', {
                type: 'uint16le',
                length: function() {
                  // @ts-ignore
                  return this['number of handle'];
                },
              })
              .array('num of completed packets', {
                type: 'uint16le',
                length: function() {
                  // @ts-ignore
                  return this['number of handle'];
                },
              });
          }),
        },
        0x1a: { meaning: 'Data Buffer Overflow' },
        0x30: { meaning: 'Encryption Key Refresh Complete' },
        0x57: { meaning: 'Authenticated Payload Timeout Expired' },
        0x3e: { meaning: 'LE Events', choice: onHciLeEventParser },
      },
    });
});

const onHciCommandParser = getDefaultParser(parser => {
  parser
    .uint16le('opCode')
    .uint8('length')
    .enum('opCode', null, {
      list: {
        0x2001: { meaning: 'LE Set Event Mask' },
        0x2002: { meaning: 'LE Read Buffer Size' },
        0x2003: { meaning: 'LE Read Local Supported Features' },
        0x2005: { meaning: 'LE Set Random Address' },
        0x2006: { meaning: 'LE Set Advertising Parameters' },
        0x2007: { meaning: 'LE Read Advertising Channel TX Power' },
        0x2008: { meaning: 'LE Set Advertising Data' },
        0x2009: { meaning: 'LE Set Scan Response Data' },
        0x200a: { meaning: 'LE Set Advertise Enable' },
        0x200b: { meaning: 'LE Set Scan Parameters' },
        0x200c: { meaning: 'LE Set Scan Enable' },
        0x200d: { meaning: 'LE Create Connection' },
        0x200e: { meaning: 'LE Create Connection Cancel' },
        0x200f: { meaning: 'LE Read White List Size' },
        0x2010: { meaning: 'LE Clear White Lis' },
        0x2011: { meaning: 'LE Add Device To White List' },
        0x2012: { meaning: 'LE Remove Device From White List' },
        0x2013: { meaning: 'LE Connection Update' },
        0x2014: { meaning: 'LE Set Host Channel Classification' },
        0x2015: { meaning: 'LE Read Channel Map' },
        0x2016: { meaning: 'LE Read Remote Used Features' },
        0x2017: { meaning: 'LE Encrypt' },
        0x2018: { meaning: 'LE Rand' },
        0x2019: { meaning: 'LE Start Encryption' },
        0x201a: { meaning: 'LE Long Term Key Requested Reply' },
        0x201b: { meaning: 'LE Long Term Key Requested Negative Reply' },
        0x201c: { meaning: 'LE Read Supported States' },
        0x201d: { meaning: 'LE Receiver Test' },
        0x201e: { meaning: 'LE Transmitter Test' },
        0x201f: { meaning: 'LE Test End Command' },
        0x2020: { meaning: 'LE Remote Connection Parameter Request Reply' },
        0x2021: {
          meaning: 'LE Remote Connection Parameter Request Negative Reply',
        },
        0x2022: { meaning: 'LE Set Data Length' },
        0x2023: { meaning: 'LE Read Suggested Default Data Length' },
        0x2024: { meaning: 'LE Write Suggested Default Data Length' },
        0x2026: {
          meaning: 'LE Read Local P256 Public Key 37 0x2025 LE Generate DHKey',
        },
        0x2027: { meaning: 'LE Add Device to Resolving List' },
        0x2028: { meaning: 'LE Remove Device from Resolving List' },
        0x2029: { meaning: 'LE Clear Resolving List' },
        0x202a: { meaning: 'LE Read Resolving List Size' },
        0x202b: { meaning: 'LE Read Peer Resolvable Address' },
        0x202c: { meaning: 'LE Read Local Resolvable Address' },
        0x202d: { meaning: 'LE Set Address Resolution Enable' },
        0x202e: { meaning: 'LE Set Resolvable Private Address Timeout' },
        0x202f: { meaning: 'LE Read Maximum Data Length' },
        0x0406: { meaning: 'Disconnect' },
        0x041d: { meaning: 'Read Remote Version Information' },
        0x0c01: { meaning: 'Set Event Mask' },
        0x0c03: { meaning: 'Reset' },
        0x0c2d: { meaning: 'Read Transmit Power Level' },
        0x0c31: { meaning: 'Set Controller To Host Flow Control (optional)' },
        0x0c33: { meaning: 'Host Buffer Size (optional)' },
        0x0c35: { meaning: 'Host Number Of Completed Packets (optional)' },
        0x0c63: { meaning: 'Set Event Mask Page' },
        0x0c7b: { meaning: 'Read Authenticated Payload Timeout' },
        0x0c7c: { meaning: 'Write Authenticated Payload Timeout' },
        0x1001: { meaning: 'Read Local Version Information' },
        0x1002: { meaning: 'Read Local Supported Commands (optional)' },
        0x1003: { meaning: 'Read Local Supported Features' },
        0x1009: { meaning: 'Read BD_ADDR' },
        0x1405: { meaning: 'Read RSSI' },
      },
    });
});

export const BleHciParser = getDefaultParser(parser => {
  parser.endianess('little').enum('evnetType', 'uint8', {
    list: {
      1: { meaning: 'HCI_COMMAND_PKT', choice: onHciCommandParser },
      2: { meaning: 'HCI_ACLDATA_PKT', choice: onHciAclDataParser },
      4: { meaning: 'HCI_EVENT_PKT', choice: onHciEventParser },
    },
  });
  // .meaning('typeMeaning', { tag: 'type', meanings: { 1: 'adv' } })
  // .choice('data', { tag: 'type', choices: { 1: BleAdvertisementParser } });
});
