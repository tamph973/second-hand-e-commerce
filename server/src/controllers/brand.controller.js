import * as BrandService from '../services/brand.service.js';
import Success from '../common/response/success.response.js';

export async function createBrand(req, res, next) {
	try {
		const brand = await BrandService.createBrand(req.body, req);

		return new Success.Created({
			message: 'Tạo thương hiệu mới thành công',
			data: brand,
		}).send(res);
	} catch (error) {
		next(error);
	}
}

export async function getAllBrands(req, res, next) {
	try {
		const brands = await BrandService.getAllBrands();
		return new Success.Ok({
			message: 'Lấy danh sách thương hiệu thành công',
			data: brands,
		}).send(res);
	} catch (error) {
		next(error);
	}
}

export async function deleteBrand(req, res, next) {
	try {
		const brand = await BrandService.deleteBrand(req.params.id);
		return new Success.Ok({
			message: 'Xóa thương hiệu thành công',
			data: brand,
		}).send(res);
	} catch (error) {
		next(error);
	}
}
