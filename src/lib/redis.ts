import { createClient, RedisClientType } from 'redis';

const redisClient: RedisClientType = createClient({
    password: process.env.REDIS_PASSWORD || 'gSB6uMiQ9zZWIycJln4z2XzDl6Pwcm5C',
    socket: {
        host: process.env.REDIS_HOST || 'redis-12408.c337.australia-southeast1-1.gce.redns.redis-cloud.com',
        port: parseInt(process.env.REDIS_PORT || '12408')
    }
});

redisClient.on('error', (err: Error) => {
    console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
    console.log('Redis Client Connected');
});

export const connectRedis = async (): Promise<RedisClientType> => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
    return redisClient;
};

export const getRedisClient = async (): Promise<RedisClientType> => {
    if (!redisClient.isOpen) {
        await connectRedis();
    }
    return redisClient;
};

export default redisClient;
