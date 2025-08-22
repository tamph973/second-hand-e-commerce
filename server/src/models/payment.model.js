import mongoose from 'mongoose';

const paymentModel = new mongoose.Schema(
	{
		buyer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, // Backward compatibility
		orderIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }], // Hỗ trợ nhiều đơn hàng
		paymentMethod: {
			type: String,
			enum: ['COD', 'MOMO', 'VNPAY', 'BANK'],
		},
		status: {
			type: String,
			enum: ['UNPAID', 'PAID', 'FAILED', 'REFUNDED'],
			default: 'UNPAID',
		},
		totalAmount: { type: Number, required: true }, // Tổng tiền người mua trả
		platformFee: Number,
		failureReason: String,
		// Thông tin vận chuyển (nếu áp dụng)
		shippingPartner: String,
		trackingNumber: String,

		// Thanh toán cho từng người bán
		sellers: [
			{
				sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
				escrowStatus: {
					type: String,
					enum: ['PENDING', 'HOLD', 'RELEASED', 'FAILED'],
					default: 'PENDING', // PENDING: chờ thanh toán, HOLD: đang giữ tiền, PAID: đã thanh toán, FAILED: thanh toán thất bại
				},
				escrowAmount: Number, // tổng tiền dự kiến của seller
				holdUntil: Date, // Thời điểm tự động giải ngân
			},
		],

		// Lịch sử thanh toán
		paymentHistory: [
			{
				date: { type: Date, default: Date.now },
				amount: Number,
				paymentMethod: String,
				transactionId: String,
				note: String, // Ghi chú (vd: "Hoàn tiền do hủy đơn")
			},
		],
	},
	{ timestamps: true },
);

const PaymentModel = mongoose.model('Payment', paymentModel);
export default PaymentModel;
