import { useState, useEffect } from 'react';
import {
	getHistoryProducts,
	addToHistory,
	removeFromHistory,
	clearHistory,
} from '@/utils/localStorageUtils';
import { toast } from 'react-hot-toast';

export const useProductHistory = () => {
	const [historyProducts, setHistoryProducts] = useState([]);

	// Load history products on mount
	useEffect(() => {
		loadHistory();
	}, []);

	const loadHistory = () => {
		const products = getHistoryProducts();
		setHistoryProducts(products);
	};


	const addProductToHistory = (product) => {
		if (product && product._id) {
			addToHistory(product);
			loadHistory(); // Reload history after adding
		}
	};

	const removeProductFromHistory = (productId) => {
		const updatedHistory = removeFromHistory(productId);
		setHistoryProducts(updatedHistory);
		toast.success('Đã xóa sản phẩm khỏi lịch sử');
	};

	const clearAllHistory = () => {
		clearHistory();
		setHistoryProducts([]);
		toast.success('Đã xóa toàn bộ lịch sử');
	};

	const getDisplayProducts = (limit = 4) => {
		return historyProducts.slice(0, limit);
	};

	const hasMoreProducts = (limit =5) => {
		return historyProducts.length > limit;
	};

	const getRemainingCount = (limit = 5) => {
		return Math.max(0, historyProducts.length - limit);
	};

	return {
		historyProducts,
		addProductToHistory,
		removeProductFromHistory,
		clearAllHistory,
		getDisplayProducts,
		hasMoreProducts,
		getRemainingCount,
		loadHistory,
	};
};
