/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import ReactStars from 'react-stars';
import toast from 'react-hot-toast';
import { FaCamera, FaCloudUploadAlt, FaStar } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import LoadingThreeDot from '@/components/common/LoadingThreeDot';

const ReviewModal = ({ isOpen, onClose, product, onSubmit, loading }) => {
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState('');
	const [images, setImages] = useState([]);
	// Rating labels
	const ratingLabels = [
		{ id: 'very_bad', label: 'Rất tệ', value: 1 },
		{ id: 'bad', label: 'Tệ', value: 2 },
		{ id: 'ok', label: 'Tạm ổn', value: 3 },
		{ id: 'good', label: 'Tốt', value: 4 },
		{ id: 'very_good', label: 'Rất tốt', value: 5 },
	];

	// Handle file upload
	const handleImageUpload = (e) => {
		const files = Array.from(e.target.files);
		if (images.length + files.length > 3) {
			toast.error('Tối đa chỉ được upload 3 ảnh');
			return;
		}
		setImages([...images, ...files]);
	};

	// Remove image
	const removeImage = (index) => {
		setImages(images.filter((_, i) => i !== index));
	};

	// Handle submit
	const handleSubmit = async () => {
		if (rating === 0) {
			alert('Vui lòng chọn số sao đánh giá');
			return;
		}

		try {
			await onSubmit({
				rating,
				comment,
				images,
				productId: product._id,
			});
			// Reset form
			setRating(0);
			setComment('');
			setImages([]);
		} catch (error) {
			console.error('Lỗi khi gửi đánh giá:', error);
		}
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-textPrimary'>
			<div className='bg-white rounded-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto'>
				{/* Header */}
				<div className='flex items-center justify-between p-4 border-b'>
					<h2 className='text-lg font-semibold text-textPrimary'>
						Đánh giá sản phẩm
					</h2>
					<button
						onClick={onClose}
						className='p-1 hover:bg-gray-100 rounded-full'>
						<IoClose size={20} />
					</button>
				</div>

				{/* Product Info */}
				<div className='p-4 border-b'>
					<div className='flex items-start space-x-3'>
						<img
							src={product?.thumbnail.url}
							alt={product?.title}
							className='w-16 h-16 object-cover rounded-lg'
						/>
						<div className='flex-1'>
							<h3 className='font-medium text-sm'>
								{product?.title}
							</h3>
							{/* Product features */}
							{/* <div className='flex items-center space-x-2 mt-1'>
								<span className='text-xs text-gray-500'>
									7 màu
								</span>
								<span className='text-xs text-gray-500'>•</span>
								<span className='text-xs text-gray-500'>
									Pin 7 ngày
								</span>
								<span className='text-xs text-gray-500'>•</span>
								<span className='text-xs text-gray-500'>
									Nhựa
								</span>
							</div> */}
						</div>
					</div>
				</div>

				{/* Rating Section */}
				<div className='p-4 border-b'>
					<div className='text-center'>
						<div className='flex justify-center mb-2'>
							<ReactStars
								count={5}
								half={false}
								value={rating}
								onChange={setRating}
								size={40}
								color2='#ffd700'
								color1='#e5e7eb'
							/>
						</div>
						{rating > 0 && (
							<p className='text-sm font-medium text-gray-700'>
								{ratingLabels[rating - 1]?.label}
							</p>
						)}
					</div>
				</div>

				{/* Comment Section */}
				{rating > 0 && (
					<div className='p-4 border-b'>
						<textarea
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							placeholder='Mời bạn chia sẻ thêm cảm nhận...'
							className='w-full p-3 border border-gray-300 rounded-lg resize-none'
							rows={4}
						/>
					</div>
				)}

				{/* Image Upload Section */}
				{rating > 0 && (
					<div className='p-4 border-b'>
						<div className='flex items-center space-x-2 mb-3'>
							<FaCamera size={16} className='text-gray-500' />
							<span className='text-sm text-gray-600'>
								Gửi ảnh thực tế (tối đa 3 ảnh)
							</span>
						</div>

						{/* Image preview */}
						{images.length > 0 && (
							<div className='flex space-x-2 mb-3'>
								{images.map((image, index) => (
									<div key={index} className='relative'>
										<img
											src={URL.createObjectURL(image)}
											alt={`Review image ${index + 1}`}
											className='w-16 h-16 object-cover rounded-lg'
										/>
										<button
											onClick={() => removeImage(index)}
											className='absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs'>
											<IoClose size={10} />
										</button>
									</div>
								))}
							</div>
						)}

						{/* Upload button */}
						{images.length < 3 && (
							<label className='flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400'>
								<FaCloudUploadAlt
									size={16}
									className='mr-2 text-gray-500'
								/>
								<span className='text-sm text-gray-600'>
									Chọn ảnh
								</span>
								<input
									type='file'
									multiple
									accept='image/*'
									onChange={handleImageUpload}
									className='hidden'
								/>
							</label>
						)}
					</div>
				)}

				{/* Submit Button */}
				{rating > 0 && (
					<div className='p-4'>
						<button
							onClick={handleSubmit}
							disabled={loading}
							className='w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'>
							{loading ? <LoadingThreeDot /> : 'Gửi đánh giá'}
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default ReviewModal;
