import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import AuthService from '@/services/auth.service';
import useCountdown from '@/hooks/useCountdown';

export default function VerifyChangeEmailModal({
	isOpen,
	onClose,
	onGoBack,
	currentEmail,
	newEmail,
	isLoading,
}) {
	const [otp, setOtp] = useState(['', '', '', '', '', '']);
	const { countdown, resetCountdown, startCountdown } = useCountdown(60);
	const [isResending, setIsResending] = useState(false);

	// Handle OTP input
	const handleOtpChange = (index, value) => {
		const newOtp = [...otp];
		newOtp[index] = value.slice(0, 1); // Limit to 1 character
		setOtp(newOtp);

		// Move focus to next input
		if (value && index < 5) {
			document.getElementById(`otp-input-${index + 1}`).focus();
		}
	};

	const handleResendOtp = async () => {
		if (countdown > 0) return;

		setIsResending(true);
		try {
			const res = await AuthService.changeEmail({ newEmail });
			if (res.status === 200) {
				toast.success(res.data.message);
				startCountdown();
				setOtp(['', '', '', '', '', '']);
			}
		} catch (error) {
			toast.error(error || 'Có lỗi xảy ra khi gửi lại mã OTP');
			resetCountdown();
		} finally {
			setIsResending(false);
		}
	};

	const handleVerify = async () => {
		const otpCode = otp.join('');
		if (otpCode.length === 6) {
			try {
				const res = await AuthService.verifyChangeEmail({
					currentEmail,
					newEmail,
					otp: otpCode,
				});
				if (res.status === 200) {
					toast.success(res.data.message);
					onClose();
				}
			} catch (error) {
				toast.error(error || 'Có lỗi xảy ra khi xác thực email');
			}
		}
	};

	const handleGoBack = () => {
		onClose(); // Close OTP modal
		onGoBack(); // Show email change modal
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30'>
			<div className='bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative'>
				{/* Close button */}
				<button
					className='absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl'
					onClick={onClose}>
					×
				</button>
				{/* Title */}
				<h2 className='text-2xl font-bold text-center mb-2 text-gray-900'>
					Xác thực OTP
				</h2>
				{/* Description */}
				<p className='text-gray-500 text-center mb-6'>
					Nhập mã OTP được gửi đến địa chỉ Email:
					<br />
					<span className='font-medium text-gray-700'>
						{newEmail}
					</span>
				</p>
				{/* Resend timer */}
				<div className='text-center mb-6'>
					{countdown > 0 ? (
						<p className='text-gray-500'>
							Gửi lại mã: ({countdown}s)
						</p>
					) : (
						<button
							onClick={handleResendOtp}
							disabled={isResending}
							className='text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50'>
							{isResending ? 'Đang gửi...' : 'Gửi lại mã OTP'}
						</button>
					)}
				</div>
				{/* OTP inputs */}
				<div className='flex justify-center gap-2 mb-6'>
					{otp.map((digit, index) => (
						<input
							key={index}
							id={`otp-input-${index}`}
							type='text'
							className='w-12 h-12 text-center text-gray-600 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
							value={digit}
							onChange={(e) =>
								handleOtpChange(index, e.target.value)
							}
							maxLength={1}
							autoFocus={index === 0}
							disabled={isLoading}
						/>
					))}
				</div>
				{/* Buttons */}
				<div className='flex justify-between'>
					<button
						className='px-4 py-2 bg-gray-200 rounded-full text-gray-700 font-semibold hover:bg-gray-300'
						onClick={handleGoBack}
						disabled={isLoading}>
						Quay lại
					</button>
					<button
						className='px-4 py-2 bg-orange-500 rounded-full text-white font-semibold hover:bg-orange-600 disabled:opacity-50'
						onClick={handleVerify}
						disabled={otp.join('').length < 6 || isLoading}>
						{isLoading ? 'Đang xử lý...' : 'Tiếp tục'}
					</button>
				</div>
			</div>
		</div>
	);
}

VerifyChangeEmailModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onGoBack: PropTypes.func.isRequired,
	currentEmail: PropTypes.string.isRequired,
	newEmail: PropTypes.string.isRequired,
	isLoading: PropTypes.bool,
};
