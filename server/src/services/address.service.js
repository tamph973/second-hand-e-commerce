import AddressModel from '../models/address.model.js';
import Errors from '../common/response/error.response.js';
import UserModel from '../models/user.model.js';
import ProductModel from '../models/product.model.js';

export async function createAddress(userId, data) {
	// Nếu địa chỉ mới được đánh dấu là mặc định, hủy bỏ mặc định của các địa chỉ khác
	if (data.isDefault) {
		await AddressModel.updateMany({ userId }, { isDefault: false });
	}

	const newAddress = await AddressModel.create({ userId, ...data });

	const user = await UserModel.findById(userId);
	user.address = newAddress._id;
	await user.save();

	return await AddressModel.find({ userId, _destroy: false }).sort({
		isDefault: -1,
		createdAt: -1,
	});
}

export async function updateAddress(userId, addressId, data) {
	const existingAddress = await AddressModel.findOne({
		_id: addressId,
		userId,
	});
	if (!existingAddress) {
		throw new Errors.BadRequestError(
			'Không tìm thấy địa chỉ hoặc không có quyền truy cập',
		);
	}

	if (data.isDefault) {
		await AddressModel.updateMany(
			{ userId, _id: { $ne: addressId } },
			{ isDefault: false },
		);
	}

	await AddressModel.findByIdAndUpdate(
		{ _id: addressId, userId },
		{ $set: data },
		{ new: true },
	);

	// Trả về danh sách địa chỉ đã sắp xếp
	return await AddressModel.find({ userId, _destroy: false }).sort({
		isDefault: -1,
		createdAt: -1,
	});
}

export async function deleteAddress(userId, addressId) {
	const existingAddress = await AddressModel.findOne({ _id: addressId });
	if (!existingAddress) {
		throw new Errors.BadRequestError('Không tìm thấy địa chỉ');
	}

	return await AddressModel.findOneAndUpdate(
		{ _id: addressId, userId },
		{ _destroy: true },
		{ new: true },
	);
}

export async function getUserAddress(userId) {
	return await AddressModel.find({ userId, _destroy: false }).sort({
		isDefault: -1,
		createdAt: -1,
	});
}

export async function setDefaultAddress(userId, addressId) {
	const existingAddress = await AddressModel.findOne({
		_id: addressId,
		userId,
	});
	if (!existingAddress) {
		throw new Errors.BadRequestError('Không tìm thấy địa chỉ');
	}

	await AddressModel.updateMany({ userId }, { isDefault: false });

	return await AddressModel.findByIdAndUpdate(
		{ _id: addressId, userId },
		{ isDefault: true },
		{ new: true },
	);
}

// Lấy những tên tỉnh mà chỉ có trong sản phẩm
export async function getProvinceInProduct() {
		const products = await ProductModel.find({
			'address.provinceCode': { $exists: true, $ne: null },
			'address.provinceName': { $exists: true, $ne: null },
		}).select('address.provinceCode address.provinceName');

		// Tạo Set để loại bỏ duplicate
		const uniqueProvinces = new Set();
		const provinces = [];

		products.forEach((product) => {
			if (
				product.address &&
				product.address.provinceCode &&
				product.address.provinceName
			) {
				const provinceKey = `${product.address.provinceCode}-${product.address.provinceName}`;

				if (!uniqueProvinces.has(provinceKey)) {
					uniqueProvinces.add(provinceKey);
					provinces.push({
						code: product.address.provinceCode,
						name: product.address.provinceName,
					});
				}
			}
		});

		// Sắp xếp theo tên tỉnh
		provinces.sort((a, b) => a.name.localeCompare(b.name, 'vi'));

		return provinces;
}
