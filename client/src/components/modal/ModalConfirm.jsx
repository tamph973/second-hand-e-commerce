import Modal from './Modal';
import PropTypes from 'prop-types';
import {
	FaExclamationCircle,
	FaCheckCircle,
	FaInfoCircle,
	FaExclamationTriangle,
} from 'react-icons/fa';

const ICON_MAP = {
	error: FaExclamationCircle,
	success: FaCheckCircle,
	info: FaInfoCircle,
	alert: FaExclamationTriangle,
	warning: FaExclamationTriangle,
};

const ICON_COLOR = {
	error: 'text-red-500',
	success: 'text-green-500',
	info: 'text-blue-500',
	alert: 'text-yellow-500',
};

const ModalConfirm = ({
	isOpen,
	onClose,
	onConfirm,
	title = 'Xác nhận',
	message,
	confirmText = 'Xác nhận',
	cancelText = 'Huỷ bỏ',
	variant = 'alert',
	loading = false,
	showCancel = true,
	icon, // optional custom icon
	size = 'sm',
}) => {
	const Icon = icon || ICON_MAP[variant];
	const iconColor = ICON_COLOR[variant] || 'text-blue-500';

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={title}
			variant={variant}
			size={size}
			showCloseButton={true}
			closeOnOverlayClick={!loading}>
			<div className='text-center py-2'>
				{Icon && (
					<div className='flex justify-center mb-4'>
						<Icon className={`w-16 h-16 ${iconColor}`} />
					</div>
				)}
				<div className='mb-4 text-gray-700'>{message}</div>
				<div className='flex justify-center gap-3 mt-6'>
					<button
						className={`px-4 py-2 rounded font-semibold text-white ${
							variant === 'error'
								? 'bg-red-600 hover:bg-red-700'
								: variant === 'success'
								? 'bg-green-600 hover:bg-green-700'
								: 'bg-blue-600 hover:bg-blue-700'
						}`}
						onClick={onConfirm}
						disabled={loading}>
						{confirmText}
					</button>
					{showCancel && (
						<button
							className='px-4 py-2 rounded font-semibold border border-gray-300 text-gray-700 hover:bg-gray-100'
							onClick={onClose}
							disabled={loading}>
							{cancelText}
						</button>
					)}
				</div>
			</div>
		</Modal>
	);
};

ModalConfirm.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onConfirm: PropTypes.func.isRequired,
	title: PropTypes.string,
	message: PropTypes.node.isRequired,
	confirmText: PropTypes.string,
	cancelText: PropTypes.string,
	variant: PropTypes.oneOf([
		'default',
		'form',
		'alert',
		'success',
		'warning',
		'error',
		'info',
	]),
	loading: PropTypes.bool,
	showCancel: PropTypes.bool,
	icon: PropTypes.elementType, // optional custom icon
	size: PropTypes.string,
};

export default ModalConfirm;
