import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// Cloudinary Configuration
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryUploadImage = async (image, folder = 'e-technology') => {
	const buffer = image?.buffer || Buffer.from(await image.arrayBuffer());

	const uploadImage = await new Promise((resolve, reject) => {
		cloudinary.uploader
			.upload_stream(
				{
					folder,
					resource_type: 'image',
					public_id: Date.now() + '-' + Math.round(Math.random() * 1e9),
				},
				(error, result) => {
					if (error) {
						console.error(error);
						reject(error);
					} else {
						resolve({
							url: result.secure_url,
							public_id: result.public_id,
						});
					}
				},
			)
			.end(buffer);
	});

	return uploadImage;
};
export const cloudinaryDeleteImage = async (fileToDelete) => {
	return new Promise((resolve, reject) => {
		cloudinary.uploader.destroy(fileToDelete, { resource_type: 'image' }, (error, result) => {
			if (error) {
				console.error('Cloudinary Deletion Error:', error);
				return reject(new Error('Failed to delete image from Cloudinary.'));
			}
			resolve(result); // Trả về object kết quả đầy đủ
		});
	});
};
