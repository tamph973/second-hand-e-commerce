import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
dotenv.config();

class JWTService {
	constructor() {
		this.accessTokenExpiry = '30m';
		this.refreshTokenExpiry = '7d';
		this.jwtSecret = process.env.JWT_SECRET_KEY;
		if (!this.jwtSecret) {
			throw new Error('JWT_SECRET is not defined in environment variables');
		}
	}

	// Generate Access Token
	async generateAccessToken(id) {
		const accessToken = jwt.sign({ id, jit: uuidv4() }, this.jwtSecret, {
			expiresIn: this.accessTokenExpiry,
		});

		return accessToken;
	}

	// Generate Refresh Token & Save to DB
	async generateRefreshToken(id) {
		const refreshToken = jwt.sign({ id, jit: uuidv4() }, this.jwtSecret, {
			expiresIn: this.refreshTokenExpiry,
		});

		await userModel.updateOne({ _id: id }, { $set: { refresh_token: refreshToken } });

		return refreshToken;
	}

	async refreshTokenService(token) {
		try {
			const payload = jwt.verify(token, this.jwtSecret);
			const newAccessToken = await this.generateAccessToken(payload.id);
			return newAccessToken;
		} catch (error) {
			return { message: error.message || error };
		}
	}
}

export default new JWTService();
