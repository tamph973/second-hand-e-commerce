import { useEffect, useState } from 'react';

const useCountdown = (
	initialTime, // OTP_COUNTDOWN_TIME (forgot password)
	storageKey = 'otpCountdown',
	storageTimestampKey = 'otpTimestamp',
) => {
	const [countdown, setCountdown] = useState(
		parseInt(localStorage.getItem('otpCountdown'), initialTime) || 0,
	);

	// Khởi tạo countdown từ localStorage nếu có
	useEffect(() => {
		const storedTimestamp = localStorage.getItem(storageTimestampKey);
		if (storedTimestamp) {
			const elapsed = Math.floor((Date.now() - storedTimestamp) / 1000);
			const remainingTime = Math.max(initialTime - elapsed, 0);
			setCountdown(remainingTime);
		}
	}, [initialTime, storageTimestampKey]);

	// Đếm ngược
	useEffect(() => {
		if (countdown > 0) {
			const timer = setInterval(() => {
				setCountdown((prev) => {
					const next = prev - 1;
					localStorage.setItem(storageKey, next);
					if (next <= 0) {
						clearInterval(timer);
					}
					return next;
				});
			}, 1000);
			return () => clearInterval(timer);
		}
	}, [countdown, storageKey]);

	// Reset countdown
	const resetCountdown = () => {
		setCountdown(0);
		localStorage.removeItem(storageKey);
		localStorage.removeItem(storageTimestampKey);
	};

	// Bắt đầu lại countdown
	const startCountdown = () => {
		setCountdown(initialTime);
		localStorage.setItem(storageKey, initialTime);
		localStorage.setItem(storageTimestampKey, Date.now());
	};

	return { countdown, resetCountdown, startCountdown };
};

export default useCountdown;
