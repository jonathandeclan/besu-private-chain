// Constants for infrastructure resource name

export const ResourceName = {
  Table: {
    ValidatorKeys: 'BesuValidatorKeys',
    ReadNode: 'BesuReadNodes',
  },
  // Secrets Manager
  SM: {
    KeyNamePrefix: 'ValidatorSignKey',
    KeyConstructPrefix: 'ValidatorSigningKeyConstruct',
    KeySigningRolePrefix: 'ValidatorEC2Role',
  },
  EC2: {
    ValidatorInstanceProfilePrefix: 'ValidatorInstanceProfile',
  },
  Lambda: {
    LifecycleHookName: 'LifecycleHook',
    GenesisGeneratorLambda: 'GenesisArtifactLambda',
    StaticNodesArtifactGeneratorLambda: 'StaticNodesArtifactLambda',
    PublicKeyLambda: 'PublicKeyFetcherLambda',
  },
  PrivateHostedZone: {
    // TODO : Make configurable.
    ZoneName: 'privatechain.internaldns.aws.org',
  },
  LaunchTemplate: {
    Name: 'validator-launch-config',
  },
  ASG: {
    Validators: 'validator-fleet-asg',
    GroupNameTagKey: 'aws:autoscaling:groupName',
    NameTagKey: 'Name',
    // TODO : Remove the need for this. This is here because signaling needs to know the asg logical id.
    ValidatorASGLogicalId: 'validatorasg123',
  },
  Cloudwatch: {
    PipelineRollbackTag: 'PipelineRollbackAlarm',
  },
};

export function getAutoscalingGroupName(networkId: string) {
  return `network-${networkId}-${ResourceName.ASG.Validators}`;
}

export function getValidatorHostName(networkId: string, valKeyNum: number) {
  return `val${valKeyNum}.${getNetworkZoneName(networkId)}`;
}

export function getNetworkZoneName(networkId: string) {
  return `ch${networkId}.${ResourceName.PrivateHostedZone.ZoneName}`;
}

export function getValidatorClusterName(networkId: string) {
  return `Network${networkId}-ValidatorCluster`;
}

export function getValidatorFleetClusterName(networkId: string) {
  return `Network${networkId}-ValidatorFleetCluster`;
}
