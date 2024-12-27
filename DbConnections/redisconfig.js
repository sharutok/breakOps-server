const { createClient } = require("redis");


exports.redisConnect = async() => {
    const client = createClient({
        password: '|*15kVpmmw`[3^}^:O8B&&v/L>QE+7OY7c9?%`VRsAq{,Cyxw{', 
        socket: {
            host: 'localhost',
            port: 6379,
    }
});

client.on('error', (err) => console.log('Redis Client Error', err));
await client.connect();
return client
}