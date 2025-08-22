import BrandModel from '../models/brand.model.js';
import { uploadImagesService } from './upload.service.js';
import Errors from '../common/response/error.response.js';

export const createBrand = async (brandData, req) => {
	// Validation
	if (!brandData.name || brandData.name.trim().length === 0) {
		throw new Errors.BadRequestError('Tên thương hiệu không được để trống');
	}

	// Kiểm tra thương hiệu đã tồn tại
	const existingBrand = await BrandModel.findOne({
		name: { $regex: new RegExp(`^${brandData.name.trim()}$`, 'i') },
	});

	if (existingBrand) {
		throw new Errors.BadRequestError('Thương hiệu này đã tồn tại');
	}
	let imageData = { url: '', public_id: '' };
	if (req.file) {
		const uploadedImage = await uploadImagesService(req, 'brand');
		if (uploadedImage) {
			imageData = uploadedImage[0];
		}
	}

	const payload = {
		name: brandData.name.trim(),
		image: imageData,
		status: brandData.status || true,
	};

	// Tạo thương hiệu mới
	const brand = await BrandModel.create(payload);
	return brand;
};

export const getAllBrands = async () => {
	const brands = await BrandModel.find({ _destroy: false })
		.sort({
			name: 1, // Sắp xếp theo tên tăng dần từ A-Z
		})
		.select('-__v');
	return brands;
};

export const deleteBrand = async (id) => {
	const brand = await BrandModel.findByIdAndUpdate(id, { _destroy: true });
	return brand;
};

export const updateBrand = async (id, brandData) => {
	const brand = await BrandModel.findByIdAndUpdate(id, brandData);
	return brand;
};

export const getBrandById = async (id) => {
	const brand = await BrandModel.findById(id);
	return brand;
};
