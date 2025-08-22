import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from '@/components/modal/Modal';

const ModalVerifyPhoneOTP = ({ isOpen, onClose, phoneNumber, onSubmit }) => {
	const [otp, setOtp] = useState(['', '', '', '', '', '']);
	const [timer, setTimer] = useState(60);
	const [isResending, setIsResending] = useState(false);

	// Reset OTP & timer khi mở modal
	useEffect(() => {
		if (isOpen) {
			setOtp(['', '', '', '', '', '']);
			setTimer(60);
		}
	}, [isOpen]);

	// Đếm ngược timer
	useEffect(() => {
		if (!isOpen || timer <= 0) return;
		const interval = setInterval(() => setTimer((t) => t - 1), 1000);
		return () => clearInterval(interval);
	}, [isOpen, timer]);

	// Format timer
	const formatTime = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${minutes.toString().padStart(2, '0')}:${secs
			.toString()
			.padStart(2, '0')}`;
	};

	// Xử lý nhập OTP
	const handleOtpChange = (index, value) => {
		const newOtp = [...otp];
		newOtp[index] = value.replace(/\D/g, '').slice(0, 1);
		setOtp(newOtp);
		if (value && index < 5) {
			document.getElementById(`phone-otp-input-${index + 1}`)?.focus();
		}
	};

	// Gửi lại OTP
	const handleResend = async () => {
		if (timer > 0 || isResending) return;
		setIsResending(true);
		await onSubmit?.();
		setTimer(60);
		setOtp(['', '', '', '', '', '']);
		setIsResending(false);
	};

	// Xác nhận OTP
	const handleVerify = async () => {
		const otpCode = otp.join('');
		if (otpCode.length === 6) {
			await onSubmit?.(otpCode);
		}
	};

	// Hiển thị số điện thoại dạng (+84) xxxxxxxx nếu là số Việt Nam
	const displayPhone = phoneNumber
		? phoneNumber.startsWith('0')
			? `(+84) ${phoneNumber.slice(1)}`
			: phoneNumber
		: '';

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='Điền mã xác minh'
			variant='form'
			size='sm'>
			<p className='text-gray-500 text-center mb-2'>
				Chúng tôi vừa gửi một mã gồm 6 chữ số tới số điện thoại của bạn.
			</p>
			<div className='text-center mb-6'>
				<span className='text-blue-500'>{displayPhone}</span>
			</div>
			<div className='flex justify-center gap-2 mb-6'>
				{otp.map((digit, index) => (
					<input
						key={index}
						id={`phone-otp-input-${index}`}
						type='text'
						className='w-12 h-12 text-center text-gray-600 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200'
						value={digit}
						onChange={(e) => handleOtpChange(index, e.target.value)}
						maxLength={1}
						autoFocus={isOpen && index === 0}
						disabled={isResending}
					/>
				))}
			</div>
			<div className='flex justify-center w-full mb-4'>
				<button
					className='w-full py-2 rounded-full text-white font-semibold text-lg transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 disabled:opacity-50'
					style={{
						background:
							'linear-gradient(90deg, #0f5ad5 0%, #1de9b6 100%)',
						borderRadius: '9999px',
					}}
					onClick={handleVerify}
					disabled={otp.join('').length < 6 || isResending}>
					Xác nhận
				</button>
			</div>
			<div className='text-center text-gray-500 text-sm'>
				{timer > 0 ? (
					<span>
						Gửi lại mã sau:{' '}
						<span className='text-gray-700 font-medium'>
							{formatTime(timer)}
						</span>
					</span>
				) : (
					<span>
						Không nhận được mã?{' '}
						<button
							onClick={handleResend}
							className='text-blue-600 hover:underline font-medium disabled:opacity-50'
							disabled={isResending}>
							{isResending ? 'Đang gửi...' : 'Gửi lại'}
						</button>
					</span>
				)}
			</div>
		</Modal>
	);
};

ModalVerifyPhoneOTP.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	phoneNumber: PropTypes.string.isRequired,
	onSubmit: PropTypes.func,
};

export default ModalVerifyPhoneOTP;
