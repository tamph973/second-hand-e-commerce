import { env } from './environment.js';
import twilio from 'twilio';

// Thay bằng thông tin của bạn
const accountSid = env.TWILIO_ACCOUNT_SID;
const authToken = env.TWILIO_AUTH_TOKEN;
const twilioNumber = env.TWILIO_FROM_NUMBER;

const client = twilio(accountSid, authToken);

// Send SMS
const sendSMS = async (phoneNumber, otp) => {
	try {
		const message = await client.messages.create({
			body: `Mã OTP xác thực 2EcoC của bạn là: ${otp}`,
			from: twilioNumber,
			to: phoneNumber,
		});
		return message.body;
	} catch (error) {
		console.error('Error sending SMS:', error);
		throw error;
	}
};

export default sendSMS;
