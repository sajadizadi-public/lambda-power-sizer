import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

export class LambdaCpuTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const testFunctions: lambda.Function[] = [];
    const memorySizes: number[] = [];
    
    // Create Lambda functions with different memory sizes
    for (let memorySize = 256; memorySize <= 10240; memorySize += 256) {
      const func = new lambda.Function(this, `TestFunction-${memorySize}MB`, {
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: 'index.handler',
        code: lambda.Code.fromAsset('lambda'),
        memorySize: memorySize,
        timeout: cdk.Duration.seconds(30),
        environment: {
          MEMORY_SIZE: memorySize.toString(),
        },
      });
      testFunctions.push(func);
      memorySizes.push(memorySize);

      // Store function ARN in SSM Parameter Store
      new ssm.StringParameter(this, `FunctionArn-${memorySize}MB`, {
        parameterName: `/lambda-cpu-test/function-arn-${memorySize}`,
        stringValue: func.functionArn,
      });
    }

    // Store memory sizes list in SSM Parameter Store
    new ssm.StringParameter(this, 'MemorySizesList', {
      parameterName: '/lambda-cpu-test/memory-sizes',
      stringValue: memorySizes.join(','),
    });

    // Create the invoker Lambda
    const invokerFunction = new lambda.Function(this, 'InvokerFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'invoker.handler',
      code: lambda.Code.fromAsset('lambda'),
      memorySize: 1024,
      timeout: cdk.Duration.minutes(10),
    });

    // Grant permissions to the invoker function
    invokerFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: ['lambda:InvokeFunction'],
      resources: testFunctions.map(f => f.functionArn),
    }));

    // Grant read access to SSM parameters
    invokerFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: ['ssm:GetParameter'],
      resources: [
        `arn:aws:ssm:${this.region}:${this.account}:parameter/lambda-cpu-test/*`,
      ],
    }));

    // Create a Function URL for the invoker
    const functionUrl = invokerFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });

    // Output the Function URL
    new cdk.CfnOutput(this, 'InvokerFunctionUrl', {
      value: functionUrl.url,
      description: 'URL for the Invoker Lambda Function',
    });
  }
}