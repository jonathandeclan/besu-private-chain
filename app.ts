#!/usr/bin/env node
import 'dotenv/config'
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import * as nag from "cdk-nag";
import { ArnPrincipal } from 'aws-cdk-lib/aws-iam';

import { CommonInfrastructure } from "./lib/common-infrastructure-stack";
import { ValidatorFleetInfrastructure, ValidatorFleetInfrastructureProps } from "./lib/validator-fleet-stack";

const app = new cdk.App();
cdk.Tags.of(app).add("Application", "BesuPrivateNetwork");

if (process.env.AWS_ACCOUNT_ID) {
    const stage = process.env.STAGE ?? 'dev';
    const stackEnv = {
        region: process.env.AWS_REGION ?? 'us-east-1',
        account: process.env.AWS_ACCOUNT_ID
    };
    const devCommonInfraStack = new CommonInfrastructure(
        app,
        `PrivateChain-${stage}-${CommonInfrastructure.STACK_NAME}`,
        {
            networkId: process.env.NETWORK_ID ?? '707073',
            stage,
            env: stackEnv
        },
    );
    const devValidatorFleetInfraProps: ValidatorFleetInfrastructureProps = {
        stage,
        networkId: process.env.NETWORK_ID ?? '707073',
        allowedPrincipals: [new ArnPrincipal(`arn:aws:iam::${stackEnv.account}:root`)],
        imageProviderAccount: stackEnv.account,
        fleetVpc: devCommonInfraStack.getFleetVpc(),
        fleetSecurityGroup: devCommonInfraStack.getFleetSecurityGroup(),
        fleetConfigBucket: devCommonInfraStack.getFleetConfigBucket(),
        env: stackEnv
    };

    const devValidatorFleetStack = new ValidatorFleetInfrastructure(
        app,
        `PrivateChain-${stage}-${ValidatorFleetInfrastructure.STACK_NAME}`,
        devValidatorFleetInfraProps,
    );
} else {
    console.error("Set AWS_ACCOUNT_ID in your env to deploy the prototype.");
}

// TODO : Enable Nag and fix all nag issues.

cdk.Aspects.of(app).add(
    new nag.AwsSolutionsChecks({
        verbose: false,
        reports: true,
        logIgnores: false,
    })
);

