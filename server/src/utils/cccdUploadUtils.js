import { uploadImagesService } from '../services/upload.service.js';
import Errors from '../common/response/error.response.js';

/**
 * Xử lý upload ảnh CCCD với field names cụ thể
 * @param {Object} req - Request object
 * @returns {Promise<Object>} Object chứa ảnh mặt trước và mặt sau
 */
export const handleCCCDUpload = async (req) => {
	let cccdFrontImageData = { url: '', public_id: '' };
	let cccdBackImageData = { url: '', public_id: '' };
	try {
		// Kiểm tra xem có sử dụng field names cụ thể không
		if (req.files && req.files.cccdFront && req.files.cccdBack) {
			// Sử dụng field names cụ thể (recommended)
			const frontFile = req.files.cccdFront[0];
			const backFile = req.files.cccdBack[0];

			// Tạo request object riêng cho từng file
			const frontReq = { ...req, files: [frontFile] };
			const backReq = { ...req, files: [backFile] };

			const frontUploaded = await uploadImagesService(
				frontReq,
				'authentication',
			);
			const backUploaded = await uploadImagesService(
				backReq,
				'authentication',
			);

			if (frontUploaded && frontUploaded.length > 0) {
				cccdFrontImageData = frontUploaded[0];
			}
			if (backUploaded && backUploaded.length > 0) {
				cccdBackImageData = backUploaded[0];
			}
		} else if (
			req.files &&
			Array.isArray(req.files) &&
			req.files.length >= 2
		) {
			// Sử dụng array upload (fallback)
			const uploadedImages = await uploadImagesService(
				req,
				'authentication',
			);

			if (uploadedImages && uploadedImages.length >= 2) {
				// Phân biệt mặt trước và mặt sau dựa trên tên file
				const frontImage = uploadedImages.find(
					(img) =>
						img.originalname?.toLowerCase().includes('front') ||
						img.originalname?.toLowerCase().includes('mat_truoc') ||
						img.originalname?.toLowerCase().includes('truoc') ||
						img.fieldname?.toLowerCase().includes('front'),
				);

				const backImage = uploadedImages.find(
					(img) =>
						img.originalname?.toLowerCase().includes('back') ||
						img.originalname?.toLowerCase().includes('mat_sau') ||
						img.originalname?.toLowerCase().includes('sau') ||
						img.fieldname?.toLowerCase().includes('back'),
				);

				// Nếu không có tên cụ thể, dùng thứ tự upload
				if (frontImage && backImage) {
					cccdFrontImageData = frontImage;
					cccdBackImageData = backImage;
				} else {
					// Fallback: ảnh đầu tiên là mặt trước, ảnh thứ hai là mặt sau
					cccdFrontImageData = uploadedImages[0];
					cccdBackImageData = uploadedImages[1];
				}
			}
		} else {
			throw new Errors.BadRequestError(
				'Vui lòng upload đầy đủ ảnh mặt trước và mặt sau CCCD',
			);
		}

		// Kiểm tra xem có upload thành công không
		if (!cccdFrontImageData.url || !cccdBackImageData.url) {
			throw new Errors.BadRequestError(
				'Upload ảnh thất bại, vui lòng thử lại',
			);
		}

		return {
			front: cccdFrontImageData,
			back: cccdBackImageData,
		};
	} catch (error) {
		throw new Errors.BadRequestError(
			`Lỗi upload ảnh CCCD: ${error.message}`,
		);
	}
};

/**
 * Validate ảnh CCCD
 * @param {Object} frontImage - Ảnh mặt trước
 * @param {Object} backImage - Ảnh mặt sau
 * @returns {boolean}
 */
export const validateCCCDImages = (frontImage, backImage) => {
	// Kiểm tra định dạng file
	const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

	if (!allowedTypes.includes(frontImage.mimetype)) {
		throw new Errors.BadRequestError(
			'Ảnh mặt trước phải có định dạng JPG, JPEG hoặc PNG',
		);
	}

	if (!allowedTypes.includes(backImage.mimetype)) {
		throw new Errors.BadRequestError(
			'Ảnh mặt sau phải có định dạng JPG, JPEG hoặc PNG',
		);
	}

	// Kiểm tra kích thước file (tối đa 5MB)
	const maxSize = 5 * 1024 * 1024; // 5MB

	if (frontImage.size > maxSize) {
		throw new Errors.BadRequestError(
			'Ảnh mặt trước không được vượt quá 5MB',
		);
	}

	if (backImage.size > maxSize) {
		throw new Errors.BadRequestError('Ảnh mặt sau không được vượt quá 5MB');
	}

	return true;
};

/**
 * Tạo hướng dẫn upload ảnh CCCD
 * @returns {Object} Hướng dẫn chi tiết
 */
export const getCCCDUploadGuide = () => {
	return {
		title: 'Hướng dẫn upload ảnh CCCD',
		steps: [
			{
				step: 1,
				title: 'Chuẩn bị ảnh',
				description: 'Chụp ảnh rõ ràng cả mặt trước và mặt sau CCCD',
			},
			{
				step: 2,
				title: 'Đặt tên file',
				description:
					'Đặt tên file có chứa từ "front" hoặc "mat_truoc" cho mặt trước, "back" hoặc "mat_sau" cho mặt sau',
			},
			{
				step: 3,
				title: 'Upload ảnh',
				description:
					'Upload cả 2 ảnh cùng lúc hoặc sử dụng field names cụ thể',
			},
			{
				step: 4,
				title: 'Kiểm tra',
				description:
					'Đảm bảo ảnh rõ ràng, không bị mờ hoặc che khuất thông tin',
			},
		],
		requirements: {
			format: ['JPG', 'JPEG', 'PNG'],
			maxSize: '5MB mỗi ảnh',
			quality: 'Ảnh rõ ràng, không bị mờ',
			content: 'Hiển thị đầy đủ thông tin CCCD',
		},
		examples: {
			goodNames: [
				'cccd_front.jpg',
				'mat_truoc_cccd.png',
				'front_cccd.jpeg',
				'cccd_back.jpg',
				'mat_sau_cccd.png',
				'back_cccd.jpeg',
			],
			badNames: ['image1.jpg', 'photo.png', 'cccd.jpg'],
		},
	};
};
