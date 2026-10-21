# Private Besu Blockchain Network

A Hyperledger Besu QBFT blockchain deployed on AWS and exposed to consumers only through PrivateLink.

## Language

**Private Besu Blockchain Network**:
The whole deployed system: the QBFT chain, its nodes, and the private endpoint through which clients reach it.
_Avoid_: Private chain, private blockchain, node runner, Besu fleet

**Validator**:
A stable block-producing identity: one signing key plus its index. It outlives any host that runs it.
_Avoid_: Validator node, validator instance

**Instance**:
An AWS EC2 instance that currently holds a Validator. Instances are transient; replacing one does not change the Validator.
_Avoid_: Node, host

**Read Node**:
A planned non-validating Besu node with no Validator Key that serves RPC reads. Only its health-check script exists today; no fleet is deployed.
_Avoid_: Observer, RPC node, full node

**Network ID**:
The Besu network ID of a Private Besu Blockchain Network (default 707073). It appears in DNS zones, resource names and key names. Only one Private Besu Blockchain Network fits per account and region, because some export names and the KMS key alias are fixed. Set with `NETWORK_ID`.
_Avoid_: Shard, shard ID, chain ID

**Static Nodes File**:
The `static-nodes.json` list of Validator enode addresses (by DNS name) that each Instance dials. Peer discovery is disabled, so this is the only way Validators find each other.
_Avoid_: Bootnodes, boot nodes

## Validator keys

**Validator Key**:
The ECC key pair that gives a Validator its identity, with a numeric index. Private key in Secrets Manager, public key in `lib/constants/keys.ts`, status tracked in the validator-info table.
_Avoid_: Signing key, key pair

**Claim**:
An Instance taking an available Validator Key on launch, becoming the host of that Validator. Keys are preferred in the Instance's availability zone, because each key's data volume is bound to a zone.
_Avoid_: Assign, acquire

**Release**:
An Instance giving its Validator Key back on termination, making the Validator available for the next Instance.
_Avoid_: Detach, free

**Inactive Key**:
A Validator Key retired when it is removed from the deployment. It is never claimed again.
_Avoid_: Deleted key
