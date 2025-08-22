import * as VariantService from '../services/variant.service.js';
import Success from '../common/response/success.response.js';

export const getVariantsByProduct = async (req, res, next) => {
	try {
		const { productId } = req.params;
		const variants = await VariantService.getVariantsByProduct(productId);

		return new Success.Ok({
			message: 'Lấy danh sách biến thể thành công',
			data: variants,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

export const createVariants = async (req, res, next) => {
	try {
		const { productId } = req.params;
		const { variants } = req.body;

		if (!variants || !Array.isArray(variants) || variants.length === 0) {
			return res.status(400).json({
				success: false,
				message: 'Dữ liệu biến thể không hợp lệ',
			});
		}

		const createdVariants = await VariantService.createVariants(
			productId,
			variants,
		);

		return Success.Created({
			message: 'Tạo biến thể thành công',
			data: createdVariants,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

export const updateVariant = async (req, res, next) => {
	try {
		const { variantId } = req.params;
		const updateData = req.body;

		const variant = await VariantService.updateVariant(
			variantId,
			updateData,
		);

		return Success.OK({
			message: 'Cập nhật biến thể thành công',
			data: variant,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

export const deleteVariant = async (req, res, next) => {
	try {
		const { variantId } = req.params;
		const result = await VariantService.deleteVariant(variantId);

		return Success.OK({
			message: result.message,
		}).send(res);
	} catch (error) {
		next(error);
	}
};
