import RLP from 'rlp';
import { encodeQbftExtraData } from '../lib/helper/genesis-helper';

describe('encodeQbftExtraData', () => {
  const validators = ['0x' + '11'.repeat(20), '0x' + '22'.repeat(20)];

  test('encodes the vote as an empty list and the round as an empty int', () => {
    // c0 = empty vote list, 80 = round 0, c0 = no seals
    expect(encodeQbftExtraData(validators).endsWith('c080c0')).toBe(true);
  });

  test('round trips to [vanity, validators, vote, round, seals]', () => {
    const decoded = RLP.decode(Buffer.from(encodeQbftExtraData(validators).slice(2), 'hex')) as any[];
    expect(decoded).toHaveLength(5);
    expect(decoded[0]).toHaveLength(32);
    expect(decoded[1].map((v: Uint8Array) => '0x' + Buffer.from(v).toString('hex'))).toEqual(validators);
    expect(decoded[2]).toEqual([]);
    expect(decoded[3]).toHaveLength(0);
    expect(decoded[4]).toEqual([]);
  });
});
