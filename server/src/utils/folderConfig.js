// utils/folderConfig.js
export const getImageFolder = (type) => {
	switch (type) {
		case 'avatar':
			return 'e-technology/avatar';
		case 'product':
			return 'e-technology/product';
		case 'banner':
			return 'e-technology/banner'; // Ví dụ thêm banner
		default:
			return 'e-technology/other'; // Mặc định cho các ảnh không xác định
	}
};
