export const getLocalStorage = (key) => {
	return localStorage.getItem(key)
		? JSON.parse(localStorage.getItem(key))
		: null;
};
export const setLocalStorage = (key, value) => {
	localStorage.setItem(key, JSON.stringify(value));
};

export const setAuthLocalStorage = ({
	userId,
	access_token,
	refresh_token,
}) => {
	localStorage.setItem('userId', userId);
	localStorage.setItem('access_token', access_token);
	localStorage.setItem('refresh_token', refresh_token);
};

export const getAuthLocalStorage = () => {
	const userId = localStorage.getItem('userId');
	const access_token = localStorage.getItem('access_token');
	const refresh_token = localStorage.getItem('refresh_token');

	return { userId, access_token, refresh_token };
};

export const getAccessToken = () => {
	const access_token = localStorage.getItem('access_token');
	return access_token;
};

export const removeAuthLocalStorage = () => {
	localStorage.removeItem('userId');
	localStorage.removeItem('access_token');
	localStorage.removeItem('refresh_token');
};

export const clearLocalStorage = () => {
	localStorage.clear();
};

// History product functions
export const HISTORY_PRODUCTS_KEY = 'viewed_products_history';

export const addToHistory = (product) => {
	try {
		const history = getLocalStorage(HISTORY_PRODUCTS_KEY) || [];

		// Kiểm tra xem sản phẩm đã tồn tại chưa
		const existingIndex = history.findIndex(
			(item) => item._id === product._id,
		);

		if (existingIndex !== -1) {
			// Nếu đã tồn tại, xóa item cũ và thêm vào đầu
			history.splice(existingIndex, 1);
		}

		// Thêm sản phẩm mới vào đầu mảng
		history.unshift({
			...product,
			viewedAt: new Date().toISOString(),
		});

		// Giới hạn tối đa 20 sản phẩm trong lịch sử
		if (history.length > 20) {
			history.splice(20);
		}

		setLocalStorage(HISTORY_PRODUCTS_KEY, history);
	} catch (error) {
		console.error('Error adding product to history:', error);
	}
};

export const getHistoryProducts = () => {
	try {
		return getLocalStorage(HISTORY_PRODUCTS_KEY) || [];
	} catch (error) {
		console.error('Error getting history products:', error);
		return [];
	}
};

export const removeFromHistory = (productId) => {
	try {
		const history = getHistoryProducts();
		const filteredHistory = history.filter(
			(item) => item._id !== productId,
		);
		setLocalStorage(HISTORY_PRODUCTS_KEY, filteredHistory);
		return filteredHistory;
	} catch (error) {
		console.error('Error removing product from history:', error);
		return [];
	}
};

export const clearHistory = () => {
	try {
		localStorage.removeItem(HISTORY_PRODUCTS_KEY);
	} catch (error) {
		console.error('Error clearing history:', error);
	}
};
