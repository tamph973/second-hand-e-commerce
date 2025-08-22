import * as CategoryService from '../services/category.service.js';
import Success from '../common/response/success.response.js';
import Error from '../common/response/error.response.js';

export async function createCategory(req, res, next) {
	try {
		const category = await CategoryService.createCategory(req.body, req);

		return new Success.Created({
			message: 'Tạo danh mục mới thành công',
			data: category,
		}).send(res);
	} catch (error) {
		next(error);
	}
}

export async function getAllCategory(req, res, next) {
	try {
		const { search } = req.query;

		const filters = {};
		if (search) {
			filters.search = search.trim();
		}

		const categories = await CategoryService.getAllCategory(filters);

		return new Success.Ok({
			message: 'Lấy danh sách danh mục cha thành công',
			data: categories,
		}).send(res);
	} catch (error) {
		next(error);
	}
}

export async function getCategoryChildren(req, res, next) {
	try {
		const categories = await CategoryService.getCategoryChildren(
			req.params.parentId,
			req.query,
		);

		return new Success.Ok({
			message: 'Lấy danh sách danh mục con thành công',
			data: categories,
		}).send(res);
	} catch (error) {
		next(error);
	}
}

// API lấy tree danh mục
export async function getCategoryTree(req, res, next) {
	try {
		const tree = await CategoryService.getCategoryTree();
		return new Success.Ok({
			message: 'Lấy tree danh mục thành công',
			data: tree,
		}).send(res);
	} catch (error) {
		next(error);
	}
}

export async function getCategoryById(req, res, next) {
	try {
		const category = await CategoryService.getCategoryById(req.params.id);

		return new Success.Ok({
			message: 'Lấy thông tin danh mục thành công',
			data: category,
		}).send(res);
	} catch (error) {
		next(error);
	}
}

export async function updateCategory(req, res, next) {
	try {
		const category = await CategoryService.updateCategory(
			req.params.id,
			req.body,
			req,
		);

		return new Success.Ok({
			message: 'Cập nhật danh mục thành công',
			data: category,
		}).send(res);
	} catch (error) {
		// Xử lý lỗi upload riêng biệt
		if (error.message.includes('Upload ảnh thất bại')) {
			return new Error.BadRequest({
				message: error.message,
			}).send(res);
		}
		next(error);
	}
}

export async function deleteCategory(req, res, next) {
	try {
		const { id } = req.params;

		if (!id) {
			return new Error.BadRequest({
				message: 'ID danh mục không hợp lệ',
			}).send(res);
		}

		const result = await CategoryService.deleteCategory(id);

		return new Success.OK({
			message: result.message,
		}).send(res);
	} catch (error) {
		next(error);
	}
}

export const getCategoryByShop = async (req, res, next) => {
	try {
		const categories = await CategoryService.getCategoryByShop(
			req.params.shopId,
		);
		return new Success.Ok({
			message: 'Lấy danh mục theo shop thành công',
			data: categories,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

export const getSubCategories = async (req, res, next) => {
	try {
		const categories = await CategoryService.getSubCategories();
		return new Success.Ok({
			message: 'Lấy danh mục con thành công',
			data: categories,
		}).send(res);
	} catch (error) {
		next(error);
	}
};

export const updateCategoryStatus = async (req, res, next) => {
	try {
		console.log('req.body :>> ', req.body);
		const category = await CategoryService.updateCategoryStatus(
			req.params.id,
			req.body.status,
		);
		return new Success.Ok({
			message: 'Cập nhật trạng thái danh mục thành công',
			data: category,
		}).send(res);
	} catch (error) {
		next(error);
	}
};