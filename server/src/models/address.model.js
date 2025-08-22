import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
			required: true,
			index: true,
		},
		fullName: {
			type: String,
			trim: true,
			default: '',
		},
		phoneNumber: {
			type: String,
			trim: true,
			default: null,
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
			default: '',
		},
		addressDetail: {
			type: String,
			default: '',
		},
		provinceCode: {
			type: Number,
			default: '',
		},
		provinceName: {
			type: String,
			default: '',
		},
		districtCode: {
			type: Number,
			default: '',
		},
		districtName: {
			type: String,
			default: '',
		},
		wardCode: {
			type: Number,
			default: '',
		},
		wardName: {
			type: String,
			default: '',
		},
		addressType: {
			type: String,
			enum: ['HOME', 'OFFICE', 'OTHER'],
			default: 'HOME',
		},
		isDefault: {
			type: Boolean,
			default: false,
		},
		status: {
			type: Boolean,
			default: true,
		},
		usedCount: {
			type: Number,
			default: 0,
		},
		_destroy: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);

const AddressModel = mongoose.model('Address', AddressSchema);
export default AddressModel;
