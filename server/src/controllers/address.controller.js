import * as AddressService from '../services/address.service.js';
import Success from '../common/response/success.response.js';

export async function createAddress(req, res) {
	try {
		const address = await AddressService.createAddress(
			req.user.id,
			req.body,
		);
		return new Success.Created({
			message: 'Tạo mới địa chỉ thành công',
			data: address,
		}).send(res);
	} catch (error) {
		const statusCode = error.status || 500;
		return res
			.status(statusCode)
			.json({ message: error.message || 'Lỗi tạo địa chỉ' });
	}
}

export async function updateAddress(req, res) {
	try {
		const address = await AddressService.updateAddress(
			req.user.id,
			req.params.id,
			req.body,
		);
		return new Success.Ok({
			message: 'Đã cập nhật địa chỉ',
			data: address,
		}).send(res);
	} catch (error) {
		const statusCode = error.status || 500;
		return res
			.status(statusCode)
			.json({ message: error.message || 'Lỗi cập nhật địa chỉ' });
	}
}

export async function deleteAddress(req, res) {
	try {
		const address = await AddressService.deleteAddress(
			req.user.id,
			req.params.id,
		);
		return new Success.Ok({
			message: 'Đã xóa địa chỉ',
			data: address,
		}).send(res);
	} catch (error) {
		const statusCode = error.status || 500;
		return res
			.status(statusCode)
			.json({ message: error.message || 'Lỗi xóa địa chỉ' });
	}
}

export async function getUserAddress(req, res) {
	try {
		const address = await AddressService.getUserAddress(req.user.id);
		return new Success.Ok({
			data: address,
		}).send(res);
	} catch (error) {
		const statusCode = error.status || 500;
		return res
			.status(statusCode)
			.json({ message: error.message || 'Lỗi lấy địa chỉ' });
	}
}

export async function setDefaultAddress(req, res) {
	try {
		await AddressService.setDefaultAddress(req.user.id, req.params.id);
		return new Success.Ok({
			message: 'Đã đặt địa chỉ mặc định',
		}).send(res);
	} catch (error) {
		const statusCode = error.status || 500;
		return res
			.status(statusCode)
			.json({ message: error.message || 'Lỗi lấy địa chỉ' });
	}
}

export async function getProvinceInProduct(req, res, next) {
	try {
		const result = await AddressService.getProvinceInProduct();
		return new Success.Ok({
			data: result,
			message: 'Lấy danh sách tỉnh thành từ sản phẩm thành công',
		}).send(res);
	} catch (error) {
		next(error);
	}
}
