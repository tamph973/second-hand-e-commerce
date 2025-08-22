import axiosConfig from '@/configs/axiosConfig';

const registerSeller = async (sellerData) => {
	try {
		const res = await axiosConfig.post('/sellers/register', sellerData);
		return res;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const verifyCCCD = async (cccdData) => {
	try {
		const formData = new FormData();
		formData.append('cccdFront', cccdData.cccdFront[0]);
		formData.append('cccdBack', cccdData.cccdBack[0]);
		formData.append('cccdNumber', cccdData.cccdNumber);
		formData.append('cccdIssuedPlace', cccdData.cccdIssuedPlace);
		formData.append('cccdIssuedDate', cccdData.cccdIssuedDate);
		formData.append('cccdExpiredDate', cccdData.cccdExpiredDate);

		const res = await axiosConfig.post('/sellers/verify-cccd', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return res;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const createProduct = async (productData) => {
	try {
		const formData = new FormData();

		// Xử lý images - chỉ gửi file objects, không gửi previewts
		if (productData.images && productData.images.length > 0) {
			productData.images.forEach((file) => {
				formData.append('products', file);
			});
		}

		if (productData.variants) {
			productData.variants.forEach((variant) => {
				formData.append('variants', variant.images);
			});
		}

		formData.append('title', productData.title);
		formData.append('description', productData.description);
		formData.append('price', productData.price);
		formData.append('stock', productData.stock);
		formData.append('condition', productData.condition);
		formData.append('categoryId', productData.categoryId);
		formData.append('brandId', productData.brandId);
		formData.append('address', JSON.stringify(productData.address));
		formData.append('type', productData.type);
		formData.append('variants', JSON.stringify(productData.variants));
		formData.append('attributes', JSON.stringify(productData.attributes));

		const res = await axiosConfig.post('/sellers/products', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return res;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const getMyProducts = async (page, limit) => {
	try {
		const res = await axiosConfig.get(
			`/sellers/products?page=${page}&limit=${limit}`,
		);
		return res;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};

const getSellerInfo = async (sellerId) => {
	try {
		const res = await axiosConfig.get(`/sellers/${sellerId}`);
		return res;
	} catch (error) {
		const message = error.response?.data.message;
		return Promise.reject(message);
	}
};
const SellerService = {
	registerSeller,
	verifyCCCD,
	createProduct,
	getMyProducts,
	getSellerInfo,
};
export default SellerService;
