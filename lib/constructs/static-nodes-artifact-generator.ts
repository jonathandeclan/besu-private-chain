import { Construct } from 'constructs';
import path = require('path');
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { ChainEventHandlerLambda } from './chain-event-handler-function';
import { ResourceName } from '../constants/resource-names';
import { ValidatorECCKeySet } from './validator-ecc-keyset';
import { PhysicalResourceId } from 'aws-cdk-lib/custom-resources';
import { getKeySetUniqueString } from '../helper/genesis-helper';
import { ChainArtifactWrapper } from './chain-artifact-wrapper';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

export interface StaticNodesArtifactGeneratorProps {
  readonly resourcePrefix: string;
  readonly serviceAccount: string;
  readonly region: string;
  readonly networkId: string;
  readonly configBucket: Bucket;
  readonly validatorKeySet: ValidatorECCKeySet;
  readonly version?: number;
}

export class StaticNodesArtifactGenerator extends Construct {
  readonly lambda: ChainEventHandlerLambda;

  constructor(scope: Construct, id: string, props: StaticNodesArtifactGeneratorProps) {
    super(scope, id);

    const funcName = `${props.resourcePrefix}-${ResourceName.Lambda.StaticNodesArtifactGeneratorLambda}-network-${props.networkId}`;
    const func = new ChainEventHandlerLambda(
      this,
      `${props.resourcePrefix}${ResourceName.Lambda.StaticNodesArtifactGeneratorLambda}`,
      {
        functionPath: path.join(__dirname, `../lambda-functions/static-nodes-artifact-generator-func.ts`),
        functionName: funcName,
        logicalId: `${props.resourcePrefix}${ResourceName.Lambda.StaticNodesArtifactGeneratorLambda}`,
        environment: {
          CONFIG_BUCKET: props.configBucket.bucketName,
          NETWORK_ID: props.networkId,
        },
        runtime: Runtime.NODEJS_LATEST,
      },
    );

    props.configBucket.grantReadWrite(func);

    func.node.addDependency(props.validatorKeySet);

    const keySet: Map<string, string> = props.validatorKeySet.getKeyNumToPublicKey();
    const resourceId = PhysicalResourceId.of(`Static-node-${getKeySetUniqueString(Array.from(keySet.keys()))}-v${props.version}`);

    const staticNodesArtifactWrapper = new ChainArtifactWrapper(this, resourceId.toString(), {
      resourceId: resourceId,
      creatorfuncArn: func.functionArn,
      requestPayload: {
        keySet: Object.fromEntries(keySet),
      },
    });

    staticNodesArtifactWrapper.chainArtifact.node.addDependency(func);
  }
}
