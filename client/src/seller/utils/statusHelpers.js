export const getStatusColor = (status) => {
	const colors = {
		// Order statuses
		preparing: 'bg-blue-100 text-blue-800',
		'waiting-processed': 'bg-yellow-100 text-yellow-800',
		'waiting-handover': 'bg-orange-100 text-orange-800',
		'delivery-tomorrow': 'bg-green-100 text-green-800',
		'out-of-stock': 'bg-red-100 text-red-800',
		'failed-delivery': 'bg-red-100 text-red-800',

		// Product statuses
		active: 'bg-green-100 text-green-800',
		inactive: 'bg-gray-100 text-gray-800',
		'low-stock': 'bg-yellow-100 text-yellow-800',
	};
	return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getStatusLabel = (status) => {
	const labels = {
		// Order statuses
		preparing: 'Chuẩn bị hàng',
		'waiting-processed': 'Chờ lấy hàng (Đã xử lý)',
		'waiting-handover': 'Chờ lấy hàng (Chờ bàn giao)',
		'delivery-tomorrow': 'Giao hàng trong 01 ngày tới',
		'out-of-stock': 'Hết hàng',
		'failed-delivery': 'Giao không thành công',

		// Product statuses
		active: 'Đang bán',
		inactive: 'Tạm ngưng',
		'low-stock': 'Sắp hết',
	};
	return labels[status] || 'Không xác định';
};

export const getStockColor = (stock) => {
	if (stock === 0) return 'text-red-600';
	if (stock <= 10) return 'text-yellow-600';
	return 'text-green-600';
};

export const getBadgeColor = (color) => {
	const colors = {
		info: 'bg-blue-100 text-blue-800',
		success: 'bg-green-100 text-green-800',
		warning: 'bg-yellow-100 text-yellow-800',
		danger: 'bg-red-100 text-red-800',
	};
	return colors[color] || colors.info;
};
