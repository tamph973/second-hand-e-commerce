import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
	{
		buyerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
		totalPrice: {
			type: Number,
			default: 0,
			min: 0,
		},
		totalQuantity: {
			type: Number,
			default: 0,
			min: 0,
		},
		items: [
			{
				productId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Product',
					required: true,
				},
				variantId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Variant',
					// Optional: chỉ cần khi sản phẩm có biến thể
				},
				quantity: {
					type: Number,
					default: 1,
					min: 1,
				},
				price: {
					type: Number,
					required: true,
					min: 0,
				},
				addedAt: {
					type: Date,
					default: Date.now,
				},
				_destroy: {
					type: Boolean,
					default: false,
				},
			},
		],
		// Thông tin coupon/discount
		appliedCoupon: {
			code: String,
			discountAmount: { type: Number, default: 0 },
			discountType: {
				type: String,
				enum: ['PERCENTAGE', 'FIXED_AMOUNT'],
			},
			minimumOrderAmount: Number,
		},
	},
	{
		timestamps: true,
		// Indexes để tối ưu performance
		indexes: [
			{ userId: 1 },
			{ 'items.productId': 1 },
			{ 'items.variantId': 1 },
		],
	},
);

// Method để tính toán lại totalPrice và totalQuantity
cartSchema.methods.recalculateTotals = function () {
	this.totalQuantity = this.items.reduce(
		(sum, item) => sum + item.quantity * (item._destroy ? 0 : 1),
		0,
	);
	this.totalPrice = this.items.reduce(
		(sum, item) =>
			sum + item.price * item.quantity * (item._destroy ? 0 : 1),
		0,
	);

	// Áp dụng coupon discount nếu có
	if (
		this.appliedCoupon &&
		this.appliedCoupon.discountAmount > 0 &&
		this.totalPrice >= this.appliedCoupon.minimumOrderAmount
	) {
		if (this.appliedCoupon.discountType === 'PERCENTAGE') {
			this.totalPrice =
				this.totalPrice * (1 - this.appliedCoupon.discountAmount / 100);
		} else {
			this.totalPrice = Math.max(
				0,
				this.totalPrice - this.appliedCoupon.discountAmount,
			);
		}
	}

	return this;
};

// Method để lấy item theo productId và variantId
cartSchema.methods.findItem = function (productId, variantId = null) {
	return this.items.find(
		(item) =>
			item.productId.toString() === productId.toString() &&
			((variantId &&
				item.variantId &&
				item.variantId.toString() === variantId.toString()) ||
				(!variantId && !item.variantId)),
	);
};
// Method để merge item mới vào giỏ hàng
cartSchema.methods.mergeItem = function (newItem) {
	const existingItem = this.findItem(newItem.productId, newItem.variantId);

	if (existingItem) {
		existingItem.quantity += newItem.quantity;
	} else {
		this.items.push(newItem);
	}

	this.recalculateTotals();
	return this;
};

const CartModel = mongoose.model('Cart', cartSchema);

export default CartModel;
