import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
		},
		slug: {
			type: String,
			unique: true,
			lowercase: true,
			trim: true,
			index: true,
		},
		image: {
			url: { type: String, default: '' },
			public_id: { type: String, default: '' },
		},
		status: {
			type: Boolean,
			default: true,
		},
		parentId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
			default: null,
			index: true,
		},
		usedCount: {
			type: Number, // số lượng sản phẩm có trong category này
			default: 0,
		},
		_destroy: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);

categorySchema.pre('save', function (next) {
	if (this.isModified('name') && this.name) {
		this.slug = slugify(this.name, {
			lower: true,
			strict: true,
			locale: 'vi',
			trim: true,
		});
	}
	next();
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
