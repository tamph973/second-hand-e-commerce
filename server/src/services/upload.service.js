import { cloudinaryUploadImage, cloudinaryDeleteImage } from '../services/cloudinary.service.js';
import { getImageFolder } from '../utils/folderConfig.js';

export const uploadImagesService = async (req, type) => {
	try {
		let uploadedImages = [];
		let imageFolder = getImageFolder(type); // Lấy thư mục tương ứng với loại ảnh
		if (!imageFolder) {
			throw new Error('Invalid image type provided');
		}

		// Nếu là upload nhiều ảnh
		if (req.files && req.files.length > 0) {
			for (let image of req.files) {
				const upload = await cloudinaryUploadImage(image, imageFolder);
				uploadedImages.push(upload);
			}
		} else if (req.file) {
			const upload = await cloudinaryUploadImage(req.file, imageFolder);
			uploadedImages.push(upload);
		}

		return uploadedImages;
	} catch (error) {
		throw new Error(`Failed to upload images: ${error.message}`);
	}
};

export const deleteImages = async (publicIds) => {
	try {
		if (!publicIds || publicIds.length === 0) {
			throw new Error('Không có ảnh để xoá');
		}

		// Xóa từng ảnh từ Cloudinary
		for (let publicId of publicIds) {
			await cloudinaryDeleteImage(publicId); // Xóa ảnh theo public_id
		}
	} catch (error) {
		throw new Error(`Failed to delete images: ${error.message}`);
	}
};
