import React from 'react';
import PropTypes from 'prop-types';
import { Button, Badge } from 'flowbite-react';
import {
	HiX,
	HiUser,
	HiCalendar,
	HiTag,
	HiCurrencyDollar,
	HiEye,
	HiEyeOff,
	HiClock,
	HiCheckCircle,
	HiXCircle,
} from 'react-icons/hi';
import ProductStatusBadge from './ProductStatusBadge';

const ProductDetailModal = ({ product, isOpen, onClose }) => {
	// Prevent body scroll when modal is open
	React.useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}

		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

	// Close modal on escape key
	React.useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
		};
	}, [isOpen, onClose]);

	if (!product || !isOpen) return null;

	const formatPrice = (price) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
		}).format(price);
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString('vi-VN', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	return (
		<>
			{/* Backdrop */}
			<div
				className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
					isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
				}`}
				onClick={onClose}
			/>

			{/* Modal */}
			<div
				className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
					isOpen
						? 'opacity-100 scale-100'
						: 'opacity-0 scale-95 pointer-events-none'
				}`}>
				<div className='bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col'>
					{/* Header */}
					<div className='flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100'>
						<div className='flex items-center space-x-3'>
							<div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center'>
								<HiTag className='w-6 h-6 text-white' />
							</div>
							<div>
								<h3 className='text-xl font-semibold text-gray-900'>
									Chi tiết sản phẩm
								</h3>
								<p className='text-sm text-gray-600'>
									Thông tin chi tiết về sản phẩm
								</p>
							</div>
						</div>
						<Button
							color='gray'
							size='sm'
							onClick={onClose}
							className='p-2 hover:bg-gray-100 transition-colors duration-200'>
							<HiX className='w-5 h-5' />
						</Button>
					</div>

					{/* Body */}
					<div className='flex-1 overflow-y-auto p-6 space-y-6'>
						{/* Header Info */}
						<div className='flex items-start space-x-6'>
							<div className='relative flex-shrink-0'>
								<img
									src={
										product.thumbnail?.url ||
										product.image ||
										'https://via.placeholder.com/200x200'
									}
									alt={product.title || product.name}
									className='w-32 h-32 rounded-xl object-cover border-2 border-gray-200 shadow-lg'
									onError={(e) => {
										e.target.src =
											'https://via.placeholder.com/200x200';
									}}
								/>
								{product.type === 'MULTIPLE' && (
									<div className='absolute -top-2 -right-2 bg-orange-500 text-white text-sm px-2 py-1 rounded-full font-medium shadow-lg'>
										VARIANT
									</div>
								)}
							</div>
							<div className='flex-1 min-w-0'>
								<h4 className='text-2xl font-bold text-gray-900 mb-3'>
									{product.title || product.name}
								</h4>
								<div className='flex items-center space-x-6 text-sm text-gray-600 mb-4'>
									<div className='flex items-center space-x-2'>
										<div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center'>
											<HiUser className='w-4 h-4 text-white' />
										</div>
										<span className='font-medium'>
											{product.userId?.fullName ||
												product.seller ||
												'N/A'}
										</span>
									</div>
									<div className='flex items-center space-x-2'>
										<div className='w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center'>
											<HiCalendar className='w-4 h-4 text-white' />
										</div>
										<span className='font-medium'>
											{formatDate(product.createdAt)}
										</span>
									</div>
								</div>
								<div className='flex items-center space-x-4'>
									<ProductStatusBadge
										status={
											product.verifyStatus ||
											product.status
										}
									/>
									<Badge
										color={
											product.activeStatus === 'ACTIVE'
												? 'success'
												: 'gray'
										}
										className='px-3 py-1.5'>
										{product.activeStatus === 'ACTIVE'
											? 'Đang hoạt động'
											: 'Không hoạt động'}
									</Badge>
								</div>
							</div>
						</div>

						{/* Product Images */}
						{product.images && product.images.length > 0 && (
							<div className='bg-gray-50 rounded-xl p-6'>
								<h5 className='text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2'>
									<HiEye className='w-5 h-5 text-blue-600' />
									<span>Hình ảnh sản phẩm</span>
									<Badge color='blue' className='ml-2'>
										{product.images.length} ảnh
									</Badge>
								</h5>
								<div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
									{product.images.map((image, index) => (
										<div
											key={index}
											className='relative group cursor-pointer'>
											<img
												src={image.url}
												alt={`${product.title} - ${
													index + 1
												}`}
												className='w-full h-24 object-cover rounded-lg border border-gray-200 shadow-sm group-hover:shadow-md transition-all duration-200'
												onError={(e) => {
													e.target.src =
														'https://via.placeholder.com/96x96';
												}}
											/>
											<div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center'>
												<span className='text-white opacity-0 group-hover:opacity-100 text-xs font-medium'>
													Ảnh {index + 1}
												</span>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Product Details */}
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
							{/* Basic Info */}
							<div className='bg-gray-50 rounded-xl p-6'>
								<h5 className='text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-4 flex items-center space-x-2'>
									<HiTag className='w-5 h-5 text-blue-600' />
									<span>Thông tin cơ bản</span>
								</h5>

								<div className='space-y-4'>
									<div className='flex justify-between items-center py-2 border-b border-gray-100'>
										<span className='text-sm text-gray-600 font-medium'>
											Loại sản phẩm:
										</span>
										<Badge
											color='blue'
											className='font-semibold'>
											{product.type || 'SINGLE'}
										</Badge>
									</div>

									<div className='flex justify-between items-center py-2 border-b border-gray-100'>
										<span className='text-sm text-gray-600 font-medium'>
											Danh mục:
										</span>
										<span className='text-sm font-semibold text-gray-900'>
											{product.categoryId?.name || 'N/A'}
										</span>
									</div>

									<div className='flex justify-between items-center py-2 border-b border-gray-100'>
										<span className='text-sm text-gray-600 font-medium'>
											Thương hiệu:
										</span>
										<span className='text-sm font-semibold text-gray-900'>
											{product.brandId?.name || 'N/A'}
										</span>
									</div>

									<div className='flex justify-between items-center py-2'>
										<span className='text-sm text-gray-600 font-medium'>
											Tình trạng:
										</span>
										<span className='text-sm font-semibold text-gray-900'>
											{product.condition || 'N/A'}
										</span>
									</div>
								</div>
							</div>

							{/* Pricing Info */}
							<div className='bg-gray-50 rounded-xl p-6'>
								<h5 className='text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-4 flex items-center space-x-2'>
									<HiCurrencyDollar className='w-5 h-5 text-green-600' />
									<span>Thông tin giá</span>
								</h5>

								<div className='space-y-4'>
									{product.priceRange ? (
										<>
											<div className='flex justify-between items-center py-2 border-b border-gray-100'>
												<span className='text-sm text-gray-600 font-medium'>
													Giá thấp nhất:
												</span>
												<span className='text-lg font-bold text-green-600'>
													{formatPrice(
														product.priceRange.min,
													)}
												</span>
											</div>
											<div className='flex justify-between items-center py-2 border-b border-gray-100'>
												<span className='text-sm text-gray-600 font-medium'>
													Giá cao nhất:
												</span>
												<span className='text-lg font-bold text-green-600'>
													{formatPrice(
														product.priceRange.max,
													)}
												</span>
											</div>
										</>
									) : (
										<div className='flex justify-between items-center py-2 border-b border-gray-100'>
											<span className='text-sm text-gray-600 font-medium'>
												Giá:
											</span>
											<span className='text-lg font-bold text-green-600'>
												{formatPrice(
													product.price || 0,
												)}
											</span>
										</div>
									)}

									<div className='flex justify-between items-center py-2'>
										<span className='text-sm text-gray-600 font-medium'>
											Số lượng:
										</span>
										<span className='text-sm font-semibold text-gray-900'>
											{product.stock || 'N/A'}
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Description */}
						{product.description && (
							<div className='bg-gray-50 rounded-xl p-6'>
								<h5 className='text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-4'>
									Mô tả sản phẩm
								</h5>
								<div className='bg-white p-4 rounded-lg border border-gray-200'>
									<p className='text-sm text-gray-700 whitespace-pre-wrap leading-relaxed'>
										{product.description}
									</p>
								</div>
							</div>
						)}

						{/* Attributes */}
						{product.attributes &&
							Object.keys(product.attributes).length > 0 && (
								<div className='bg-gray-50 rounded-xl p-6'>
									<h5 className='text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-4'>
										Thuộc tính sản phẩm
									</h5>
									<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
										{Object.entries(product.attributes).map(
											([key, value]) => (
												<div
													key={key}
													className='bg-white p-4 rounded-lg border border-gray-200 shadow-sm'>
													<div className='text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide'>
														{key}
													</div>
													<div className='text-sm font-semibold text-gray-900'>
														{value}
													</div>
												</div>
											),
										)}
									</div>
								</div>
							)}

						{/* Address */}
						{product.address && (
							<div className='bg-gray-50 rounded-xl p-6'>
								<h5 className='text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-4'>
									Địa chỉ
								</h5>
								<div className='bg-white p-4 rounded-lg border border-gray-200'>
									<p className='text-sm text-gray-700'>
										{product.address.province},{' '}
										{product.address.district},{' '}
										{product.address.ward}
									</p>
								</div>
							</div>
						)}
					</div>

					{/* Footer */}
					<div className='flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50'>
						<Button
							color='gray'
							onClick={onClose}
							className='px-6 py-2.5'>
							Đóng
						</Button>
						<Button
							color='blue'
							className='px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'>
							Chỉnh sửa
						</Button>
					</div>
				</div>
			</div>
		</>
	);
};

ProductDetailModal.propTypes = {
	product: PropTypes.object,
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default ProductDetailModal;
