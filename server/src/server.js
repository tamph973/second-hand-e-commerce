import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './configs/connectDB.js';
import { APIs_V1 } from './routes/v1/index.js';
import { env } from '../src/configs/environment.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import {
	startReleaseEscrowJob,
	stopReleaseEscrowJob,
} from './jobs/releaseEscrow.job.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);

export const io = new Server(httpServer, {
	cors: {
		origin: env.FRONTEND_URL,
		methods: ['GET', 'POST'],
		credentials: true,
	},
});

app.use(
	cors({
		origin: env.FRONTEND_URL,
		credentials: true,
	}),
);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
	helmet({
		crossOriginResourcePolicy: false,
	}),
);

const PORT = env.SERVER_PORT || 8080;

app.use('/api/v1', APIs_V1);

connectDB();

io.on('connection', (socket) => {
	console.log('New client connected:', socket.id);

	// Join room theo userId
	socket.on('join-user-room', (userId) => {
		socket.join(`user-${userId}`);
		console.log(`User ${userId} joined their room`);
	});

	// Join room theo sellerId
	socket.on('join-seller-room', (sellerId) => {
		socket.join(`seller-${sellerId}`);
		console.log(`Seller ${sellerId} joined their room`);
	});

	socket.on('disconnect', () => {
		console.log('Client disconnected:', socket.id);
	});
});

// Hàm helper để gửi thông báo
export const sendNotification = (type, recipients, data) => {
	recipients.forEach((recipient) => {
		const room = `${type}-${recipient.toString()}`;
		io.to(room).emit('notification', {
			type,
			...data,
			timestamp: new Date().toISOString(),
		});
		console.log(`Sent to ${room}:`, data);
	});
};

httpServer.listen(PORT, () => {
	console.log(`✅ Server is running on port ${PORT}`);
	console.log('✅ Socket.io is ready');
});

// Middleware xử lý lỗi tập trung
app.use(errorMiddleware);

// Hàm dừng cron job khi server tắt
process.on('SIGTERM', () => {
	stopReleaseEscrowJob();
	app.close(() => {
		console.log('Server closed');
		process.exit(0);
	});
});

app.use('/', (req, res) => {
	res.send('Welcome to server side!!!');
});
