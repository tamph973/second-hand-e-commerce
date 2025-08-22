import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Textarea, Badge } from 'flowbite-react';
import {
	HiX,
	HiCheckCircle,
	HiXCircle,
	HiExclamation,
	HiEye,
	HiEyeOff,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const ProductActionModal = ({
	product,
	isOpen,
	onClose,
	onAction,
	actionType = 'APPROVED',
}) => {
	const [reason, setReason] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	// Handle ESC key to close modal
	useEffect(() => {
		const handleEsc = (event) => {
			if (event.keyCode === 27) {
				onClose();
			}
		};
		window.addEventListener('keydown', handleEsc);
		return () => {
			window.removeEventListener('keydown', handleEsc);
		};
	}, [onClose]);

	// Prevent body scroll when modal is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

	const handleSubmit = async () => {
		if (actionType === 'REJECTED' && !reason.trim()) {
			toast.error('Vui lòng nhập lý do từ chối');
			return;
		}

		setIsLoading(true);
		try {
			await onAction(product._id, actionType, reason);
			onClose();
			setReason('');
		} catch (error) {
			console.error('Action failed:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		setReason('');
		onClose();
	};

	const handleBackdropClick = (e) => {
		if (e.target === e.currentTarget) {
			handleClose();
		}
	};

	const getActionConfig = () => {
		switch (actionType) {
			case 'APPROVED':
				return {
					title: 'Phê duyệt sản phẩm',
					icon: HiCheckCircle,
					color: 'blue',
					buttonText: 'Phê duyệt',
					buttonColor: 'blue',
					description: 'Bạn có chắc muốn phê duyệt sản phẩm này?',
				};
			case 'REJECTED':
				return {
					title: 'Từ chối sản phẩm',
					icon: HiXCircle,
					color: 'red',
					buttonText: 'Từ chối',
					buttonColor: 'red',
					description: 'Vui lòng nhập lý do từ chối sản phẩm này.',
				};
			case 'ACTIVE': {
				const isActive = product?.activeStatus === 'ACTIVE';
				return {
					title: isActive
						? 'Tạm ngưng sản phẩm'
						: 'Kích hoạt sản phẩm',
					icon: isActive ? HiEyeOff : HiEye,
					color: isActive ? 'yellow' : 'green',
					buttonText: isActive ? 'Tạm ngưng' : 'Kích hoạt',
					buttonColor: isActive ? 'yellow' : 'green',
					description: isActive
						? 'Bạn có chắc muốn tạm ngưng sản phẩm này?'
						: 'Bạn có chắc muốn kích hoạt sản phẩm này?',
				};
			}
			default:
				return {
					title: 'Thao tác sản phẩm',
					icon: HiExclamation,
					color: 'gray',
					buttonText: 'Xác nhận',
					buttonColor: 'blue',
					description: 'Bạn có chắc muốn thực hiện thao tác này?',
				};
		}
	};

	const config = getActionConfig();
	const IconComponent = config.icon;

	if (!isOpen || !product) return null;

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center'
			onClick={handleBackdropClick}>
			{/* Backdrop */}
			<div className='absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300'></div>

			{/* Modal */}
			<div className='relative w-full max-w-md mx-4 bg-white rounded-xl shadow-2xl transform transition-all duration-300 scale-100 opacity-100'>
				{/* Header */}
				<div className='flex items-center justify-between p-6 border-b border-gray-200'>
					<div className='flex items-center space-x-3'>
						<div
							className={`p-2 rounded-full bg-${config.color}-50`}>
							<IconComponent
								className={`w-5 h-5 text-${config.color}-600`}
							/>
						</div>
						<h3 className='text-lg font-semibold text-gray-900'>
							{config.title}
						</h3>
					</div>
					<button
						onClick={handleClose}
						className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200'>
						<HiX className='w-5 h-5' />
					</button>
				</div>

				{/* Body */}
				<div className='p-6 space-y-4'>
					{/* Product Info */}
					<div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
						<img
							src={
								product.thumbnail?.url ||
								product.image ||
								'https://via.placeholder.com/48x48'
							}
							alt={product.title || product.name}
							className='w-12 h-12 rounded-lg object-cover border border-gray-200'
							onError={(e) => {
								e.target.src =
									'https://via.placeholder.com/48x48';
							}}
						/>
						<div className='flex-1'>
							<h4 className='text-sm font-medium text-gray-900'>
								{product.title || product.name}
							</h4>
							<div className='flex items-center space-x-2 mt-1'>
								<Badge color='blue' size='sm'>
									{product.type || 'SINGLE'}
								</Badge>
								<span className='text-xs text-gray-500'>
									{product.userId?.fullName ||
										product.seller ||
										'N/A'}
								</span>
							</div>
						</div>
					</div>

					{/* Description */}
					<p className='text-sm text-gray-600'>
						{config.description}
					</p>

					{/* Reason Input for Reject */}
					{actionType === 'REJECTED' && (
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Lý do từ chối *
							</label>
							<Textarea
								value={reason}
								onChange={(e) => setReason(e.target.value)}
								placeholder='Nhập lý do từ chối sản phẩm...'
								rows={3}
								className='transition-all duration-200 focus:ring-2 focus:ring-red-500 !bg-white !text-gray-700'
							/>
						</div>
					)}

					{/* Current Status */}
					<div className='flex items-center justify-between p-3 bg-blue-50 rounded-lg'>
						<span className='text-sm text-gray-600'>
							Trạng thái hiện tại:
						</span>
						<Badge
							color={
								product.verifyStatus === 'APPROVED'
									? 'green'
									: 'yellow'
							}>
							{product.verifyStatus === 'APPROVED'
								? 'Đã duyệt'
								: 'Chờ duyệt'}
						</Badge>
					</div>
				</div>

				{/* Footer */}
				<div className='flex justify-end space-x-3 p-6 border-t border-gray-200'>
					<Button
						color='gray'
						onClick={handleClose}
						disabled={isLoading}
						className='px-4 py-2'>
						Hủy
					</Button>
					<Button
						color={config.buttonColor}
						onClick={handleSubmit}
						disabled={isLoading}
						className='px-4 py-2 transition-all duration-200 hover:scale-105'>
						{isLoading ? (
							<div className='flex items-center space-x-2'>
								<div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
								<span>Đang xử lý...</span>
							</div>
						) : (
							config.buttonText
						)}
					</Button>
				</div>
			</div>
		</div>
	);
};

ProductActionModal.propTypes = {
	product: PropTypes.object,
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onAction: PropTypes.func.isRequired,
	actionType: PropTypes.oneOf(['APPROVED', 'REJECTED', 'ACTIVE']),
};

export default ProductActionModal;
