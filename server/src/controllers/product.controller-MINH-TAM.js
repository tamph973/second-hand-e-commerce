import * as ProductService from '../services/product.service.js';
import Success from '../common/response/success.response.js';

export const createProduct = async (req, res, next) => {
	try {
		const product = await ProductService.createProduct(
			req.user.id,
			req.body,
			req,
		);
		return new Success.Created({
			message: 'Tạo sản phẩm thành công',
			data: product,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

// export const createProductWithVariants = async (req, res, next) => {
// 	try {
// 		const result = await ProductService.createProductWithVariants(
// 			req.user.id,
// 			req.body,
// 			req,
// 		);

// 		const message =
// 			req.body.type === 'MULTIPLE'
// 				? 'Tạo sản phẩm và biến thể thành công'
// 				: 'Tạo sản phẩm thành công';

// 		return new Success.Created({
// 			message,
// 			data: result,
// 		}).send(res);
// 	} catch (error) {
// 		next(error);
// 	}
// };

// Lấy danh sách sản phẩm của bạn
export const getMyProducts = async (req, res, next) => {
	try {
		const { page = 1, limit = 10 } = req.query;
		const result = await ProductService.getProductsBySeller(
			req.user.id,
			parseInt(page),
			parseInt(limit),
		);

		return new Success.Ok({
			message: 'Lấy danh sách sản phẩm của bạn thành công',
			data: result,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

export const updateProduct = async (req, res, next) => {
	try {
		const { productId } = req.params;
		const product = await ProductService.updateProduct(
			req.user.id,
			productId,
			req.body,
		);

		return new Success.Ok({
			message: 'Cập nhật sản phẩm thành công',
			data: product,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

export const deleteProduct = async (req, res, next) => {
	try {
		const { productId } = req.params;
		const result = await ProductService.deleteProduct(
			req.user.id,
			productId,
		);

		return new Success.Ok({
			message: result.message,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

// Lấy danh sách sản phẩm
export const getAllProducts = async (req, res, next) => {
	try {
		const result = await ProductService.getAllProducts(req.query);
		return new Success.Ok({
			message: 'Lấy danh sách sản phẩm thành công',
			data: result,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

// Lấy sản phẩm theo slug danh mục
export const getProductsByCategorySlug = async (req, res, next) => {
	try {
		const { categorySlug } = req.params;
		const result = await ProductService.getProductsByCategorySlug(
			categorySlug,
			req.query,
		);

		return new Success.Ok({
			message: `Lấy sản phẩm theo danh mục ${result.categoryName} thành công`,
			data: result,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

// Lấy chi tiết sản phẩm
export const getProductById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await ProductService.getProductById(id);
		return new Success.Ok({
			message: 'Lấy chi tiết sản phẩm thành công',
			data: result,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

// Lấy sản phẩm theo shop
export const getProductsByShop = async (req, res, next) => {
	try {
		const { shopId } = req.params;
		const result = await ProductService.getProductsByShop(shopId);
		return new Success.Ok({
			message: 'Lấy danh sách sản phẩm theo shop thành công',
			data: result,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

export const getProductsGroupedByCategory = async (req, res, next) => {
	try {
		const result = await ProductService.getProductsGroupedByCategory();
		return new Success.Ok({
			message: 'Lấy danh sách sản phẩm nhóm theo danh mục',
			data: result,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

export const getProductsBySeller = async (req, res, next) => {
	try {
		const { sellerId } = req.params;
		const products = await ProductService.getProductsBySeller(
			sellerId,
			req.query,
		);
		return new Success.Ok({
			message: 'Lấy tất cả sản phẩm theo người bán thành công',
			data: products,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

// Tìm kiếm sản phẩm
export const searchProducts = async (req, res, next) => {
	try {
		const result = await ProductService.searchProducts(req.query);
		return new Success.Ok({
			message: 'Tìm kiếm sản phẩm thành công',
			data: result,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

// Lấy thống kê sản phẩm
export const getProductStats = async (req, res, next) => {
	try {
		const stats = await ProductService.getProductStats();
		return new Success.Ok({
			message: 'Lấy thống kê sản phẩm thành công',
			data: stats,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

export const updateProductVerifyStatus = async (req, res, next) => {
	try {
		const result = await ProductService.updateProductVerifyStatus(
			req.body.productId,
			req.body.status,
		);
		return new Success.Ok({
			message: 'Cập nhật trạng thái duyệt sản phẩm thành công',
			data: result,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

export const updateProductStatus = async (req, res, next) => {
	try {
		const result = await ProductService.updateProductStatus(
			req.body.productId,
			req.body.status,
		);
		return new Success.Ok({
			message: 'Cập nhật trạng thái sản phẩm thành công',
			data: result,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

export const getNewestProducts = async (req, res, next) => {
	try {
		const products = await ProductService.getNewestProducts();
		return new Success.Ok({
			message: 'Lấy sản phẩm mới nhất thành công',
			data: products,
		}).send(res);
	} catch (error) {
		next(error);
	}
};