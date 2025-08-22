import PaymentModel from '../models/payment.model.js';
import moment from 'moment';
import { ProductCode, VnpLocale } from 'vnpay/enums';
import vnpay from '../configs/vnpay.config.js';
import { env } from '../configs/environment.js';
import Errors from '../common/response/error.response.js';
import OrderModel from '../models/order.model.js';
import crypto from 'crypto';
import https from 'https';
import { removeItemsFromCart } from './cart.service.js';
import UserModel from '../models/user.model.js';
import ProductModel from '../models/product.model.js';
import axios from 'axios';

export const vnpayPayment = async (buyerId, paymentData) => {
	const { orderIds, totalAmount } = paymentData;

	// Lấy tất cả đơn hàng
	const orders = await OrderModel.find({
		_id: { $in: orderIds },
		buyer: buyerId,
	});

	if (orders.length === 0) {
		throw new Errors.NotFoundError('Không tìm thấy đơn hàng');
	}
	const vnpayParams = {
		vnp_Amount: totalAmount, // VNPay yêu cầu số tiền * 100
		vnp_IpAddr: '127.0.0.1',
		vnp_TxnRef: orders[0].paymentId.toString(), // Mã giao dịch duy nhất
		vnp_OrderInfo: `Thanh toán ${orders.length} đơn hàng`,
		vnp_OrderType: ProductCode.Other,
		vnp_ReturnUrl: env.VNP_RETURN_URL,
		vnp_Locale: VnpLocale.VN,
		vnp_CreateDate: moment().format('YYYYMMDDHHmmss'),
		vnp_ExpireDate: moment().add(15, 'minutes').format('YYYYMMDDHHmmss'), // Hết hạn sau 15 phút
	};

	const paymentUrl = await vnpay.buildPaymentUrl(vnpayParams);
	return { paymentUrl, paymentId: orders[0].paymentId };
};

export const handleVNPayReturn = async (vnp_Params) => {
	const { vnp_TxnRef, vnp_ResponseCode, vnp_TransactionNo } = vnp_Params;

	// Kiểm tra checksum (security)
	const isValid = vnpay.verifyIpnCall(vnp_Params);
	if (!isValid) throw new Error('Invalid IPN checksum');

	const payment = await PaymentModel.findOne({ _id: vnp_TxnRef });
	if (!payment) {
		throw new Errors.NotFoundError('Không tìm thấy thanh toán');
	}

	// Cập nhật trạng thái thanh toán
	if (vnp_ResponseCode === '00') {
		payment.paymentHistory.push({
			date: new Date(),
			amount: payment.totalAmount,
			paymentMethod: 'VNPAY',
			transactionId: vnp_TransactionNo,
			note: 'Thanh toán thành công với VNPAY',
		});

		// Cập nhật trạng thái thanh toán cho tất cả đơn hàng
		// Và cập nhật trạng thái đơn hàng
		if (payment.orderIds && payment.orderIds.length > 0) {
			payment.status = 'PAID';

			// Cập nhật trạng thái đơn hàng
			await OrderModel.updateMany(
				{ _id: { $in: payment.orderIds } },
				{ status: 'CONFIRMED' },
			);

			// Lấy tất cả đơn hàng để xóa sản phẩm khỏi giỏ hàng
			const orders = await OrderModel.find({
				_id: { $in: payment.orderIds },
			});
			const allOrderItems = [];

			orders.forEach((order) => {
				allOrderItems.push(...order.items);
			});

			// // Xóa sản phẩm đã thanh toán khỏi giỏ hàng
			if (allOrderItems.length > 0) {
				await removeItemsFromCart(payment.buyer, allOrderItems);
			}
		}

		await payment.save();
	}

	return {
		payment,
		vnp_ResponseCode,
	};
};

export const momoPayment = async (buyerId, paymentData) => {
	const { orderIds, totalAmount } = paymentData;

	// Lấy tất cả đơn hàng
	const orders = await OrderModel.find({
		_id: { $in: orderIds },
		buyer: buyerId,
	});

	if (orders.length === 0) {
		throw new Errors.NotFoundError('Không tìm thấy đơn hàng');
	}

	var accessKey = env.MOMO_ACCESS_KEY;
	var secretKey = env.MOMO_SECRET_KEY;

	var partnerCode = 'MOMO';
	var redirectUrl =
		env.MOMO_REDIRECT_URL ||
		'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
	var ipnUrl =
		env.MOMO_IPN_URL ||
		'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
	var requestType = 'payWithMethod';
	var amount = totalAmount.toString();
	var orderId = orders[0].paymentId.toString(); // ID đơn hàng
	var requestId = orderId; // ID đơn hàng
	var orderInfo = `Thanh toán đơn hàng ${orderId}`; // Thông tin đơn hàng
	var extraData = '';
	var orderGroupId = '';
	var autoCapture = true;
	var lang = 'vi';

	var rawSignature =
		'accessKey=' +
		accessKey +
		'&amount=' +
		amount +
		'&extraData=' +
		extraData +
		'&ipnUrl=' +
		ipnUrl +
		'&orderId=' +
		orderId +
		'&orderInfo=' +
		orderInfo +
		'&partnerCode=' +
		partnerCode +
		'&redirectUrl=' +
		redirectUrl +
		'&requestId=' +
		requestId +
		'&requestType=' +
		requestType;

	var signature = crypto
		.createHmac('sha256', secretKey)
		.update(rawSignature)
		.digest('hex');

	const requestBody = JSON.stringify({
		partnerCode: partnerCode,
		partnerName: 'Test',
		storeId: 'MomoTestStore',
		requestId: requestId,
		amount: amount,
		orderId: orderId,
		orderInfo: orderInfo,
		redirectUrl: redirectUrl,
		ipnUrl: ipnUrl,
		lang: lang,
		requestType: requestType,
		autoCapture: autoCapture,
		extraData: extraData,
		orderGroupId: orderGroupId,
		signature: signature,
	});

	const options = {
		hostname: 'test-payment.momo.vn',
		port: 443,
		path: '/v2/gateway/api/create',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(requestBody),
		},
	};

	return new Promise((resolve, reject) => {
		const momoRequest = https.request(options, (momoRes) => {
			momoRes.setEncoding('utf8');
			let rawData = '';
			momoRes.on('data', (chunk) => {
				rawData += chunk;
			});
			momoRes.on('end', () => {
				try {
					const momoResponse = JSON.parse(rawData);
					if (momoResponse.resultCode === 0) {
						resolve({
							paymentUrl: momoResponse.payUrl,
							paymentId: orders[0].paymentId,
							momoResponse,
						});
					} else {
						reject(
							new Error(momoResponse.message || 'Payment failed'),
						);
					}
				} catch (err) {
					reject(err);
				}
			});
		});
		momoRequest.on('error', (e) => {
			reject(e);
		});
		momoRequest.write(requestBody);
		momoRequest.end();
	});
};

export const handleMoMoReturn = async (query) => {
	const { resultCode, transId, requestId } = query;

	const payment = await PaymentModel.findOne({ _id: requestId });
	if (!payment) {
		throw new Errors.NotFoundError('Không tìm thấy thanh toán');
	}

	// Cập nhật trạng thái thanh toán
	if (resultCode === '0') {
		payment.paymentHistory.push({
			date: new Date(),
			amount: payment.totalAmount,
			paymentMethod: 'MOMO',
			transactionId: transId,
			note: 'Thanh toán thành công với MOMO',
		});

		// Cập nhật trạng thái thanh toán cho tất cả đơn hàng
		// Và cập nhật trạng thái đơn hàng
		if (payment.orderIds && payment.orderIds.length > 0) {
			payment.status = 'PAID';

			// Cập nhật trạng thái đơn hàng
			await OrderModel.updateMany(
				{ _id: { $in: payment.orderIds } },
				{ status: 'CONFIRMED' },
			);

			// Lấy tất cả đơn hàng để xóa sản phẩm khỏi giỏ hàng
			const orders = await OrderModel.find({
				_id: { $in: payment.orderIds },
			});
			const allOrderItems = [];

			orders.forEach((order) => {
				allOrderItems.push(...order.items);
			});

			// // Xóa sản phẩm đã thanh toán khỏi giỏ hàng
			if (allOrderItems.length > 0) {
				await removeItemsFromCart(payment.buyer, allOrderItems);
			}
		}

		await payment.save();
	}

	return {
		payment,
		resultCode,
	};
};

// Xử lý tiền cho người bán khi người mua xác nhận đơn hàng (1 đơn)
export const handlePaymentForSeller = async (orderId) => {
	const order = await OrderModel.findById(orderId);
	if (!order) {
		throw new Errors.NotFoundError('Không tìm thấy đơn hàng');
	}
	const payment = await PaymentModel.findById(order.paymentId);
	if (!payment) {
		throw new Errors.NotFoundError('Không tìm thấy thanh toán');
	}

	const now = new Date();

	for (const seller of payment.sellers) {
		if (seller.escrowStatus === 'HOLD') {
			const order = await OrderModel.findById(orderId);
			if (order.status === 'DELIVERED') {
				await UserModel.findOneAndUpdate(
					{ _id: seller.sellerId },
					{
						$inc: {
							'sellerVerification.balance': seller.escrowAmount,
						},
					},
					{ new: true },
				);
				seller.escrowStatus = 'RELEASED';
				payment.paymentHistory.push({
					amount: seller.escrowAmount,
					paymentMethod: 'ESCROW_RELEASE',
					transactionId: `TX-${Date.now()}`,
					note: `Giải ngân thủ công cho seller ${seller.sellerId}`,
				});
			}
		}
		order.status = 'COMPLETED';
		order.items.forEach(async (item) => {
			const product = await ProductModel.findById(item.productId);
			product.sold += item.quantity;
			product.stock -= item.quantity;
			await product.save();
		});
		await order.save();
		await payment.save();
	}

	return order;
};

// hoặc sau 3-5 từ khi người mua nhận hàng (cho nhiều đơn hàng)

export const releaseSellerEscrowByOrder = async () => {
	const now = new Date();
	const payments = await PaymentModel.find({
		'sellers.escrowStatus': 'HOLD',
		'sellers.holdUntil': { $lte: now },
	});

	for (const payment of payments) {
		let ordersUpdated = [];
		// Lặp qua từng orderId trong payment
		for (const orderId of payment.orderIds) {
			const order = await OrderModel.findById(orderId);
			if (!order) continue;

			// Lặp qua từng seller trong payment
			for (const seller of payment.sellers) {
				if (seller.escrowStatus === 'HOLD' && seller.holdUntil <= now) {
					// Kiểm tra đơn hàng đã giao
					if (order.status === 'DELIVERED') {
						const updated = await UserModel.findByIdAndUpdate(
							seller.sellerId,
							{
								$inc: {
									'sellerVerification.balance':
										seller.escrowAmount,
								},
							},
							{ new: true },
						);
						seller.escrowStatus = 'RELEASED';
						payment.paymentHistory.push({
							amount: seller.escrowAmount,
							paymentMethod: 'ESCROW_RELEASE',
							transactionId: `TX-${Date.now()}`,
							note: `Giải ngân thủ công cho seller ${seller.sellerId}`,
						});
						// Cập nhật trạng thái order
						order.status = 'COMPLETED';
						await order.save();
						ordersUpdated.push(order._id);
					}
				}
			}
		}
		await payment.save();
	}

	return payments;
};

// Lấy lịch sử thanh toán cho người bán
export const getPaymentHistory = async (userId, page, limit) => {
	const payments = await PaymentModel.find({
		'sellers.sellerId': userId,
		'sellers.escrowStatus': 'RELEASED',
	})
		.sort({ createdAt: -1 })
		.skip((page - 1) * limit)
		.limit(limit);

	const total = await PaymentModel.countDocuments({
		'sellers.sellerId': userId,
		'sellers.escrowStatus': 'RELEASED',
	});

	return {
		transactions: payments,
		total,
		totalPages: Math.ceil(total / limit),
	};
};

export const zaloPayPayment = async (buyerId, paymentData) => {
	// const { orderIds, totalAmount } = paymentData;

	// // Lấy tất cả đơn hàng
	// const orders = await OrderModel.find({
	// 	_id: { $in: orderIds },
	// 	buyer: buyerId,
	// });

	// if (orders.length === 0) {
	// 	throw new Errors.NotFoundError('Không tìm thấy đơn hàng');
	// }

	// Tạo app_trans_id theo format yymmdd_xxx (theo tài liệu ZaloPay)
	const currentDate = moment().format('DDMMYYYY');
	const randomSuffix = Math.floor(Math.random() * 1000000);
	const app_trans_id = `${currentDate}_${randomSuffix}`;

	// Tạo item array theo format ZaloPay
	const items = [
		{
			itemid: '123456',
			itemname: 'Sản phẩm 1',
			itemprice: 100000,
			itemquantity: 1,
		},
	];
	// orders.forEach((order) => {
	// 	order.items.forEach((item) => {
	// 		items.push({
	// 			itemid: item.productId.toString(),
	// 			itemname: item.productName || 'Sản phẩm',
	// 			itemprice: item.price,
	// 			itemquantity: item.quantity,
	// 		});
	// 	});
	// });

	const data = {
		app_id: 2553, // Phải là số nguyên
		app_user: 'user123456', // Thông tin người dùng
		app_trans_id: app_trans_id, // Mã giao dịch
		app_time: Date.now(), // Thời gian tạo đơn hàng
		amount: 50000, // Số tiền VND
		item: JSON.stringify(items), // Danh sách sản phẩm
		embed_data: JSON.stringify({}), // Dữ liệu bổ sung
		bank_code: 'zalopayapp', // Mã ngân hàng
		description: 'Thanh toán đơn hàng 123456', // Mô tả
	};

	// Tạo HMAC theo format: app_id|app_trans_id|app_user|amount|app_time|embed_data|item
	const hmac_input = `${data.app_id}|${data.app_trans_id}|${data.app_user}|${data.amount}|${data.app_time}|${data.embed_data}|${data.item}`;

	const mac = crypto
		.createHmac('sha256', env.ZALO_PAY_KEY_1)
		.update(hmac_input)
		.digest('hex');

	data.mac = mac;

	try {
		const response = await axios.post(env.ZALO_PAY_URL, data, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		});

		if (response.data.return_code === 1) {
			return {
				redirectUrl: response.data.order_url,
				zaloPayResponse: response.data,
			};
		} else {
			throw new Error(
				`ZaloPay Error: ${response.data.return_message} - ${response.data.sub_return_message}`,
			);
		}
	} catch (error) {
		if (error.response) {
			throw new Error(
				`ZaloPay API Error: ${
					error.response.data.return_message || error.message
				}`,
			);
		}
		throw error;
	}
};

export const handleQueryZaloPay = async (query) => {
	const data = {
		app_id: parseInt(env.ZALO_PAY_APP_ID),
		app_trans_id: query.app_trans_id,
	};

	const hmac_input = `${data.app_id}|${data.app_trans_id}|${env.ZALO_PAY_KEY_1}`;

	const mac = crypto
		.createHmac('sha256', env.ZALO_PAY_KEY)
		.update(hmac_input)
		.digest('hex');

	data.mac = mac;

	const response = await axios.post(
		'https://sb-openapi.zalopay.vn/v2/query',
		null,
		{
			params: data,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		},
	);

	return response.data;
};
