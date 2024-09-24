function isPrime(num) {
    for(let i = 2, s = Math.sqrt(num); i <= s; i++)
        if(num % i === 0) return false; 
    return num > 1;
}

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

function matrixMultiplication(size) {
    const a = Array(size).fill().map(() => Array(size).fill(1));
    const b = Array(size).fill().map(() => Array(size).fill(2));
    const result = Array(size).fill().map(() => Array(size).fill(0));

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            for (let k = 0; k < size; k++) {
                result[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    return result;
}

exports.handler = async (event) => {
    const startTime = Date.now();
    const duration = 10000; // 10 seconds
    let primeCount = 0;
    let fibonacciCount = 0;
    let matrixOps = 0;
    let number = 2;

    while (Date.now() - startTime < duration) {
        // Prime number calculation
        if (isPrime(number)) {
            primeCount++;
        }
        number++;

        // Fibonacci calculation
        fibonacci(20);
        fibonacciCount++;

        // Matrix multiplication
        matrixMultiplication(50);
        matrixOps++;
    }

    const totalOps = primeCount + fibonacciCount + matrixOps;
    const memorySize = parseInt(process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE);

    return {
        statusCode: 200,
        body: JSON.stringify({
            memorySize: memorySize,
            executionTime: Date.now() - startTime,
            primeCount: primeCount,
            fibonacciCount: fibonacciCount,
            matrixOperations: matrixOps,
            totalOperations: totalOps,
            operationsPerMB: totalOps / memorySize
        }),
    };
};