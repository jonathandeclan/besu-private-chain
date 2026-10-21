export function getBase64PublicKeyInHex(publicKey: string): string {
  const keyWithoutAlgorithmIdentifier = publicKey.length == 120 ? publicKey.substring(32) : publicKey;
  return Buffer.from(keyWithoutAlgorithmIdentifier, 'base64').toString('hex');
}

/**
 * Remove the launching node from list of static nodes.
 * The element in the list that contains the enode of the launching node will be removed
 */
export function getStaticNodesWithLaunchingNodeRemoved(publicKeyInHex: string, staticNodes: string): string {
  const eNodeRegex = `"enode:\\/\\/${publicKeyInHex}.*?"`;
  const eNodeRegexFollowingComma = new RegExp(`${eNodeRegex},`);
  const eNodeRegexWithPrecedingComma = new RegExp(`,${eNodeRegex}`);
  return eNodeRegexFollowingComma.test(staticNodes)
    ? staticNodes.replace(eNodeRegexFollowingComma, '')
    : staticNodes.replace(eNodeRegexWithPrecedingComma, '');
}
