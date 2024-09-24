import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { LambdaCpuTestStack } from '../lib/lambda-cpu-test-stack';

const app = new cdk.App();
new LambdaCpuTestStack(app, 'LambdaCpuTestStack');