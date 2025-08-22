// utils/folderConfig.js
export const getImageFolder = (type) => {
	switch (type) {
		case 'avatar':
			return 'e-technology/avatar';
		case 'authentication':
			return 'e-technology/authentication';
		case 'product':
			return 'e-technology/product';
		case 'variant':
			return 'e-technology/variant';
		case 'category':
			return 'e-technology/category';
		case 'brand':
			return 'e-technology/brand';
		case 'subcategory':
			return 'e-technology/subcategory';
		case 'banner':
			return 'e-technology/banner'; // Ví dụ thêm banner
		case 'review':
			return 'e-technology/review';
		default:
			return 'e-technology/other'; // Mặc định cho các ảnh không xác định
	}
};
