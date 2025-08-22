import mongoose from 'mongoose';
import { env } from '../configs/environment.js';

if (!env.MONGODB_URI) {
	console.error('MongoDB URI is missing!');
	process.exit(1);
}

const connectDB = async () => {
	try {
		await mongoose.connect(env.MONGODB_URI);
		console.log('✅ Connect to the database successfully!');
	} catch (error) {
		console.error('❌ Cannot connect to the database!', error.message);
		process.exit(1);
	}
};

export default connectDB;
