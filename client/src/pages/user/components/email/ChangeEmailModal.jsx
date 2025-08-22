import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';

export default function ChangeEmailModal({
	isOpen,
	onClose,
	onSendOtp,
	currentEmail,
	isLoading,
}) {
	const [newEmail, setNewEmail] = useState('');
	const [isSendingOtp, setIsSendingOtp] = useState(false);
	const inputRef = useRef(null);

	// Auto-focus input khi modal mở
	useEffect(() => {
		if (isOpen) {
			inputRef.current?.focus();
		}
	}, [isOpen]);

	const isValidEmail = (email) => {
		const emailRegex =
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
		return emailRegex.test(email);
	};

	const handleChangeEmail = async () => {
		if (newEmail && isValidEmail(newEmail) && newEmail !== currentEmail) {
			setIsSendingOtp(true);
			try {
				// const res = await AuthService.changeEmail({ newEmail });
				// if (res.status === 200) {
				toast.success('Mã OTP đã được gửi đến email của bạn');
				onSendOtp(newEmail);
				// }
			} catch (error) {
				toast.error(error || 'Có lỗi xảy ra khi gửi mã OTP');
			} finally {
				setIsSendingOtp(false);
			}
		}
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30'>
			<div className='bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl relative'>
				{/* Close button */}
				<button
					className='absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl'
					onClick={onClose}
					aria-label='Đóng modal'>
					×
				</button>
				{/* Title */}
				<h2 className='text-2xl font-bold text-center mb-2 text-gray-900'>
					Thay đổi email
				</h2>
				{/* Description */}
				<p className='text-gray-500 text-center mb-6'>
					Vui lòng nhập một địa chỉ email mới. Một thư xác nhận sẽ
					được gửi đến hộp thư đến của bạn.
				</p>
				{/* Current email */}
				<div className='mb-4 flex items-center gap-2'>
					<span className='w-1/3 text-gray-500'>
						Địa chỉ email hiện tại:
					</span>
					<span className='font-medium text-gray-700'>
						{currentEmail}
					</span>
				</div>
				{/* New email input */}
				<div className='mb-6 flex items-center'>
					<span className='w-1/3 text-gray-500'>
						Địa chỉ email mới:
					</span>
					<div className='w-2/3'>
						<input
							ref={inputRef}
							type='email'
							className={`w-full border ${
								newEmail && !isValidEmail(newEmail)
									? 'border-red-500'
									: 'border-gray-300'
							} text-gray-600 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-200`}
							placeholder='Nhập email mới'
							value={newEmail}
							onChange={(e) => setNewEmail(e.target.value.trim())}
							aria-invalid={
								newEmail && !isValidEmail(newEmail)
									? 'true'
									: 'false'
							}
							aria-describedby='email-error'
						/>
					</div>
				</div>
				{/* Error message and Submit button */}
				<div className='flex flex-col items-center'>
					{newEmail && !isValidEmail(newEmail) && (
						<p className='text-red-500 text-sm mb-2 text-center'>
							Email không hợp lệ
						</p>
					)}
					{newEmail === currentEmail && (
						<p className='text-red-500 text-sm mb-2 text-center'>
							Email mới không được trùng với email hiện tại
						</p>
					)}
					<div className='flex justify-center w-full'>
						<button
							className='w-1/2 py-2 rounded-full text-white font-semibold text-lg transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 disabled:opacity-50'
							style={{
								background:
									'linear-gradient(90deg, #00a300 0%, #00e600 100%)',
								borderRadius: '9999px',
							}}
							onClick={handleChangeEmail}
							disabled={
								!newEmail ||
								!isValidEmail(newEmail) ||
								newEmail === currentEmail ||
								isSendingOtp ||
								isLoading
							}>
							{isSendingOtp ? 'Đang gửi...' : 'Gửi mã đến email'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

ChangeEmailModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onOpen: PropTypes.func,
	onSendOtp: PropTypes.func,
	currentEmail: PropTypes.string.isRequired,
	isLoading: PropTypes.bool,
};
