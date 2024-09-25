function isPrime(num) {
    for (let i = 2, s = Math.sqrt(num); i <= s; i++)
        if (num % i === 0) return false;
    return num > 1;
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

function calculatePi(iterations) {
    let pi = 0;
    let sign = 1;
    for (let i = 0; i < iterations; i++) {
        pi += sign / (2 * i + 1);
        sign *= -1;
    }
    return 4 * pi;
}

function sha256(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
}

exports.handler = async (event) => {
    const startTime = Date.now();
    const duration = 10000; // 10 seconds
    let primeCount = 0;
    let matrixOperations = 0;
    let piCalculations = 0;
    let hashOperations = 0;
    let number = 2;

    while (Date.now() - startTime < duration) {
        // Prime number calculation
        if (isPrime(number)) {
            primeCount++;
        }
        number++;

        // Matrix multiplication
        matrixMultiplication(50);
        matrixOperations++;

        // Pi calculation
        calculatePi(10000);
        piCalculations++;

        // Hash calculation (simulating SHA-256)
        sha256("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
        hashOperations++;
    }

    const totalOperations = primeCount + matrixOperations + piCalculations + hashOperations;
    const memorySize = parseInt(process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE);

    return {
        statusCode: 200,
        body: JSON.stringify({
            memorySize,
            executionTime: Date.now() - startTime,
            primeCount,
            matrixOperations,
            piCalculations,
            hashOperations,
            totalOperations,
            operationsPerMB: totalOperations / memorySize
        }),
    };
};