const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");
const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");

const lambdaClient = new LambdaClient();
const ssmClient = new SSMClient();

async function getParameter(name) {
  const command = new GetParameterCommand({ Name: name });
  const response = await ssmClient.send(command);
  return response.Parameter.Value;
}

exports.handler = async (event) => {
  // Get the list of memory sizes
  const memorySizes = (await getParameter('/lambda-cpu-test/memory-sizes')).split(',');
  const results = [];

  for (const memorySize of memorySizes) {
    // Get the function ARN for this memory size
    const arnParameterName = `/lambda-cpu-test/function-arn-${memorySize}`;
    const arn = await getParameter(arnParameterName);

    try {
      const command = new InvokeCommand({
        FunctionName: arn,
        InvocationType: 'RequestResponse',
      });
      const response = await lambdaClient.send(command);

      // Convert the Uint8Array to a string, then parse it
      const payload = Buffer.from(response.Payload).toString();
      const result = JSON.parse(JSON.parse(payload).body);
      results.push(result);
    } catch (error) {
      console.error(`Error invoking function with ${memorySize}MB:`, error);
    }
  }

  // Sort results by memory size
  results.sort((a, b) => parseInt(a.memorySize) - parseInt(b.memorySize));

  return {
    statusCode: 200,
    body: JSON.stringify(results, null, 2),
  };
};