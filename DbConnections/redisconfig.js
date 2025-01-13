const { createClient } = require("redis");


// exports.redisConnect = async() => {
//     const client = createClient({
//         password: process.env.REDIS_PASSWORD, 
//         socket: {
//             host: process.env.REDIS_HOST,
//             port: process.env.REDIS_PORT,
//     }
// });

// client.on('error', (err) => console.log('Redis Client Error', err));
// await client.connect();
// return client
// }

let redisClient = null;

const getRedisClient = async () => {
    if (!redisClient) {
        redisClient = createClient({
            password: process.env.REDIS_PASSWORD,
            socket: {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
            }
        });

        // Add event listeners for connection management
        redisClient.on("error", (err) => console.error("Redis Client Error", err));
        redisClient.on("connect", () => console.log("Connected to Redis"));

        try {
            await redisClient.connect(); // Establish connection
        } catch (err) {
            console.error("Failed to connect to Redis:", err);
            throw err;
        }
    }
    return redisClient;
};

module.exports = { getRedisClient };
