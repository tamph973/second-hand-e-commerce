import * as UploadSerivce from '../services/upload.service.js';
import UserModel from '../models/user.model.js';
import ProductModel from '../models/product.model.js';

export const uploadAvatar = async (req, res) => {
	try {
		const { id } = req.user; // Lấy id người dùng từ middleware authentication

		// Lấy thông tin người dùng để kiểm tra avatar cũ
		const user = await UserModel.findById(id);
		const oldAvatarPublicId = user.avatar?.public_id; // Lấy public_id của avatar cũ (nếu có)

		// // Nếu có avatar cũ, xóa avatar đó trên Cloudinary
		// if (oldAvatarPublicId) {
		// 	await deleteImages([oldAvatarPublicId]);
		// }

		const uploadedImages = await UploadSerivce.uploadImagesService(req, 'avatar'); // Upload ảnh avatar
		const avatarUrl = uploadedImages[0].url;
		const avatarPublicId = uploadedImages[0].public_id;

		// Cập nhật avatar cho người dùng
		await UserModel.findByIdAndUpdate(id, {
			avatar: {
				url: avatarUrl,
				public_id: avatarPublicId,
			},
		});

		return res.status(200).json({
			message: 'Tải avatar lên thành công',
			userId: id,
			avatar: {
				url: avatarUrl,
				public_id: avatarPublicId,
			},
		});
	} catch (error) {
		console.log(error);

		return res.status(500).json({
			message: error.message,
			error: true,
			success: false,
		});
	}
};

export const deleteImage = async (req, res) => {
	try {
		const { publicIds } = req.body; // Lấy public_id của các ảnh cần xóa

		// Xóa ảnh khỏi Cloudinary
		for (let publicId of publicIds) {
			await deleteImages(publicIds);

			// Kiểm tra xem ảnh có phải là avatar của người dùng không
			const user = await UserModel.findOne({ 'avatar.public_id': publicId });
			if (user) {
				// Nếu đúng là avatar của người dùng, cập nhật lại avatar
				await UserModel.findByIdAndUpdate(user._id, { avatar: { url: '', public_id: '' } });
			}

			// Xử lý nếu ảnh là của sản phẩm
			const product = await ProductModel.findOne({ 'images.public_id': publicId });
			if (product) {
				// Xóa ảnh khỏi sản phẩm nếu trùng public_id
				await ProductModel.updateOne(
					{ _id: product._id },
					{ $pull: { images: { public_id: publicId } } },
				);
			}
		}
		return res.status(200).json({
			message: 'Xóa ảnh thành công',
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
			error: true,
			success: false,
		});
	}
};
