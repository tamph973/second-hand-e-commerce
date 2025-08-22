import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
	FaTimes,
	FaExclamationTriangle,
	FaCheckCircle,
	FaInfoCircle,
	FaExclamationCircle,
} from 'react-icons/fa';

const Modal = ({
	isOpen,
	onClose,
	title,
	children,
	variant = 'default', // 'default', 'form', 'alert', 'success', 'warning', 'error', 'info'
	size = 'md', // 'sm', 'md', 'lg', 'xl', 'full'
	showCloseButton = true,
	closeOnOverlayClick = true,
	showBackdrop = true,
	className = '',
	...props
}) => {
	const sizeClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
		'2xl': 'max-w-2xl',
		'3xl': 'max-w-3xl',
		'4xl': 'max-w-4xl',
		'5xl': 'max-w-5xl',
		'6xl': 'max-w-6xl',
		full: 'max-w-full mx-4',
	};

	const variantConfig = {
		default: {
			icon: null,
			iconColor: '',
			bgColor: 'bg-white',
			borderColor: 'border-gray-200',
		},
		form: {
			icon: null,
			iconColor: '',
			bgColor: 'bg-white',
			borderColor: 'border-gray-200',
		},
		alert: {
			icon: FaExclamationTriangle,
			iconColor: 'text-yellow-500',
			bgColor: 'bg-yellow-50',
			borderColor: 'border-yellow-200',
		},
		success: {
			icon: FaCheckCircle,
			iconColor: 'text-green-500',
			bgColor: 'bg-green-50',
			borderColor: 'border-green-200',
		},
		warning: {
			icon: FaExclamationTriangle,
			iconColor: 'text-orange-500',
			bgColor: 'bg-orange-50',
			borderColor: 'border-orange-200',
		},
		error: {
			icon: FaExclamationCircle,
			iconColor: 'text-red-500',
			bgColor: 'bg-red-50',
			borderColor: 'border-red-200',
		},
		info: {
			icon: FaInfoCircle,
			iconColor: 'text-blue-500',
			bgColor: 'bg-blue-50',
			borderColor: 'border-blue-200',
		},
	};

	const config = variantConfig[variant];
	const IconComponent = config.icon;

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog
				as='div'
				className='relative z-50'
				onClose={closeOnOverlayClick ? onClose : () => {}}
				{...props}>
				{/* Backdrop */}
				{showBackdrop && (
					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'>
						<div className='fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm' />
					</Transition.Child>
				)}

				{/* Modal Container */}
				<div className='fixed inset-0 overflow-y-auto'>
					<div className='flex min-h-full items-center justify-center p-4'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'>
							<Dialog.Panel
								className={`w-full ${sizeClasses[size]} transform overflow-hidden rounded-lg shadow-xl transition-all ${config.bgColor} ${config.borderColor} border ${className}`}>
								{/* Header */}
								{(title || showCloseButton) && (
									<div className='flex items-center justify-between p-6 pb-4'>
										<div className='flex items-center gap-3'>
											{IconComponent && (
												<IconComponent
													className={`text-xl ${config.iconColor}`}
												/>
											)}
											{title && (
												<Dialog.Title className='text-lg font-semibold text-gray-900'>
													{title}
												</Dialog.Title>
											)}
										</div>
										{showCloseButton && (
											<button
												onClick={onClose}
												className='rounded-lg p-2 border text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors'>
												<FaTimes size={20} />
											</button>
										)}
									</div>
								)}

								{/* Content */}
								<div className='px-6 pb-6'>{children}</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};

Modal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	title: PropTypes.string,
	children: PropTypes.node.isRequired,
	variant: PropTypes.oneOf([
		'default',
		'form',
		'alert',
		'success',
		'warning',
		'error',
		'info',
	]),
	size: PropTypes.oneOf([
		'sm',
		'md',
		'lg',
		'xl',
		'2xl',
		'3xl',
		'4xl',
		'5xl',
		'6xl',
		'full',
	]),
	showCloseButton: PropTypes.bool,
	closeOnOverlayClick: PropTypes.bool,
	showBackdrop: PropTypes.bool,
	className: PropTypes.string,
};

export default Modal;
