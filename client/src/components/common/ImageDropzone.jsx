/* eslint-disable react/prop-types */
import { useDropzone } from 'react-dropzone';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { useState } from 'react';
import ImageModerationService from '@/services/imageModeration.service';

const ImageDropzone = ({
	label,
	value = [],
	onChange,
	maxFiles = 6,
	minFiles = 1,
	color,
	enableModeration = true, // Bật/tắt kiểm duyệt
	onModerationComplete, // Callback khi hoàn thành kiểm duyệt
}) => {
	const [viewIndex, setViewIndex] = useState(null);
	const [moderatingImages, setModeratingImages] = useState(false);
	const [moderationResults, setModerationResults] = useState({});

	const { getRootProps, getInputProps } = useDropzone({
		accept: {
			'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp'],
		},
		maxFiles,
		minFiles,
		maxSize: 10 * 1024 * 1024, // 10MB (tăng từ 2MB để phù hợp với backend)
		onDrop: async (acceptedFiles) => {
			const currentCount = value?.length || 0;

			// Kiểm tra tổng số ảnh sau khi thêm có vượt quá giới hạn không
			if (currentCount + acceptedFiles.length > maxFiles) {
				toast.error(
					`Chỉ được đăng tối đa ${maxFiles} ảnh. Hiện tại đã có ${currentCount} ảnh.`,
				);
				return;
			}

			// Thêm preview cho các file
			const newImages = acceptedFiles.map((file) => {
				Object.defineProperty(file, 'preview', {
					value: URL.createObjectURL(file),
					writable: true,
					enumerable: true,
				});
				return file;
			});

			// Kiểm duyệt hình ảnh nếu được bật
			if (enableModeration) {
				await moderateImages(newImages);
			} else {
				// Nếu không bật kiểm duyệt, thêm trực tiếp
				onChange([...(value || []), ...newImages]);
			}
		},
		onDropRejected: (rejectedFiles) => {
			let shownTooManyFiles = false;
			let shownTooLargeFiles = false;
			let shownInvalidType = false;
			rejectedFiles.forEach((rejection) => {
				const { file, errors } = rejection;
				errors.forEach((error) => {
					switch (error.code) {
						case 'too-many-files':
							if (!shownTooManyFiles) {
								toast.error(
									`Chỉ được chọn tối đa ${maxFiles} ảnh một lần.`,
								);
								shownTooManyFiles = true;
							}
							break;
						case 'file-too-large':
							if (!shownTooLargeFiles) {
								toast.error(
									`File ảnh vượt quá kích thước. Tối đa 10MB/ảnh.`,
								);
								shownTooLargeFiles = true;
							}
							break;
						case 'file-invalid-type':
							if (!shownInvalidType) {
								toast.error(
									`File ảnh không đúng định dạng. Chỉ chấp nhận: JPEG, PNG, GIF, BMP, WebP`,
								);
								shownInvalidType = true;
							}
							break;
						default:
							toast.error(`Lỗi: ${error.message}`);
					}
				});
			});
		},
	});

	/**
	 * Kiểm duyệt hình ảnh
	 */
	const moderateImages = async (images) => {
		if (!enableModeration || images.length === 0) return;

		setModeratingImages(true);
		const loadingToast = toast.loading('Đang kiểm duyệt hình ảnh...');

		try {
			// Kiểm duyệt từng hình ảnh
			const results = await ImageModerationService.moderateMultipleImages(
				images,
			);

			const newModerationResults = {};
			const approvedImages = [];
			const rejectedImages = [];

			results.forEach((result, index) => {
				const image = images[index];
				newModerationResults[image.name] = result;

				if (result.success && result.isAppropriate) {
					approvedImages.push(image);
				} else {
					rejectedImages.push(image);
					// Hiển thị lý do từ chối
					const reason =
						ImageModerationService.getRejectionReason(result);
					toast.error(`${image.name}: ${reason}`);
				}
			});

			setModerationResults(newModerationResults);

			// Thêm các hình ảnh được chấp thuận
			if (approvedImages.length > 0) {
				onChange([...(value || []), ...approvedImages]);
				toast.success(
					`Đã chấp thuận ${approvedImages.length} hình ảnh`,
				);
			}

			// Thông báo kết quả
			if (rejectedImages.length > 0) {
				toast.error(`${rejectedImages.length} hình ảnh bị từ chối`);
			}

			// Gọi callback nếu có
			if (onModerationComplete) {
				onModerationComplete({
					approved: approvedImages,
					rejected: rejectedImages,
					results: newModerationResults,
				});
			}
		} catch (error) {
			console.error('Image moderation error:', error);
			toast.error('Lỗi kiểm duyệt hình ảnh. Vui lòng thử lại.');

			// Nếu lỗi, vẫn thêm hình ảnh (fail-safe)
			onChange([...(value || []), ...images]);
		} finally {
			setModeratingImages(false);
			toast.dismiss(loadingToast);
		}
	};

	/**
	 * Kiểm duyệt lại một hình ảnh
	 */
	const remoderateImage = async (image, index) => {
		if (!enableModeration) return;

		const loadingToast = toast.loading(
			`Đang kiểm duyệt lại ${image.name}...`,
		);

		try {
			const result = await ImageModerationService.moderateImage(image);

			setModerationResults((prev) => ({
				...prev,
				[image.name]: result,
			}));

			if (result.success && result.isAppropriate) {
				toast.success(`${image.name}: Đã được chấp thuận`);
			} else {
				const reason =
					ImageModerationService.getRejectionReason(result);
				toast.error(`${image.name}: ${reason}`);
			}
		} catch (error) {
			console.error('Remoderation error:', error);
			toast.error('Lỗi kiểm duyệt lại hình ảnh');
		} finally {
			toast.dismiss(loadingToast);
		}
	};

	const removeImage = (index) => {
		const newImages = [...value];
		const removedImage = newImages[index];
		newImages.splice(index, 1);
		onChange(newImages);

		// Xóa kết quả kiểm duyệt
		if (removedImage && removedImage.name) {
			setModerationResults((prev) => {
				const newResults = { ...prev };
				delete newResults[removedImage.name];
				return newResults;
			});
		}
	};

	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);
		return result;
	};

	const onDragEnd = (result) => {
		if (!result.destination) return;

		const reordered = reorder(
			value,
			result.source.index,
			result.destination.index,
		);
		onChange(reordered);
	};

	const canAddMore = !value || value.length < maxFiles;

	/**
	 * Lấy trạng thái kiểm duyệt của hình ảnh
	 */
	const getImageModerationStatus = (image) => {
		if (!enableModeration || !image.name) return null;
		return moderationResults[image.name];
	};

	/**
	 * Lấy badge màu cho trạng thái kiểm duyệt
	 */
	const getModerationBadge = (image) => {
		const result = getImageModerationStatus(image);
		if (!result) return null;

		if (!result.success) {
			return {
				color: '#ef4444',
				text: 'Lỗi',
				bgColor: '#fef2f2',
				textColor: '#dc2626',
			};
		}

		// Kiểm tra xem có phải là sản phẩm e-commerce hợp pháp không
		if (ImageModerationService.isEcommerceAppropriate(result)) {
			return {
				color: '#10b981', // emerald-500
				text: 'Chấp thuận',
				bgColor: '#f0fdf4',
				textColor: '#16a34a',
			};
		}

		if (result.isAppropriate) {
			return {
				color: ImageModerationService.getRiskLevelColor(
					result.riskLevel,
				),
				text: ImageModerationService.getRiskLevelText(result.riskLevel),
				bgColor: '#f0fdf4',
				textColor: '#16a34a',
			};
		} else {
			return {
				color: '#ef4444',
				text: 'Từ chối',
				bgColor: '#fef2f2',
				textColor: '#dc2626',
			};
		}
	};

	/**
	 * Lấy tooltip cho badge kiểm duyệt
	 */
	const getModerationTooltip = (image) => {
		const result = getImageModerationStatus(image);
		if (!result) return '';

		if (!result.success) {
			return 'Lỗi kiểm duyệt';
		}

		// Nếu có override reason, hiển thị nó
		if (result.overrideReason) {
			return result.overrideReason;
		}

		if (result.isAppropriate) {
			return `Độ tin cậy: ${
				result.confidence
			}% - ${ImageModerationService.getRiskLevelText(result.riskLevel)}`;
		} else {
			return ImageModerationService.getRejectionReason(result);
		}
	};

	return (
		<div className='w-full'>
			{/* Modal xem ảnh lớn */}
			{viewIndex !== null && (
				<div
					className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70'
					onClick={() => setViewIndex(null)}>
					<div
						className='relative'
						onClick={(e) => e.stopPropagation()}>
						<img
							src={value[viewIndex].preview || value[viewIndex]}
							alt={`Ảnh ${viewIndex + 1}`}
							className='max-w-[90vw] max-h-[80vh] rounded-lg shadow-lg border border-white'
						/>
						<button
							onClick={() => setViewIndex(null)}
							className='absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl hover:bg-opacity-80 transition'>
							×
						</button>
					</div>
				</div>
			)}
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId='images' direction='horizontal'>
					{(provided) => (
						<div
							className='flex gap-x-4 p-2'
							ref={provided.innerRef}
							{...provided.droppableProps}>
							{value?.map((file, index) => {
								const moderationBadge =
									getModerationBadge(file);
								return (
									<Draggable
										key={index}
										draggableId={String(index)}
										index={index}>
										{(dragProvided) => (
											<div
												ref={dragProvided.innerRef}
												{...dragProvided.draggableProps}
												{...dragProvided.dragHandleProps}
												className='relative w-[150px] h-[150px] flex-shrink-0'>
												{/* Badge màu sắc trên preview ảnh */}
												{color && (
													<div
														title={`Màu: ${color}`}
														className='absolute top-1 left-1 w-6 h-6 rounded-full border-2 border-white shadow z-20'
														style={{
															background: color,
														}}
													/>
												)}

												{/* Badge trạng thái kiểm duyệt */}
												{moderationBadge && (
													<div
														title={getModerationTooltip(
															file,
														)}
														className='absolute top-1 left-1 px-2 py-1 rounded text-xs font-medium border shadow z-20'
														style={{
															backgroundColor:
																moderationBadge.bgColor,
															color: moderationBadge.textColor,
															borderColor:
																moderationBadge.color,
														}}>
														{moderationBadge.text}
													</div>
												)}

												<img
													src={file.preview || file}
													alt={`Preview ${index}`}
													className='w-full h-full object-cover rounded-lg border border-gray-300 cursor-pointer'
													onClick={() =>
														setViewIndex(index)
													}
												/>
												{index === 0 &&
													!moderationBadge &&
													maxFiles > 1 && (
														<div className='absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded shadow z-10 pointer-events-none'>
															Ảnh bìa
														</div>
													)}

												{/* Nút xóa */}
												<button
													onClick={() =>
														removeImage(index)
													}
													className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors'>
													×
												</button>

												{/* Nút kiểm duyệt lại */}
												{enableModeration && (
													<button
														onClick={() =>
															remoderateImage(
																file,
																index,
															)
														}
														disabled={
															moderatingImages
														}
														className='absolute bottom-1 right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
														title='Kiểm duyệt lại'>
														↻
													</button>
												)}
											</div>
										)}
									</Draggable>
								);
							})}

							{canAddMore && (
								<div
									{...getRootProps()}
									className='relative w-[150px] h-[150px] border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-white hover:bg-gray-50 transition-colors flex items-center justify-center cursor-pointer'>
									{/* Badge màu sắc trên box upload */}
									{color && (
										<div
											title={`Màu: ${color}`}
											className='absolute top-1 left-1 w-6 h-6 rounded-full border-2 border-white shadow z-20'
											style={{ background: color }}
										/>
									)}
									<input {...getInputProps()} />
									<div>
										<svg
											className='w-10 h-10 text-gray-400 mb-2 mx-auto'
											fill='currentColor'
											viewBox='0 0 20 20'>
											<path d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z' />
										</svg>
										<p className='text-sm text-gray-600'>
											{label || 'Tải ảnh lên'}
										</p>

										<p className='text-xs text-gray-500'>
											hoặc kéo và thả
										</p>

										{enableModeration && (
											<p className='text-xs text-blue-500 mt-1'>
												✓ Kiểm duyệt tự động
											</p>
										)}
									</div>
								</div>
							)}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
		</div>
	);
};

export default ImageDropzone;
