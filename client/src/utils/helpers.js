import {
	ATTRIBUTE_LABELS,
	CONDITION_OPTIONS,
	getColorLabel,
	ORDER_STATUS_OPTIONS,
	TABLET_SCREEN_SIZE_OPTIONS,
	WASHING_MACHINE_DOOR_OPTIONS,
} from '@/constants/productOptions';
export function formatPriceVND(value) {
	if (!value && value !== 0) return 0;
	const formattedNumber = value.toLocaleString('vi-VN', {
		style: 'currency',
		currency: 'VND',
	});
	return formattedNumber;
}

export const getScreenSizeLabel = (value) => {
	return TABLET_SCREEN_SIZE_OPTIONS.find((item) => item.value === value)
		?.label;
};

export const getWashingMachineDoorLabel = (value) => {
	return WASHING_MACHINE_DOOR_OPTIONS.find((item) => item.value === value)
		?.label;
};

export const renderAttributes = (attributes) => {
	if (!attributes || typeof attributes !== 'object') return '';
	return Object.entries(attributes)
		.map(([key, value]) => {
			const label = ATTRIBUTE_LABELS[key] || key;
			let displayValue = value;
			if (key === 'color') {
				displayValue = getColorLabel(value);
			}
			// Screen size
			if (key === 'screen_size') {
				displayValue = getScreenSizeLabel(value);
			}
			// Washing machine door
			if (key === 'door') {
				displayValue = getWashingMachineDoorLabel(value);
			}
			return `${label}: ${displayValue}`;
		})
		.join(', ');
};

export const renderCondition = (condition) => {
	return CONDITION_OPTIONS.find((item) => item.value === condition)?.label;
};

export const getOrderStatusLabel = (status) => {
	return (
		ORDER_STATUS_OPTIONS.find((item) => item.value === status)?.label ||
		status
	);
};

export const extractProductIdFromSlug = (slug) => {
	if (!slug) return null;
	const parts = slug.split('-');
	const productId = parts[parts.length - 1];
	return productId;
};

/**
 * Time utilities for formatting relative time (e.g., last active, posted time, etc.)
 */

// Tính thời gian từ một mốc thời gian bất kỳ đến hiện tại
export const getTimeSince = (date) => {
	if (!date) return null;

	const now = new Date();
	const targetDate = new Date(date);
	const timeDiff = now.getTime() - targetDate.getTime();

	const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
	const hours = Math.floor(
		(timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
	);
	const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

	return {
		totalMs: timeDiff,
		days,
		hours,
		minutes,
		seconds: Math.floor((timeDiff % (1000 * 60)) / 1000),
	};
};

// Format thời gian thành text dễ đọc (dùng chung cho nhiều trường hợp)
export const formatTimeSince = (date) => {
	const timeSince = getTimeSince(date);

	if (!timeSince) return 'Chưa có thông tin';

	const { days, hours, minutes } = timeSince;

	if (days > 0) {
		if (days === 1) return '1 ngày trước';
		if (days < 7) return `${days} ngày trước`;
		if (days < 30) {
			const weeks = Math.floor(days / 7);
			return `${weeks} tuần trước`;
		}
		if (days < 365) {
			const months = Math.floor(days / 30);
			return `${months} tháng trước`;
		}
		const years = Math.floor(days / 365);
		return `${years} năm trước`;
	} else if (hours > 0) {
		return `${hours} giờ trước`;
	} else if (minutes > 0) {
		return `${minutes} phút trước`;
	} else {
		return 'Vừa xong';
	}
};

export const getUrlSearchParam = (key) => {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(key);
};

export const setUrlSearchParam = (key, value) => {
	const currentUrl = new URL(window.location.href);
	const urlParams = new URLSearchParams(currentUrl.search);
	urlParams.set(key, value);
	currentUrl.search = urlParams.toString();
	window.history.pushState({}, '', currentUrl);
};

export const formatDate = (date) => {
	return new Date(date).toLocaleDateString('vi-VN', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	});
};

// Format date for input type="date" (yyyy-MM-dd)
export const formatDateForInput = (dateValue) => {
	if (!dateValue) return '';

	// If it's already in YYYY-MM-DD format, return as is
	if (
		typeof dateValue === 'string' &&
		/^\d{4}-\d{2}-\d{2}$/.test(dateValue)
	) {
		return dateValue;
	}

	// If it's a date string like "2003-07-09T00:00:00.000Z", convert to YYYY-MM-DD
	if (typeof dateValue === 'string' && dateValue.includes('T')) {
		const date = new Date(dateValue);
		if (!isNaN(date.getTime())) {
			return date.toISOString().split('T')[0];
		}
	}

	// If it's a Date object
	if (dateValue instanceof Date) {
		return dateValue.toISOString().split('T')[0];
	}

	return '';
};

// Generate code mã giảm giá bao gồm: 10 ký tự, chữ cái in hoa, số
export const generateDiscountCode = () => {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let code = '';
	for (let i = 0; i < 10; i++) {
		code += characters.charAt(
			Math.floor(Math.random() * characters.length),
		);
	}
	return code;
};
