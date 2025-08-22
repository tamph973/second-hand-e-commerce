import mongoose from 'mongoose';

const VariantSchema = new mongoose.Schema(
	{
		productId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
			required: true,
			index: true,
		},
		title: {
			type: String,
			trim: true,
		},
		price: {
			type: Number,
			min: 0,
		},
		stock: {
			type: Number,
			default: 1,
			min: 0,
		},
		attributes: {
			type: Object,
			default: {},
		},
		images: [
			{
				url: { type: String, default: '' },
				public_id: { type: String, default: '' },
			},
		],
		status: {
			type: String,
			default: 'ACTIVE',
			enum: ['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK'],
		},
	},
	{
		timestamps: true,
	},
);

// Index để tối ưu truy vấn
VariantSchema.index({ productId: 1, status: 1 });

const VariantModel = mongoose.model('Variant', VariantSchema);
export default VariantModel;
