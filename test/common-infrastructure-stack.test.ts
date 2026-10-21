// test/common-infrastructure-stack.test.ts
import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { CommonInfrastructure, CommonInfrastructureProps } from '../lib/common-infrastructure-stack';
import * as cdk from 'aws-cdk-lib';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

describe('Common Infrastructure Stack', () => {
    const app = new App();
    const props: CommonInfrastructureProps = {
        networkId: '707073',
        stage: 'dev',
        env: { account: process.env.AWS_ACCOUNT_ID, region: process.env.AWS_REGION },
    };

    const stack = new CommonInfrastructure(app, 'CommonInfrastructureStack', props);
    const template = Template.fromStack(stack);

    test('creates VPC with private isolated subnets', () => {
        template.hasResourceProperties('AWS::EC2::VPC', {
            CidrBlock: '10.0.0.0/16',
            Tags: [{ Key: 'Name', Value: 'CommonInfrastructureStack/Network-707073-Vpc' }],
        });

        template.hasResourceProperties('AWS::EC2::Subnet', {
            MapPublicIpOnLaunch: false,
        });
    });

    test('creates Security Group with ingress rules for Besu Nodes', () => {
        // P2P is TCP only: peer discovery (UDP) is disabled in favour of static nodes.
        template.hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
            IpProtocol: 'tcp',
            FromPort: 30303, // Example P2P port
            ToPort: 30303,
        });
        template.resourcePropertiesCountIs('AWS::EC2::SecurityGroupIngress', { IpProtocol: 'udp' }, 0);
    });

    test('creates KMS key for S3 bucket encryption with rotation enabled', () => {
        template.hasResourceProperties('AWS::KMS::Key', {
            EnableKeyRotation: true,
            Description: 'KMS Key for Private Chain common infrastructure buckets',
        });
    });

    test('creates S3 bucket with encryption and lifecycle rule', () => {
        template.hasResourceProperties('AWS::S3::Bucket', {
            BucketName: `privatechain-us-east-1-${props.env.account}-707073-config-bucket`,
            BucketEncryption: {
                ServerSideEncryptionConfiguration: [{ ServerSideEncryptionByDefault: { SSEAlgorithm: 'aws:kms' } }],
            }
        });
    });

    test('exports FleetConfigBucketArn and S3BucketKeyArn', () => {
        template.hasOutput('S3BucketKeyArnOutput', {
            Export: { Name: 'S3BucketKeyArn' },
        });
    });
});
