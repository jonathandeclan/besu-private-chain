import RLP from 'rlp';

export function getKeySetUniqueString(keySet: string[]): string {
  return keySet.sort().join('-');
}

export function getGenesisFileName(keySet: string[]): string {
  return `genesis-${getKeySetUniqueString(keySet)}.json`;
}

export function getStaticNodesFileName(keySet: string[]): string {
  return `static-nodes-${getKeySetUniqueString(keySet)}.json`;
}

const QBFT_VANITY_FIELD = '0x0000000000000000000000000000000000000000000000000000000000000000';

/**
 * QBFT genesis extraData: RLP [vanity, validators, vote, round, seals] with an
 * empty vote list, round 0 and no seals. Unlike IBFT 2.0 (empty vote bytes and a
 * 4 byte round), Besu's QBFT parser requires the vote to be a list.
 */
export function encodeQbftExtraData(validatorAddresses: string[]): string {
  const encoded = RLP.encode([QBFT_VANITY_FIELD, validatorAddresses, [], '', []]);
  return '0x' + Buffer.from(encoded).toString('hex');
}
