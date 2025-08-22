import moment from 'moment';
import CategoryModel from '../models/category.model.js';
import OrderModel from '../models/order.model.js';
import BrandModel from '../models/brand.model.js';

export const toPhoneE164 = (phoneNumber) => {
	phoneNumber = phoneNumber.trim();
	if (phoneNumber.startsWith('+84')) return phoneNumber;
	if (phoneNumber.startsWith('84')) return '+' + phoneNumber;
	if (phoneNumber.startsWith('0')) return '+84' + phoneNumber.slice(1);
	throw new Error('Số điện thoại không hợp lệ');
};

// Tính tiền dự kiến của seller
export const calculateSellerAmount = (price) => {
	const SERVICE_FEE_RATE = 0.079;
	const PAYMENT_FEE_RATE = 0.02;
	const serviceFee = Math.round(price * SERVICE_FEE_RATE);
	const paymentFee = Math.round(price * PAYMENT_FEE_RATE);
	const netAmount = price - serviceFee - paymentFee;
	return netAmount;
};

// Hàm xây dựng sort options
export const buildSortOptions = (sortBy = 'createdAtDesc') => {
	const sortOptions = {};
	switch (sortBy) {
		case 'priceAsc':
			sortOptions.price = 1;
			break;
		case 'priceDesc':
			sortOptions.price = -1;
			break;
		case 'createdAtAsc':
			sortOptions.createdAt = 1;
			break;
		case 'createdAtDesc':
			sortOptions.createdAt = -1;
			break;
		default:
			sortOptions.createdAt = 1;
			break;
	}
	return sortOptions;
};

/**
 * Tạo chuỗi không dấu từ chuỗi tiếng Việt
 * @param {string} text - Chuỗi tiếng Việt
 * @returns {string} - Chuỗi không dấu
 */
export const createNonAccentPattern = (text) => {
	if (!text || typeof text !== 'string') return '';
	return text
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[đ]/g, 'd')
		.replace(/[Đ]/g, 'D')
		.trim();
};

/**
 * Tạo regex pattern tìm kiếm linh hoạt cho tiếng Việt
 * @param {string} searchTerm - Từ khóa tìm kiếm từ người dùng
 * @returns {string} - Chuỗi regex pattern kết hợp
 */
export const createSearchPatterns = (searchTerm) => {
	if (!searchTerm || typeof searchTerm !== 'string') return '';

	// 1. Chuẩn hóa từ khóa: bỏ dấu, viết thường, thay đ/Đ thành d
	const normalized = searchTerm
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[đ]/g, 'd')
		.replace(/[Đ]/g, 'D')
		.trim();

	// 2. Tách thành các từ riêng biệt
	const words = normalized.split(/\s+/).filter((word) => word.length > 0);

	// 3. Tạo các pattern tìm kiếm
	const patterns = new Set();
	// Hàm hỗ trợ escape ký tự đặc biệt trong regex
	const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

	// Thêm pattern gốc (giữ nguyên dấu)
	if (searchTerm.trim().length >= 2) {
		patterns.add(`\\b${escapeRegex(searchTerm.trim())}\\b`);
	}

	// Thêm các dạng biến thể của toàn bộ cụm từ
	if (normalized.length >= 3) {
		// Dạng đầy đủ không dấu
		patterns.add(`\\b${escapeRegex(normalized)}\\b`);

		// Dạng viết liền không dấu (cho trường hợp nhập liền)
		patterns.add(`\\b${escapeRegex(normalized.replace(/\s+/g, ''))}\\b`);

		// Dạng viết tắt (ví dụ: "dien thoai" -> "dt")
		if (words.length > 1) {
			const abbreviation = words.map((w) => w[0]).join('');
			patterns.add(`\\b${escapeRegex(abbreviation)}\\b`);
		}
	}

	// Thêm các dạng biến thể cho từng từ riêng lẻ
	// words.forEach((word) => {
	// 	if (word.length >= 2) {
	// 		// Từ đầy đủ không dấu
	// 		patterns.add(`\\b${escapeRegex(word)}\\b`);

	// 		// Các dạng viết tắt của từ (3 ký tự đầu, 4 ký tự đầu...)
	// 		for (let i = 3; i <= Math.min(5, word.length); i++) {
	// 			patterns.add(`\\b${escapeRegex(word.substring(0, i))}\\b`);
	// 		}

	// 		// Dạng phát âm tương tự (ví dụ: "thoai" thay vì "thoại")
	// 		if (word.length >= 4) {
	// 			patterns.add(
	// 				`\\b${escapeRegex(word.replace(/[ai]$/, 'ay'))}\\b`,
	// 			);
	// 			patterns.add(
	// 				`\\b${escapeRegex(word.replace(/[ay]$/, 'ai'))}\\b`,
	// 			);
	// 		}
	// 	}
	// });

	// Thêm pattern cho từng từ gốc (có dấu)
	const originalWords = searchTerm
		.trim()
		.split(/\s+/)
		.filter((word) => word.length > 0);
	originalWords.forEach((word) => {
		if (word.length >= 2) {
			patterns.add(`\\b${escapeRegex(word)}\\b`);
		}
	});

	return Array.from(patterns).join('|');
};

/**
 * Tạo query tìm kiếm chính xác cho MongoDB
 * @param {string} searchTerm - Từ khóa tìm kiếm
 * @returns {Object} - Query object cho MongoDB
 */
export const createExactSearchQuery = (searchTerm) => {
	if (!searchTerm || typeof searchTerm !== 'string') return {};

	const trimmedSearch = searchTerm.trim();
	if (trimmedSearch.length < 2) return {};

	// Tạo từ khóa không dấu
	const nonAccentSearch = createNonAccentPattern(trimmedSearch);

	// Escape ký tự đặc biệt cho regex
	const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

	// Tạo query tìm kiếm chính xác
	const searchConditions = [];

	// 1. Tìm kiếm chính xác với từ khóa gốc (ưu tiên cao nhất)
	const exactPattern = `\\b${escapeRegex(trimmedSearch)}\\b`;
	searchConditions.push(
		{ title: { $regex: exactPattern, $options: 'i' } },
		{ 'attributes.capacity': { $regex: exactPattern, $options: 'i' } },
		{ 'attributes.color': { $regex: exactPattern, $options: 'i' } },
	);

	// 2. Tìm kiếm với từ khóa không dấu (chỉ khi khác với gốc)
	if (nonAccentSearch !== trimmedSearch.toLowerCase()) {
		const nonAccentPattern = `\\b${escapeRegex(nonAccentSearch)}\\b`;
		searchConditions.push(
			{ title: { $regex: nonAccentPattern, $options: 'i' } },
			{
				'attributes.capacity': {
					$regex: nonAccentPattern,
					$options: 'i',
				},
			},
			{ 'attributes.color': { $regex: nonAccentPattern, $options: 'i' } },
		);
	}

	// 3. Tìm kiếm từng từ riêng lẻ (chỉ cho từ khóa có nhiều từ)
	const words = trimmedSearch.split(/\s+/).filter((word) => word.length >= 2);
	if (words.length > 1) {
		words.forEach((word) => {
			const wordPattern = `\\b${escapeRegex(word)}\\b`;
			searchConditions.push(
				{ title: { $regex: wordPattern, $options: 'i' } },
				{
					'attributes.capacity': {
						$regex: wordPattern,
						$options: 'i',
					},
				},
				{ 'attributes.color': { $regex: wordPattern, $options: 'i' } },
			);
		});
	}

	return { $or: searchConditions };
};

/**
 * Tạo query tìm kiếm tối ưu cho MongoDB
 * @param {string} searchTerm - Từ khóa tìm kiếm
 * @returns {Object} - Query object cho MongoDB
 */
export const createOptimizedSearchQuery = (searchTerm) => {
	if (!searchTerm || typeof searchTerm !== 'string') return {};

	// Tạo pattern tìm kiếm
	const searchPatterns = createSearchPatterns(searchTerm);
	const nonAccentSearch = createNonAccentPattern(searchTerm);

	// Tạo query tối ưu với ít điều kiện hơn
	const searchConditions = [];

	// 1. Tìm kiếm chính xác với từ khóa gốc (ưu tiên cao nhất)
	searchConditions.push(
		{
			title: {
				$regex: `\\b${searchTerm.replace(
					/[.*+?^${}()|[\]\\]/g,
					'\\$&',
				)}\\b`,
				$options: 'i',
			},
		},
		{
			'attributes.capacity': {
				$regex: `\\b${searchTerm.replace(
					/[.*+?^${}()|[\]\\]/g,
					'\\$&',
				)}\\b`,
				$options: 'i',
			},
		},
		{
			'attributes.color': {
				$regex: `\\b${searchTerm.replace(
					/[.*+?^${}()|[\]\\]/g,
					'\\$&',
				)}\\b`,
				$options: 'i',
			},
		},
	);

	// 2. Tìm kiếm với từ khóa không dấu (chỉ khi khác với gốc)
	if (nonAccentSearch !== searchTerm.toLowerCase()) {
		searchConditions.push(
			{
				title: {
					$regex: `\\b${nonAccentSearch.replace(
						/[.*+?^${}()|[\]\\]/g,
						'\\$&',
					)}\\b`,
					$options: 'i',
				},
			},
			{
				'attributes.capacity': {
					$regex: `\\b${nonAccentSearch.replace(
						/[.*+?^${}()|[\]\\]/g,
						'\\$&',
					)}\\b`,
					$options: 'i',
				},
			},
			{
				'attributes.color': {
					$regex: `\\b${nonAccentSearch.replace(
						/[.*+?^${}()|[\]\\]/g,
						'\\$&',
					)}\\b`,
					$options: 'i',
				},
			},
		);
	}

	// 3. Tìm kiếm với pattern phức tạp (chỉ cho từ khóa dài >= 4 ký tự)
	if (searchPatterns && searchTerm.length >= 4) {
		searchConditions.push(
			{ title: { $regex: searchPatterns, $options: 'i' } },
			{
				'attributes.capacity': {
					$regex: searchPatterns,
					$options: 'i',
				},
			},
			{ 'attributes.color': { $regex: searchPatterns, $options: 'i' } },
		);
	}

	// 4. Tìm kiếm từng từ riêng lẻ (chỉ cho từ khóa có nhiều từ)
	const words = searchTerm.split(/\s+/).filter((word) => word.length >= 2);
	if (words.length > 1) {
		words.forEach((word) => {
			const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			searchConditions.push(
				{ title: { $regex: `\\b${escapedWord}\\b`, $options: 'i' } },
				{
					'attributes.capacity': {
						$regex: `\\b${escapedWord}\\b`,
						$options: 'i',
					},
				},
				{
					'attributes.color': {
						$regex: `\\b${escapedWord}\\b`,
						$options: 'i',
					},
				},
			);
		});
	}

	return { $or: searchConditions };
};

export const buildProductQuery = async (options = {}) => {
	const {
		category_id = 'ALL',
		category_slug = 'ALL', // Thêm parameter mới cho slug
		search,
		status,
		minPrice = '',
		maxPrice = '',
		condition,
		capacity,
		color,
		sortBy,
		// Filter địa chỉ
		province,
		brand,
	} = options;

	const query = { _destroy: false };

	// Filter by category (including child categories)
	if (category_id !== 'ALL') {
		const childCategories = await CategoryModel.find({
			$or: [
				{ _id: category_id }, // Include the selected category itself
				{ parentId: category_id }, // And all its children
			],
		})
			.select('_id')
			.lean();

		query.categoryId = { $in: childCategories.map((cat) => cat._id) };
	}

	// Filter by category slug (including child categories) - ưu tiên hơn category_id
	if (category_slug !== 'ALL') {
		// Tìm danh mục cha theo slug
		const parentCategory = await CategoryModel.findOne({
			slug: category_slug,
			status: true,
		});

		if (parentCategory) {
			const childCategories = await CategoryModel.find({
				$or: [
					{ _id: parentCategory._id }, // Include the selected category itself
					{ parentId: parentCategory._id }, // And all its children
				],
			})
				.select('_id')
				.lean();

			query.categoryId = { $in: childCategories.map((cat) => cat._id) };
		}
	}

	// Search by keyword with exact matching
	if (search) {
		// const searchQuery = createExactSearchQuery(search);
		// if (searchQuery.$or && searchQuery.$or.length > 0) {
		// 	query.$or = searchQuery.$or;
		// }

		query.$or = [
			{ title: { $regex: search, $options: 'i' } },
			{ 'attributes.capacity': { $regex: search, $options: 'i' } },
			{ 'attributes.color': { $regex: search, $options: 'i' } },
		];
	}

	// Filter by status
	if (status) {
		query.verifyStatus = status;
	}

	if (minPrice !== '' || maxPrice !== '') {
		query.price = {};
		if (minPrice !== '') query.price.$gte = Number(minPrice);
		if (maxPrice !== '') query.price.$lte = Number(maxPrice);
	}

	// Filter by condition - hỗ trợ multiple conditions
	if (condition) {
		// Tách chuỗi conditions thành array (phân tách bằng dấu phẩy)
		const conditionNames = condition
			.split(',')
			.map((name) => name.trim())
			.filter((name) => name);

		if (conditionNames.length > 0) {
			if (conditionNames.length === 1) {
				query.condition = conditionNames[0];
			} else {
				query.condition = { $in: conditionNames };
			}
		}
	}

	// Filter by attributes
	if (capacity) {
		query['attributes.capacity'] = capacity;
	}
	if (color) {
		query['attributes.color'] = color;
	}

	// Filter by address - Province (hỗ trợ multiple provinces)
	if (province) {
		// Tách chuỗi provinces thành array (phân tách bằng dấu phẩy)
		const provinceCodes = province
			.split(',')
			.map((code) => code.trim())
			.filter((code) => code)
			.map((code) => Number(code));

		if (provinceCodes.length > 0) {
			if (provinceCodes.length === 1) {
				query['address.provinceCode'] = provinceCodes[0];
			} else {
				query['address.provinceCode'] = { $in: provinceCodes };
			}
		}
	}

	// Filter by brand - tìm kiếm theo tên thương hiệu (hỗ trợ multiple brands)
	if (brand) {
		// Tách chuỗi brands thành array (phân tách bằng dấu phẩy)
		const brandNames = brand
			.split(',')
			.map((name) => name.trim())
			.filter((name) => name);
		if (brandNames.length > 0) {
			// Tìm tất cả brands theo tên để lấy _id
			const brandDocs = await BrandModel.find({
				name: { $in: brandNames },
				status: true,
				_destroy: false,
			})
				.select('_id')
				.lean();

			if (brandDocs && brandDocs.length > 0) {
				const brandIds = brandDocs.map((doc) => doc._id);
				query.brandId = { $in: brandIds };
			}
		}
	}

	// Sort by
	if (sortBy) {
		query.sort = buildSortOptions(sortBy);
	}

	return query;
};

/**
 * Tạo mã đơn hàng theo quy tắc: thương hiệu + ngày đặt + số thứ tự đơn hàng
 * Ví dụ:  EC20241201001 (EC + 20241201 + 001)
 */
export const generateOrderCode = async (brand = 'EC') => {
	try {
		// Lấy ngày hiện tại theo format DDMMYYYY
		const today = new Date();
		const dateString = moment(today).format('DDMMYYYY');

		// Tìm số thứ tự đơn hàng trong ngày hôm nay
		const startOfDay = moment(today).startOf('day').toDate();
		const endOfDay = moment(today).endOf('day').toDate();

		const todayOrders = await OrderModel.countDocuments({
			createdAt: {
				$gte: startOfDay,
				$lt: endOfDay,
			},
		});

		// Số thứ tự = số đơn hàng hôm nay + 1
		const orderNumber = todayOrders + 1;

		// Format số thứ tự thành 3 chữ số (001, 002, ...)
		const formattedOrderNumber = orderNumber.toString().padStart(3, '0');

		// Tạo mã đơn hàng
		const orderCode = `${brand}${dateString}${formattedOrderNumber}`;

		return orderCode;
	} catch (error) {
		throw new Error(`Lỗi tạo mã đơn hàng: ${error.message}`);
	}
};
