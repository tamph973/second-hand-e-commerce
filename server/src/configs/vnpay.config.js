import { env } from './environment.js';
import { ignoreLogger, VNPay } from 'vnpay';

const vnpay = new VNPay({
	tmnCode: env.VNP_TMNCODE,
	secureSecret: env.VNP_HASH_SECRET,
	vnpayHost: env.VNP_HOST,
	testMode: true, // true: sandbox, false: production
	hashAlgorithm: 'SHA512',
	enableLog: true,
	loggerFn: ignoreLogger,
});

export default vnpay;

/*
queryDrAndRefundHost: 'https://sandbox.vnpayment.vn', // tùy chọn, trường hợp khi url của querydr và refund khác với url khởi tạo thanh toán (thường sẽ sử dụng cho production)
*/
