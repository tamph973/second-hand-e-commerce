import CategoryModel from '../models/category.model.js';
import { uploadImagesService } from './upload.service.js';
import Errors from '../common/response/error.response.js';
import slugify from 'slugify';
import ProductModel from '../models/product.model.js';
import UserModel from '../models/user.model.js';

export const createCategory = async (categoryData, req) => {
	// Validation
	if (!categoryData.name || categoryData.name.trim().length === 0) {
		throw new Errors.BadRequestError('Tên danh mục không được để trống');
	}

	// Kiểm tra danh mục đã tồn tại
	const existingCategory = await CategoryModel.findOne({
		name: { $regex: new RegExp(`^${categoryData.name.trim()}$`, 'i') },
		parentId: categoryData.parentId || null,
	});

	if (existingCategory) {
		throw new Errors.BadRequestError('Danh mục này đã tồn tại');
	}

	let imageData = { url: '', public_id: '' };
	if (req.file) {
		const uploadedImage = await uploadImagesService(req, 'category');
		if (uploadedImage) {
			imageData = uploadedImage[0];
		}
	}

	const payload = {
		name: categoryData.name.trim(),
		image: imageData,
		status: categoryData.status !== undefined ? categoryData.status : true,
		parentId: categoryData.parentId || null,
	};

	const category = await CategoryModel.create(payload);
	return category;
};

// Lấy danh sách danh mục cha
export const getAllCategory = async (filters = {}) => {
	const query = {
		parentId: null,
	};

	if (filters.search) {
		query.$or = [
			{ name: { $regex: filters.search, $options: 'i' } },
			{ slug: { $regex: filters.search, $options: 'i' } },
		];
	}

	const categories = await CategoryModel.find(query)
		.sort({ name: -1 })
		.select('-__v');
	const result = categories.map((cat) => ({
		id: cat._id,
		name: cat.name,
		slug: cat.slug,
		image: cat.image.url || '',
	}));

	return result;
};

// Lấy danh sách danh mục con theo parentId
export const getCategoryChildren = async (parentId, filters = {}) => {
	const query = {
		parentId: parentId,
	};

	if (filters.search) {
		query.$or = [
			{ name: { $regex: filters.search, $options: 'i' } },
			{ slug: { $regex: filters.search, $options: 'i' } },
		];
	}

	const categories = await CategoryModel.find(query)
		.sort({ name: -1 })
		.select('-__v');
	const result = categories.map((cat) => ({
		id: cat._id,
		name: cat.name,
		slug: cat.slug,
		image: cat.image.url || '',
	}));

	return result;
};

export const getCategoryById = async (id) => {
	const category = await CategoryModel.findById(id);
	if (!category) {
		throw new Errors.NotFoundError('Danh mục không tồn tại');
	}
	return {
		id: category._id,
		name: category.name,
		slug: category.slug,
		image: category.image.url || '',
	};
};

export const updateCategory = async (id, updateData, req) => {
	const category = await CategoryModel.findById(id);
	if (!category) {
		throw new Errors.NotFoundError('Danh mục không tồn tại');
	}
	// Nếu cập nhật tên, kiểm tra trùng lặp trong cùng cấp
	if (updateData.name && updateData.name !== category.name) {
		const existingCategory = await CategoryModel.findOne({
			name: {
				$regex: new RegExp(`^${updateData.name.trim()}$`, 'i'),
			},
			parentId:
				updateData.parentId !== undefined
					? updateData.parentId
					: category.parentId,
			_id: { $ne: id },
		});

		if (existingCategory) {
			throw new Errors.BadRequestError(
				'Tên danh mục đã tồn tại trong cùng cấp',
			);
		}

		category.name = updateData.name.trim();
		// Tạo slug mới
		category.slug = slugify(updateData.name, {
			lower: true,
			strict: true,
			locale: 'vi',
			trim: true,
		});

		// Kiểm tra slug mới
		const existingSlug = await CategoryModel.findOne({
			slug: category.slug,
			parentId:
				updateData.parentId !== undefined
					? updateData.parentId
					: category.parentId,
			_id: { $ne: id },
		});
		if (existingSlug) {
			throw new Errors.BadRequestError('Slug đã tồn tại trong cùng cấp');
		}
	}

	// Cập nhật parentId nếu có
	if (updateData.parentId !== undefined) {
		category.parentId = updateData.parentId || null;
	}

	// Cập nhật trạng thái nếu có
	if (updateData.status !== undefined) {
		category.status = updateData.status;
		category.updatedAt = Date.now();
	}
	console.log('req.file :>> ', req.file);
	// Xử lý upload ảnh mới nếu có
	if (req.file) {
		const uploadedImage = await uploadImagesService(req, 'category');
		if (uploadedImage) {
			category.image.url = uploadedImage[0].url;
			category.image.public_id = uploadedImage[0].public_id;
		}
	}

	// Cập nhật thông tin
	const updatedCategory = await CategoryModel.findByIdAndUpdate(
		id,
		category,
		{ new: true, runValidators: true },
	);

	return updatedCategory;
};

export const deleteCategory = async (id) => {
	const category = await CategoryModel.findById(id);
	if (!category) {
		throw new Errors.NotFoundError('Danh mục không tồn tại');
	}

	// Không cho phép xóa nếu còn danh mục con
	const hasChildren = await CategoryModel.exists({ parentId: id });
	if (hasChildren) {
		throw new Errors.BadRequestError(
			'Không thể xóa danh mục khi còn danh mục con',
		);
	}

	await CategoryModel.findByIdAndDelete(id);
	return { message: 'Xóa danh mục thành công' };
};

// Lấy tree danh mục
export const getCategoryTree = async () => {
	const categories = await CategoryModel.find({ status: true }).lean();
	function buildTree(list, parentId = null) {
		return list
			.filter((cat) => String(cat.parentId) === String(parentId))
			.map((cat) => ({
				...cat,
				children: buildTree(list, cat._id),
			}));
	}
	// Sắp xếp theo tên từ a-z
	return buildTree(categories).sort((a, b) => a.name.localeCompare(b.name));
};

export const getCategoryByShop = async (shopId) => {
	const shop = await UserModel.findById(shopId);
	if (!shop) throw new Errors.NotFoundError('Shop không tồn tại');

	// Lấy danh sách categoryId duy nhất mà shop có sản phẩm
	const categoryIds = await ProductModel.distinct('categoryId', {
		userId: shop._id,
	});

	// Lấy thông tin category
	const categories = await CategoryModel.find({
		_id: { $in: categoryIds },
	})
		.select('name slug parentId')
		.lean();

	// Lấy thông tin danh mục cha parentId
	const parentIds = categories.map((cat) => cat.parentId);
	const parentCategories = await CategoryModel.find({
		_id: { $in: parentIds },
	}).select('name slug');

	// Map parent info vào category con
	const parentMap = Object.fromEntries(
		parentCategories.map((p) => [p._id.toString(), p]),
	);
	const result = categories.map((c) => ({
		...c,
		parentCategoryName: c.parentId
			? parentMap[c.parentId.toString()]?.name
			: null,
		parentCategorySlug: c.parentId
			? parentMap[c.parentId.toString()]?.slug
			: null,
	}));

	return result;
};

// ADMIN: Lấy tất cả danh mục con: parentId !== null
export const getSubCategories = async () => {
	const categories = await CategoryModel.find({
		parentId: { $ne: null },
	}).populate('parentId', 'name slug');
	return categories;
};
