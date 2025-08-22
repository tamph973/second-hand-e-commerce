import Redis from 'ioredis';
import { env } from '../configs/environment.js';

const redisClient = new Redis({
	host: env.REDIS_HOST || '127.0.0.1', // Địa chỉ Redis (nếu local thì giữ nguyên)
	port: env.REDIS_PORT || 6379, // Cổng mặc định
	password: env.REDIS_PASSWORD || '', // Nếu Redis có password, thêm vào đây
});

redisClient.on('connect', () => {
	console.log('✅ Connected to Redis');
});

redisClient.on('error', (err) => {
	console.error('❌ Redis Error:', err);
});

export default redisClient;
