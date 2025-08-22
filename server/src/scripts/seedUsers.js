import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import UserModel from '../models/user.model.js';
import { connectDB } from '../configs/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedUsers() {
	try {
		// Connect to database
		await connectDB();

		// Read sample data
		const sampleData = JSON.parse(
			fs.readFileSync(
				path.join(__dirname, '../../data/sample-users.json'),
				'utf-8',
			),
		);

		// Hash passwords
		const users = await Promise.all(
			sampleData.users.map(async (user) => {
				const salt = await bcrypt.genSalt(10);
				const hashedPassword = await bcrypt.hash(user.password, salt);
				return {
					...user,
					password: hashedPassword,
				};
			}),
		);

		// Clear existing users
		await UserModel.deleteMany({});

		// Insert new users
		const result = await UserModel.insertMany(users);

		console.log(`Successfully seeded ${result.length} users`);
		console.log('Sample users created:');
		result.forEach((user) => {
			console.log(`- ${user.firstName} ${user.lastName} (${user.email})`);
		});

		process.exit(0);
	} catch (error) {
		console.error('Error seeding users:', error);
		process.exit(1);
	}
}

// Run the seeder
seedUsers();
