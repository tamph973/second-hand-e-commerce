import ProductModel from '../models/product.model.js';
import userModel from '../models/user.model.js';
import Errors from '../common/response/error.response.js';
import { uploadImagesService, deleteImages } from './upload.service.js';
import VariantModel from '../models/variant.model.js';
import CategoryModel from '../models/category.model.js';
import { buildProductQuery, buildSortOptions } from '../utils/helpers.js';

const handleImageUpload = async (req) => {
	if (!req || (!req.files && !req.file)) {
		return { uploadedImages: [], thumbnail: null };
	}
	try {
		let uploadedImages = [];
		let thumbnail = null;

		if (req.files.products) {
			const productFiles = { files: req.files.products };
			uploadedImages = await uploadImagesService(productFiles, 'product');

			if (uploadedImages.length > 0) {
				thumbnail = {
					url: uploadedImages[0].url,
					public_id: uploadedImages[0].public_id,
				};
			}
		}
		return { uploadedImages, thumbnail };
	} catch (error) {
		throw new Errors.BadRequestError(`Lỗi upload ảnh: ${error.message}`);
	}
};

export const createProduct = async (userId, data, req = null) => {
	if (typeof data.attributes === 'string') {
		data.attributes = JSON.parse(data.attributes);
	}
	if (typeof data.address === 'string') {
		data.address = JSON.parse(data.address);
	}

	// Kiểm tra user có tồn tại và có quyền đăng sản phẩm không
	const user = await userModel.findById(userId);
	if (!user) {
		throw new Errors.NotFoundError('Không tìm thấy người dùng');
	}

	// Validation dữ liệu đầu vào chung
	if (!data.title || !data.title.trim()) {
		throw new Errors.BadRequestError(
			'Tiêu đề sản phẩm không được để trống',
		);
	}

	// Xác định loại sản phẩm
	const type = data.type === 'MULTIPLE' ? 'MULTIPLE' : 'SINGLE';

	// Validate theo loại sản phẩm
	if (type === 'SINGLE') {
		if (!data.price || data.price <= 0) {
			throw new Errors.BadRequestError('Giá sản phẩm phải lớn hơn 0');
		}
		if (!data.attributes || typeof data.attributes !== 'object') {
			throw new Errors.BadRequestError(
				'Thuộc tính sản phẩm không hợp lệ',
			);
		}
	}

	// Validate variants nếu là MULTIPLE
	if (type === 'MULTIPLE') {
		if (data.variants && typeof data.variants === 'string') {
			try {
				data.variants = JSON.parse(data.variants);
			} catch (error) {
				throw new Errors.BadRequestError(
					'Dữ liệu variants không hợp lệ',
				);
			}
		}
		if (
			!data.variants ||
			!Array.isArray(data.variants) ||
			data.variants.length === 0
		) {
			throw new Errors.BadRequestError(
				'Sản phẩm có biến thể phải có ít nhất một biến thể',
			);
		}
		// Validate từng variant - bỏ tạm thời
		// data.variants.forEach((variant, index) => {
		// 	if (
		// 		!variant.code ||
		// 		!variant.combination ||
		// 		!Array.isArray(variant.combination)
		// 	) {
		// 		throw new Errors.BadRequestError(
		// 			`Biến thể ${index + 1}: Dữ liệu không hợp lệ`,
		// 		);
		// 	}
		// 	if (variant.price && variant.price <= 0) {
		// 		throw new Errors.BadRequestError(
		// 			`Biến thể ${index + 1}: Giá phải lớn hơn 0`,
		// 		);
		// 	}
		// 	if (variant.stock && variant.stock <= 0) {
		// 		throw new Errors.BadRequestError(
		// 			`Biến thể ${index + 1}: Số lượng phải lớn hơn 0`,
		// 		);
		// 	}
		// });
	}

	// Kiểm tra giới hạn số lượng sản phẩm
	const currentProductCount = await ProductModel.countDocuments({ userId });
	if (!user.canUploadMoreProducts(currentProductCount)) {
		throw new Errors.ForbiddenError(
			`Bạn đã đạt giới hạn ${user.sellerVerification.limits.maxProducts} sản phẩm. Vui lòng nâng cấp tài khoản để đăng thêm sản phẩm`,
		);
	}

	// Kiểm tra giới hạn upload hàng ngày
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const todayProducts = await ProductModel.countDocuments({
		userId,
		createdAt: { $gte: today },
	});

	if (todayProducts >= user.sellerVerification.limits.dailyUploadLimit) {
		throw new Errors.ForbiddenError(
			`Bạn đã đạt giới hạn upload ${user.sellerVerification.limits.dailyUploadLimit} sản phẩm/ngày. Vui lòng thử lại vào ngày mai hoặc nâng cấp tài khoản`,
		);
	}

	// Xử lý upload ảnh
	const { uploadedImages, thumbnail } = await handleImageUpload(req);

	// Tính toán priceRange
	let priceRange = { min: 0, max: 0 };
	if (type === 'SINGLE') {
		priceRange = { min: data.price, max: data.price };
	} else if (type === 'MULTIPLE') {
		const activeVariants = data.variants.filter(
			(v) => v.isActive !== false,
		);
		if (activeVariants.length > 0) {
			const prices = activeVariants
				.map((v) => v.price || 0)
				.filter((p) => p > 0);
			if (prices.length > 0) {
				priceRange = {
					min: Math.min(...prices),
					max: Math.max(...prices),
				};
			}
		}
	}

	// Chuẩn bị dữ liệu tạo sản phẩm
	const productData = {
		...data,
		type,
		userId,
		priceRange,
		status: 'PENDING', // Mặc định cần duyệt
	};

	// Thêm ảnh đã upload vào product data
	if (uploadedImages.length > 0) {
		productData.images = uploadedImages.map((img) => ({
			url: img.url,
			public_id: img.public_id,
		}));
	}

	// Lưu thumbnail
	if (thumbnail) {
		productData.thumbnail = thumbnail;
	}

	// Nếu là sản phẩm đơn, lưu stock vào product
	if (type === 'SINGLE') {
		productData.stock = data.stock || 1;
	}

	let product;
	let variants = [];

	try {
		// 1. Tạo product trước
		product = await ProductModel.create(productData);

		// 2. Tạo variants nếu là MULTIPLE
		if (type === 'MULTIPLE' && data.variants && data.variants.length > 0) {
			// Tải ảnh biến thể
			if (req.files.variants) {
				const variantFiles = { files: req.files.variants };
				const uploadedVariants = await uploadImagesService(
					variantFiles,
					'variant',
				);

				// Gán mỗi ảnh cho từng biến thể (mỗi variant 1 ảnh)
				data.variants.forEach((variant, index) => {
					if (uploadedVariants[index]) {
						variant.images = [
							{
								url: uploadedVariants[index].url,
								public_id: uploadedVariants[index].public_id,
							},
						];
					} else {
						variant.images = [];
					}
				});
			}

			data.variants.forEach((variant) => {
				variant.attributes = variant.combination.reduce((obj, item) => {
					obj[item.name] = item.value; // { name: 'capactiy', value: '256GB' }
					return obj; // { 'capactiy': '256GB' }
				}, {});
			});

			const variantData = data.variants.map((variant) => ({
				...variant,
				productId: product._id,
			}));

			variants = await VariantModel.create(variantData);
		}

		// 3. Cập nhật metrics của seller
		await userModel.findByIdAndUpdate(userId, {
			$inc: { 'sellerVerification.metrics.totalProducts': 1 },
		});
	} catch (error) {
		// Nếu đã upload ảnh thì xóa
		if (uploadedImages.length > 0) {
			const publicIds = uploadedImages.map((img) => img.public_id);
			await deleteImages(publicIds);
		}

		// Nếu đã tạo product nhưng lỗi khi tạo variants, xóa product
		if (product && type === 'MULTIPLE') {
			await ProductModel.findByIdAndDelete(product._id);
		}

		// Có thể custom message cho lỗi duplicate key nếu muốn
		if (error.code === 11000 && error.keyPattern && error.keyPattern.slug) {
			throw new Errors.BadRequestError(
				'Slug sản phẩm đã tồn tại, vui lòng đổi tên sản phẩm!',
			);
		}
		// Ném lại lỗi cho các trường hợp khác
		throw error;
	}

	// Trả về kết quả
	if (type === 'MULTIPLE') {
		return { product, variants };
	} else {
		return product;
	}
};

export const updateProduct = async (userId, productId, data) => {
	const product = await ProductModel.findOne({ _id: productId, userId });

	if (!product) {
		throw new Errors.NotFoundError('Không tìm thấy sản phẩm');
	}

	// Kiểm tra quyền cập nhật
	const user = await userModel.findById(userId);
	if (!user.canCreateProduct()) {
		throw new Errors.ForbiddenError('Bạn không có quyền cập nhật sản phẩm');
	}

	// Kiểm tra giới hạn giá nếu có thay đổi giá
	if (data.price && !user.canCreateProductWithPrice(data.price)) {
		const limits = {
			BASIC: '500,000 VNĐ',
			ADVANCED: '2,000,000 VNĐ',
			PREMIUM: '10,000,000 VNĐ',
		};
		throw new Errors.ForbiddenError(
			`Giá sản phẩm vượt quá giới hạn cho phép. Cấp độ ${
				user.sellerVerification.verificationLevel
			} chỉ được phép đăng sản phẩm tối đa ${
				limits[user.sellerVerification.verificationLevel]
			}`,
		);
	}

	// Reset status về PENDING nếu có thay đổi quan trọng
	if (data.name || data.description || data.price || data.thumbnail) {
		data.status = 'PENDING';
	}

	const updatedProduct = await ProductModel.findByIdAndUpdate(
		productId,
		data,
		{ new: true },
	);

	return updatedProduct;
};

export const deleteProduct = async (userId, productId) => {
	const product = await ProductModel.findOne({ _id: productId, userId });

	if (!product) {
		throw new Errors.NotFoundError('Không tìm thấy sản phẩm');
	}

	await ProductModel.findByIdAndDelete(productId);

	// Cập nhật metrics của seller
	const user = await userModel.findById(userId);
	const currentProductCount = await ProductModel.countDocuments({ userId });
	await user.updateSellerMetrics({
		totalProducts: currentProductCount,
	});

	return { message: 'Xóa sản phẩm thành công' };
};

export const getProductsBySeller = async (userId, reqQuery) => {
	const {
		category_id = 'ALL',
		page = 1,
		limit = 10,
		sortBy,
		search,
		...params
	} = reqQuery;

	const query = await buildProductQuery({
		category_id,
		sortBy,
		search,
		...params,
	});

	const skip = (page - 1) * limit;

	const products = await ProductModel.find({ userId, ...query })
		.skip(skip)
		.limit(limit)
		.populate('categoryId', 'name')
		.populate('brandId', 'name');

	const total = await ProductModel.countDocuments({ userId, ...query });

	return {
		products,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
};

// Lấy danh sách sản phẩm

export const getAllProducts = async (reqQuery) => {
	const {
		category_id = 'ALL',
		page = 1,
		limit = 10,
		sortBy = 'createdAtDesc',
		search,
		...params
	} = reqQuery;

	const query = await buildProductQuery({
		category_id,
		search,
		...params,
	});

	const skip = (page - 1) * limit;

	const sortOptions = await buildSortOptions(sortBy);
	const products = await ProductModel.find(query)
		.sort(sortOptions)
		.skip(skip)
		.limit(limit)
		.populate('userId', 'fullName email')
		.populate('categoryId', 'name')
		.populate('brandId', 'name');

	const total = await ProductModel.countDocuments(query);

	return {
		products,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
};

// Lấy sản phẩm theo slug danh mục
export const getProductsByCategorySlug = async (categorySlug, options = {}) => {
	const {
		page = 1,
		limit = 15,
		sortBy,
		minPrice = '',
		maxPrice = '',
		condition,
		capacity,
		color,
		province,
		search,
	} = options;

	// Tìm danh mục theo slug
	const category = await CategoryModel.findOne({
		slug: categorySlug,
		status: true,
	});

	if (!category) {
		throw new Errors.NotFoundError('Danh mục không tồn tại');
	}

	// Xây dựng query với category_slug
	const query = await buildProductQuery({
		category_slug: categorySlug,
		minPrice,
		maxPrice,
		condition,
		capacity,
		color,
		province,
		search,
	});

	const sortOptions = buildSortOptions(sortBy);
	const skip = (parseInt(page) - 1) * parseInt(limit);

	const [products, total] = await Promise.all([
		ProductModel.find(query)
			.sort(sortOptions)
			.skip(skip)
			.limit(parseInt(limit))
			.populate('userId', 'fullName avatar')
			.populate('categoryId', 'name slug')
			.lean(),
		ProductModel.countDocuments(query),
	]);

	return {
		id: category._id,
		slug: category.slug,
		products,
		categoryName: category.name,
		categorySlug: category.slug,
		pagination: {
			page: parseInt(page),
			limit: parseInt(limit),
			total,
			totalPages: Math.ceil(total / parseInt(limit)),
		},
	};
};

// Lấy danh sách sản phẩm group theo category cha
export const getProductsGroupedByCategory = async (limitPerCategory = 10) => {
	const categoriesWithProducts = await ProductModel.aggregate([
		// Chỉ lấy sản phẩm có activeStatus = "ACTIVE"
		{
			$match: {
				activeStatus: 'ACTIVE',
			},
		},

		// Join với collection categories để lấy thông tin danh mục
		{
			$lookup: {
				from: 'categories',
				localField: 'categoryId',
				foreignField: '_id',
				as: 'category',
			},
		},
		{ $unwind: '$category' },

		// Join với collection categories để lấy danh mục cha
		{
			$lookup: {
				from: 'categories',
				localField: 'category.parentId',
				foreignField: '_id',
				as: 'parentCategory',
			},
		},

		// Xử lý trường hợp có hoặc không có danh mục cha
		{
			$addFields: {
				targetCategory: {
					$cond: {
						if: { $gt: [{ $size: '$parentCategory' }, 0] },
						then: { $arrayElemAt: ['$parentCategory', 0] },
						else: '$category',
					},
				},
			},
		},

		// Group theo danh mục cha
		{
			$group: {
				_id: '$targetCategory._id',
				name: { $first: '$targetCategory.name' },
				slug: { $first: '$targetCategory.slug' },
				status: { $first: '$targetCategory.status' },
				image: { $first: '$targetCategory.image' },
				products: { $push: '$$ROOT' },
			},
		},

		// Chỉ lấy danh mục có trạng thái active
		{
			$match: {
				status: true,
			},
		},

		// Giới hạn số sản phẩm mỗi category
		{
			$project: {
				_id: 1,
				name: 1,
				slug: 1,
				status: 1,
				image: 1,
				products: { $slice: ['$products', limitPerCategory] },
			},
		},

		// Sắp xếp theo tên danh mục
		{
			$sort: { name: 1 },
		},
	]);

	return categoriesWithProducts;
};

// Lấy chi tiết sản phẩm
export const getProductById = async (productId) => {
	const product = await ProductModel.findOne({
		_id: productId,
		activeStatus: 'ACTIVE',
	})
		.populate('categoryId', 'name')
		.populate('brandId', 'name')
		.populate('userId', '_id');
	return product;
};

export const searchProducts = async (options = {}) => {
	const {
		q,
		page = 1,
		limit = 20,
		sortBy,
		brand,
		minPrice,
		maxPrice,
		province,
	} = options;

	// Xây dựng query tìm kiếm
	const searchQuery = await buildProductQuery({
		search: q,
		minPrice,
		maxPrice,
		province,
		brand,
	});

	const skip = (parseInt(page) - 1) * parseInt(limit);
	const sortOptions = buildSortOptions(sortBy);

	const [products, total] = await Promise.all([
		ProductModel.find(searchQuery)
			.sort(sortOptions)
			.skip(skip)
			.limit(limit)
			.filter((product) => product.activeStatus === 'ACTIVE'),
		ProductModel.countDocuments(searchQuery),
	]);

	return {
		products,
		pagination: {
			page: parseInt(page),
			limit: parseInt(limit),
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
};

// Cập nhật trạng thái hoạt động của sản phẩm (người bán)
export const updateProductStatus = async (productId, status) => {
	const product = await ProductModel.findById(productId);
	if (!product) {
		throw new Errors.NotFoundError('Không tìm thấy sản phẩm');
	}
	product.activeStatus = status;
	await product.save();
	return product;
};

// Cập nhật trạng thái duyệt của sản phẩm (admin)
export const updateProductVerifyStatus = async (productId, status) => {
	const product = await ProductModel.findById(productId);
	if (!product) {
		throw new Errors.NotFoundError('Không tìm thấy sản phẩm');
	}

	if (status === 'REJECTED') {
		product.activeStatus = 'INACTIVE';
	} else if (status === 'APPROVED') {
		product.activeStatus = 'ACTIVE';
	}

	product.verifyStatus = status;
	await product.save();
	return product;
};

// Lấy thống kê sản phẩm
export const getProductStats = async () => {
	try {
		const stats = await ProductModel.aggregate([
			{
				$group: {
					_id: null,
					total: { $sum: 1 },
					pending: {
						$sum: {
							$cond: [
								{
									$or: [
										{ $eq: ['$verifyStatus', 'PENDING'] },
										{ $eq: ['$status', 'PENDING'] },
									],
								},
								1,
								0,
							],
						},
					},
					approved: {
						$sum: {
							$cond: [
								{
									$or: [
										{ $eq: ['$verifyStatus', 'APPROVED'] },
										{ $eq: ['$status', 'APPROVED'] },
									],
								},
								1,
								0,
							],
						},
					},
					rejected: {
						$sum: {
							$cond: [
								{
									$or: [
										{ $eq: ['$verifyStatus', 'REJECTED'] },
										{ $eq: ['$status', 'REJECTED'] },
									],
								},
								1,
								0,
							],
						},
					},
					active: {
						$sum: {
							$cond: [
								{
									$or: [
										{ $eq: ['$activeStatus', 'ACTIVE'] },
										{ $eq: ['$status', 'ACTIVE'] },
									],
								},
								1,
								0,
							],
						},
					},
					inactive: {
						$sum: {
							$cond: [
								{
									$or: [
										{ $eq: ['$activeStatus', 'INACTIVE'] },
										{ $eq: ['$status', 'INACTIVE'] },
									],
								},
								1,
								0,
							],
						},
					},
				},
			},
		]);

		// Trả về object với giá trị mặc định nếu không có dữ liệu
		return (
			stats[0] || {
				total: 0,
				pending: 0,
				approved: 0,
				rejected: 0,
				active: 0,
				inactive: 0,
			}
		);
	} catch (error) {
		console.error('Error getting product stats:', error);
		throw new Errors.InternalServerError('Lỗi khi lấy thống kê sản phẩm');
	}
};
