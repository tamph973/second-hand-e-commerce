import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: true,
		},
		image: {
			url: { type: String, default: '' },
			public_id: { type: String, default: '' },
		},
		status: {
			type: Boolean,
			default: true,
		},
		usedCount: {
			type: Number, // số lượng sản phẩm có trong brand này
			default: 0,
		},
		_destroy: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);

const BrandModel = mongoose.model('Brand', brandSchema);
export default BrandModel;
