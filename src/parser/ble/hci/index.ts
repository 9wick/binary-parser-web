import { getDefaultParser, getNestParser } from '@/parser/util';
import { BleAdvertisementParser } from '@/parser/ble/adv';
import { attParser } from '@/parser/ble/hci/att';

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
      6: { meaning: 'SMP' },
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

export const BleHciParser = getDefaultParser(parser => {
  parser.endianess('little').enum('evnetType', 'uint8', {
    list: {
      2: { meaning: 'HCI_ACLDATA_PKT', choice: onHciAclDataParser },
      4: { meaning: 'HCI_EVENT_PKT', choice: BleAdvertisementParser },
    },
  });
  // .meaning('typeMeaning', { tag: 'type', meanings: { 1: 'adv' } })
  // .choice('data', { tag: 'type', choices: { 1: BleAdvertisementParser } });
});
