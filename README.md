# AWS Lambda CPU Allocation Benchmark

## Introduction

This project uses AWS CDK to deploy and test CPU allocation across various memory configurations in AWS Lambda. The goal is to understand how CPU power scales with memory allocation, providing insights for optimizing Lambda function configurations.

## Project Structure

- `lib/lambda-cpu-test-stack.ts`: CDK stack definition
- `lambda/index.js`: Lambda function for CPU benchmarking
- `lambda/invoker.js`: Lambda function for invoking test functions

## Setup and Deployment

1. Install dependencies:
```console
npm install
```

2. Deploy the stack:
```console
cdk deploy --all
```

3. Invoke the test using the Function URL provided in the CDK output.

## Benchmark Details

The benchmark performs three CPU-intensive tasks:
1. Prime number calculation
2. Matrix multiplication
3. Pi calculation
4. SHA256 calculation

These tasks run for 10 seconds on Lambda functions with memory allocations ranging from 256MB to 10240MB.

## Interpreting Results

The output includes:
- `memorySize`: Allocated memory in MB
- `executionTime`: Actual execution time (should be close to 10 seconds)
- `primeCount`: Number of prime numbers found
- `matrixOperations`: Number of matrix multiplications performed
- `piCalculations`: Number of Pi calculations  performed
- `hashOperations`: Number of SHA256 hash operations performed
- `totalOperations`: Sum of all operations
- `operationsPerMB`: Total operations divided by memory size

## Key Findings

1. Linear scaling from 256MB to 1024MB
2. Performance shift around 1280MB-1792MB
3. Diminishing returns beyond 1792MB
4. Inconsistent performance spikes at higher memory allocations

## Conclusion

This benchmark reveals that the relationship between Lambda memory allocation and CPU performance is not strictly linear. There's a sweet spot for performance/cost ratio around 1024MB to 1792MB. Beyond this, increases in memory don't always correspond to proportional increases in CPU power.

For optimal performance and cost-effectiveness:
1. Target the 1024MB to 1792MB range for most functions
2. Consider specific "spike" points (e.g., 3840MB, 6144MB) for high-performance needs
3. Be cautious about allocating more than 4096MB unless the extra memory is specifically required

Remember that these results may vary based on specific workloads and could change as AWS updates its infrastructure. Always benchmark with your actual application code for the most accurate results.

## Contributing

Contributions to improve the benchmark or expand its scope are welcome. Please submit a pull request or open an issue to discuss proposed changes.

## License

[MIT License](LICENSE)