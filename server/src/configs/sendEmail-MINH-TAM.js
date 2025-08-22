import nodemailer from 'nodemailer';
import { env } from '../configs/environment.js';

const sendEmail = async (data, req, res) => {
	const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			// TODO: replace `user` and `pass` values from <https://forwardemail.net>
			user: env.MAIL_ID,
			pass: env.MAIL_PW,
		},
	});

	// async..await is not allowed in global scope, must use a wrapper
	async function main() {
		// send mail with defined transport object
		const info = await transporter.sendMail({
			from: 'E-Technology <abc@gmail.com>', // sender address
			to: data.to, // list of receivers
			subject: data.subject, // Subject line
			text: data.text, // plain text body
			html: data.html, // html body
			attachments: data.attachments || [], // hỗ trợ đính kèm file
		});
	}

	main().catch(console.error);
};

export default sendEmail;
