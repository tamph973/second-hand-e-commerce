import { VARIANT_OPTIONS } from '@/constants/productOptions';

/**
 * Mapping từ tên option sang key
 */
export const OPTION_NAME_TO_KEY = {
	'Màu sắc': 'color',
	'Kích thước': 'size',
	'Thương hiệu': 'brand',
	'Dung lượng': 'capacity',
	'Chất liệu': 'material',
};


/**
 * Để tạo ra tất cả biến thể có thể có của sản phẩm
 * Generate all possible combinations from variant options
 * @param {Array} options - Array of option objects with name and value array
 * @returns {Array} Array of combination objects
 * 
 * // Input options:
[
  { name: "Màu sắc", value: ["Đỏ", "Xanh"] },
  { name: "Kích thước", value: ["S", "M", "L"] }
]
 * // Output combinations:
[
  [{ name: "Màu sắc", value: "Đỏ" }, { name: "Kích thước", value: "S" }],
  [{ name: "Màu sắc", value: "Đỏ" }, { name: "Kích thước", value: "M" }],
  [{ name: "Màu sắc", value: "Đỏ" }, { name: "Kích thước", value: "L" }],
  [{ name: "Màu sắc", value: "Xanh" }, { name: "Kích thước", value: "S" }],
  [{ name: "Màu sắc", value: "Xanh" }, { name: "Kích thước", value: "M" }],
  [{ name: "Màu sắc", value: "Xanh" }, { name: "Kích thước", value: "L" }]
]
 */
export const generateCombinations = (options) => {
	if (!options || options.length === 0) return [];

	if (options.length === 1) {
		const key = OPTION_NAME_TO_KEY[options[0].name] || options[0].name;
		return options[0].value.map((value) => [
			{
				name: key,
				value: value,
			},
		]);
	}

	const [first, ...rest] = options;
	const key = OPTION_NAME_TO_KEY[first.name] || first.name;
	const subCombinations = generateCombinations(rest);

	return first.value.flatMap((value) =>
		subCombinations.map((combo) => [{ name: key, value }, ...combo]),
	);
};

/**
 * Để có danh sách biến thể hoàn chỉnh với giá, stock, trạng thái
 * Generate variants from options and existing price/stock data
 * @param {Array} options - Array of option objects
 * @param {Map} priceStockMap - Map of existing price/stock data
 * @param {number} basePrice - Base price for new variants
 * @returns {Array} Array of variant objects
 * 
 * 
 // Input:
options = [
  { name: "Màu sắc", value: ["Đỏ", "Xanh"] },
  { name: "Kích thước", value: ["S", "M"] }
]
basePrice = 100000
priceStockMap = new Map([
  ["Đỏ-S", { price: 120000, stock: 10, isActive: true }],
  ["Đỏ-M", { price: 130000, stock: 5, isActive: true }]
])

// Output:
[
  { code: "Đỏ-S", combination: [{ name: "Màu sắc", value: "Đỏ" }, { name: "Kích thước", value: "S" }], price: 120000, stock: 10, isActive: true },
  { code: "Đỏ-M", combination: [{ name: "Màu sắc", value: "Đỏ" }, { name: "Kích thước", value: "M" }], price: 130000, stock: 5, isActive: true },
  { code: "Xanh-S", combination: [{ name: "Màu sắc", value: "Xanh" }, { name: "Kích thước", value: "S" }], price: 100000, stock: 0, isActive: false },
  { code: "Xanh-M", combination: [{ name: "Màu sắc", value: "Xanh" }, { name: "Kích thước", value: "M" }], price: 100000, stock: 0, isActive: false }
]
 */
export const generateVariants = (
	options,
	priceStockMap = new Map(),
	basePrice = 0,
) => {
	if (!options || options.length === 0) return [];

	// Validate all options have name and values
	// const isValid = options.every(
	// 	(option) =>
	// 		option.name &&
	// 		option.value &&
	// 		option.value.length > 0 &&
	// 		option.value.every((val) => val.trim() !== ''),
	// );

	// if (!isValid) return [];

	// Generate all combinations
	const combinations = generateCombinations(options);

	return combinations.map((combination) => {
		const code = combination.map((item) => item.value).join('-');
		const existingData = priceStockMap.get(code);

		return {
			code,
			combination,
			price: existingData?.price || basePrice,
			stock: existingData?.stock || 0,
			isActive: existingData?.isActive !== false,
		};
	});
};

/**
 * Validate variant options
 * @param {Array} options - Array of option objects
 * @returns {Object} Validation result with isValid and errors
 *  // Input hợp lệ:
[
  { name: "Màu sắc", value: ["Đỏ", "Xanh"] },
  { name: "Kích thước", value: ["S", "M"] }
]
// Output: { isValid: true, errors: [] }

// Input không hợp lệ:
[
  { name: "", value: ["Đỏ"] }, // Tên rỗng
  { name: "Kích thước", value: ["S", ""] } // Giá trị rỗng
]
// Output: { 
//   isValid: false, 
//   errors: [
//     "Bộ chọn 1: Tên không được để trống",
//     "Bộ chọn 2, Giá trị 2: Không được để trống"
//   ] 
 */
export const validateVariantOptions = (options) => {
	const errors = [];

	if (!options || options.length === 0) {
		return { isValid: false, errors: ['Phải có ít nhất một bộ chọn'] };
	}

	options.forEach((option, index) => {
		if (!option.name || option.name.trim() === '') {
			errors.push(`Bộ chọn ${index + 1}: Tên không được để trống`);
		}

		if (!option.value || option.value.length === 0) {
			errors.push(`Bộ chọn ${index + 1}: Phải có ít nhất một giá trị`);
		} else {
			option.value.forEach((value, valueIndex) => {
				if (!value || value.trim() === '') {
					errors.push(
						`Bộ chọn ${index + 1}, Giá trị ${
							valueIndex + 1
						}: Không được để trống`,
					);
				}
			});
		}
	});

	return {
		isValid: errors.length === 0,
		errors,
	};
};

/**
 * Format variant code for display
 * @param {Array} combination - Array of combination objects
 * @returns {string} Formatted variant code
 */
export const formatVariantCode = (combination) => {
	return combination.map((item) => `${item.name}: ${item.value}`).join(' | ');
};

/**
 * Get active variants only
 * @param {Array} variants - Array of variant objects
 * @returns {Array} Array of active variants
 */
export const getActiveVariants = (variants) => {
	return variants.filter((variant) => variant.isActive);
};

/**
 * Calculate total stock from variants
 * @param {Array} variants - Array of variant objects
 * @returns {number} Total stock
 */
export const calculateTotalStock = (variants) => {
	return variants.reduce((total, variant) => {
		return total + (variant.isActive ? variant.stock || 0 : 0);
	}, 0);
};

/**
 * Get price range from variants
 * @param {Array} variants - Array of variant objects
 * @returns {Object} Price range with min and max
 */
export const getPriceRange = (variants) => {
	const activeVariants = getActiveVariants(variants);

	if (activeVariants.length === 0) {
		return { min: 0, max: 0 };
	}

	const prices = activeVariants.map((variant) => variant.price || 0);
	return {
		min: Math.min(...prices),
		max: Math.max(...prices),
	};
};

/**
 * Get option label from code
 * @param {string} code - Option code
 * @returns {string} Option label
 */
export const getOptionLabel = (code) => {
	const found = VARIANT_OPTIONS.find((opt) => opt.value === code);
	return found ? found.label : code;
};

/**
 * Get value label from option code and value code
 * @param {string} optionCode - Option code
 * @param {string} valueCode - Value code
 * @returns {string} Value label
 */
export const getValueLabel = (optionCode, valueCode) => {
	const found = VARIANT_OPTIONS.find((opt) => opt.value === optionCode);
	if (!found) return valueCode;
	const val = found.options.find((v) => v.value === valueCode);
	return val ? val.label : valueCode;
};

/**
 * Generate SKU code from combination
 * @param {Array} combination - Array of combination objects
 * @returns {string} SKU code
 */
export const generateSKU = (combination) => {
	return combination.map((item) => item.value).join('-');
};

/**
 * Check if variant has stock
 * @param {Object} variant - Variant object
 * @returns {boolean} True if variant has stock
 */
export const hasStock = (variant) => {
	return variant.isActive && (variant.stock || 0) > 0;
};

/**
 * Get variant display name
 * @param {Array} combination - Array of combination objects
 * @returns {string} Display name
 */
export const getVariantDisplayName = (combination) => {
	return combination.map((item) => `${item.name}: ${item.value}`).join(' | ');
};
