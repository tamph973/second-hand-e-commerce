import mongoose from 'mongoose';

const orderModel = new mongoose.Schema(
	{
		orderCode: {
			type: String,
		},
		buyer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		items: [
			{
				productId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Product',
				},
				quantity: Number,
				price: Number,
			},
		],

		subTotal: Number, // Tổng tiền sản phẩm (chưa tính ship)
		discount: Number,
		shippingFee: Number,
		totalAmount: Number, // Tổng tất cả tiền (sản phẩm + ship + discount)
		status: {
			type: String,
			enum: [
				'ALL',
				'PENDING',
				'PROCESSING',
				'CONFIRMED',
				'CANCELLED',
				'COMPLETED',
				'SHIPPING',
				'DELIVERED',
				'RETURNED',
				'PREPARING',
				'WAITING_PROCESSED',
				'WAITING_HANDOVER',
				'DELIVERY_TOMORROW',
				'OUT_OF_STOCK',
				'FAILED_DELIVERY',
			],
			default: 'PENDING',
		},
		trackingNumber: String,
		paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }, // Liên kết với Payment
		// // Địa chỉ giao hàng
		shippingAddress: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Address',
			default: null,
		},
		// Thời gian xử lý
		completedAt: Date, // Khi người mua xác nhận đã nhận hàng
	},
	{ timestamps: true },
);

const OrderModel = mongoose.model('Order', orderModel);
export default OrderModel;
