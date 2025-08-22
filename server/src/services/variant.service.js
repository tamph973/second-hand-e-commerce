import VariantModel from '../models/variant.model.js';
import ProductModel from '../models/product.model.js';
import Errors from '../common/response/error.response.js';

export const createVariants = async (productId, variantsData) => {
	try {
		if (
			!variantsData ||
			!Array.isArray(variantsData) ||
			variantsData.length === 0
		) {
			return [];
		}

		// Kiểm tra product có tồn tại không
		const product = await ProductModel.findById(productId);
		if (!product) {
			throw new Errors.NotFoundError('Không tìm thấy sản phẩm');
		}

		// Tạo variants
		const variants = await VariantModel.create(
			variantsData.map((variant) => ({
				...variant,
				productId,
			})),
		);

		// Cập nhật priceRange của product
		const allPrices = [
			product.price,
			...variants.map((variant) => variant.price),
		].filter((price) => price > 0);

		if (allPrices.length > 0) {
			const priceRange = {
				min: Math.min(...allPrices),
				max: Math.max(...allPrices),
			};

			await ProductModel.findByIdAndUpdate(productId, { priceRange });
		}

		return variants;
	} catch (error) {
		throw new Errors.BadRequestError(`Lỗi tạo biến thể: ${error.message}`);
	}
};

export const getVariantsByProduct = async (productId) => {
	try {
		const variants = await VariantModel.find({
			productId,
			status: { $ne: 'INACTIVE' },
		}).sort({ createdAt: 1 });

		return variants;
	} catch (error) {
		throw new Errors.BadRequestError(`Lỗi lấy biến thể: ${error.message}`);
	}
};

export const updateVariant = async (variantId, updateData) => {
	try {
		const variant = await VariantModel.findByIdAndUpdate(
			variantId,
			updateData,
			{ new: true },
		);

		if (!variant) {
			throw new Errors.NotFoundError('Không tìm thấy biến thể');
		}

		// Cập nhật priceRange của product
		await updateProductPriceRange(variant.productId);

		return variant;
	} catch (error) {
		throw new Errors.BadRequestError(
			`Lỗi cập nhật biến thể: ${error.message}`,
		);
	}
};

export const deleteVariant = async (variantId) => {
	try {
		const variant = await VariantModel.findByIdAndDelete(variantId);

		if (!variant) {
			throw new Errors.NotFoundError('Không tìm thấy biến thể');
		}

		// Cập nhật priceRange của product
		await updateProductPriceRange(variant.productId);

		return { message: 'Xóa biến thể thành công' };
	} catch (error) {
		throw new Errors.BadRequestError(`Lỗi xóa biến thể: ${error.message}`);
	}
};

export const updateProductPriceRange = async (productId) => {
	try {
		const product = await ProductModel.findById(productId);
		const variants = await VariantModel.find({
			productId,
			status: { $ne: 'INACTIVE' },
		});

		if (!product) return;

		const allPrices = [
			product.price,
			...variants.map((variant) => variant.price),
		].filter((price) => price > 0);

		if (allPrices.length > 0) {
			const priceRange = {
				min: Math.min(...allPrices),
				max: Math.max(...allPrices),
			};

			await ProductModel.findByIdAndUpdate(productId, { priceRange });
		}
	} catch (error) {
		console.error('Lỗi cập nhật priceRange:', error);
	}
};
