export const sellerMenuItems = [
	{
		key: 'overview',
		title: 'Tổng quan',
		icon: '📊',
		subItems: [
			{
				key: 'dashboard',
				title: 'Bảng tổng quan',
				path: '/seller/dashboard',
			},
		],
	},
	{
		key: 'shop',
		title: 'Shop',
		icon: '🏪',
		subItems: [
			{
				key: 'shop_management',
				title: 'Quản lý Shop',
				path: '/seller/shop',
			},
		],
	},
	{
		key: 'products',
		title: 'Sản phẩm',
		icon: '📦',
		subItems: [
			{
				key: 'create_products',
				title: 'Đăng bán sản phẩm',
				path: '/seller/products/create',
			},
			{
				key: 'products',
				title: 'Sản phẩm đăng bán',
				path: '/seller/products',
			},
			// {
			// 	key: 'products_warehouse',
			// 	title: 'Sản phẩm kho',
			// 	path: '/seller/products/warehouse',
			// },
			// {
			// 	key: 'products_auto_push',
			// 	title: 'Đẩy sản phẩm tự động',
			// 	path: '/seller/products/auto-push',
			// },
		],
	},
	// {
	// 	key: 'purchase',
	// 	title: 'Quản lý mua hàng',
	// 	icon: '🛒',
	// 	subItems: [
	// 		{
	// 			key: 'supplier_management',
	// 			title: 'Quản lý nhà cung cấp',
	// 			path: '/seller/purchase/suppliers',
	// 		},
	// 		{
	// 			key: 'supplier_sku',
	// 			title: 'Nhà cung cấp và SKU',
	// 			path: '/seller/purchase/supplier-sku',
	// 		},
	// 		{
	// 			key: 'receipt_forecast',
	// 			title: 'Dự báo nhập hàng',
	// 			path: '/seller/purchase/forecast',
	// 		},
	// 	],
	// },
	// {
	// 	key: 'inventory',
	// 	title: 'Tồn kho',
	// 	icon: '📋',
	// 	subItems: [
	// 		{
	// 			key: 'warehouse_location',
	// 			title: 'Vị trí kho hàng',
	// 			path: '/seller/inventory/location',
	// 		},
	// 		{
	// 			key: 'actual_inventory',
	// 			title: 'Tồn kho thực tế',
	// 			path: '/seller/inventory/actual',
	// 		},
	// 		{
	// 			key: 'receipt_note',
	// 			title: 'Phiếu nhập hàng',
	// 			path: '/seller/inventory/receipt',
	// 		},
	// 		{
	// 			key: 'inventory_adjustment',
	// 			title: 'Điều chỉnh tồn kho',
	// 			path: '/seller/inventory/adjustment',
	// 		},
	// 	],
	// },
	{
		key: 'orders',
		title: 'Đơn hàng',
		icon: '📋',
		subItems: [
			{
				key: 'order_management',
				title: 'Quản lý đơn hàng',
				path: '/seller/orders',
			},
			// {
			// 	key: 'failed_delivery',
			// 	title: 'Giao không thành công',
			// 	path: '/seller/orders/failed',
			// 	badge: '303',
			// 	badgeColor: 'danger',
			// },
		],
	},
	// {
	// 	key: 'accounting',
	// 	title: 'Kế toán',
	// 	icon: '💰',
	// 	subItems: [
	// 		{
	// 			key: 'business_results',
	// 			title: 'Kết quả kinh doanh',
	// 			path: '/seller/accounting/results',
	// 		},
	// 		{
	// 			key: 'transaction_log',
	// 			title: 'Nhật ký giao dịch',
	// 			path: '/seller/accounting/transactions',
	// 		},
	// 		{
	// 			key: 'add_transaction',
	// 			title: 'Thêm giao dịch',
	// 			path: '/seller/accounting/add',
	// 		},
	// 	],
	// },
	// {
	// 	key: 'account',
	// 	title: 'Tài khoản',
	// 	icon: '👤',
	// 	subItems: [
	// 		{
	// 			key: 'account_permissions',
	// 			title: 'Tài khoản & Phân quyền',
	// 			path: '/seller/account/permissions',
	// 			badge: '!',
	// 			badgeColor: 'danger',
	// 		},
	// 	],
	// },
];

export const orderStatuses = [
	{ key: 'ALL', label: 'Tất cả', count: 456 },
	{ key: 'preparing', label: 'Chuẩn bị hàng', count: 1 },
	{ key: 'waiting-processed', label: 'Chờ lấy hàng (Đã xử lý)', count: 0 },
	{ key: 'waiting-handover', label: 'Chờ lấy hàng (Chờ bàn giao)', count: 0 },
	{
		key: 'delivery-tomorrow',
		label: 'Giao hàng trong 01 ngày tới',
		count: 15,
	},
	{ key: 'out-of-stock', label: 'Hết hàng', count: 133 },
	{ key: 'failed-delivery', label: 'Giao không thành công', count: 303 },
];

export const productCategories = [
	{ key: 'all', label: 'Tất cả', count: 1250 },
	{ key: 'electronics', label: 'Điện tử', count: 450 },
	{ key: 'fashion', label: 'Thời trang', count: 320 },
	{ key: 'home', label: 'Nhà cửa', count: 280 },
	{ key: 'sports', label: 'Thể thao', count: 200 },
];

export const dashboardStats = {
	orderStats: [
		{
			title: 'Chuẩn bị hàng',
			count: 1,
			path: '/seller/orders/preparing',
			color: 'blue',
		},
		{
			title: 'Chờ lấy hàng (Đã xử lý)',
			count: 0,
			path: '/seller/orders/waiting-processed',
			color: 'blue',
		},
		{
			title: 'Chờ lấy hàng (Chờ bàn giao)',
			count: 0,
			path: '/seller/orders/waiting-handover',
			color: 'blue',
		},
		{
			title: 'Giao hàng trong 01 ngày tới',
			count: 15,
			path: '/seller/orders/delivery-tomorrow',
			color: 'blue',
			hasAlert: true,
		},
		{
			title: 'Hết hàng',
			count: 133,
			path: '/seller/orders/out-of-stock',
			color: 'orange',
		},
		{
			title: 'Giao không thành công Chờ xử lý',
			count: 303,
			path: '/seller/orders/failed-delivery',
			color: 'orange',
		},
	],
	inventoryStats: [
		{
			title: 'Đang nhập hàng',
			count: 0,
			path: '/seller/inventory/receiving',
			color: 'blue',
		},
		{
			title: 'Các điều chỉnh tồn kho chờ xử lý',
			count: 0,
			path: '/seller/inventory/adjustments',
			color: 'blue',
		},
		{
			title: 'SKU chưa thiết lập tồn kho',
			count: 327,
			path: '/seller/inventory/sku-no-inventory',
			color: 'orange',
		},
		{
			title: 'SKU đã hết hàng',
			count: 17,
			path: '/seller/inventory/sku-out-of-stock',
			color: 'orange',
		},
		{
			title: 'SKU sắp hết hàng',
			count: 1,
			path: '/seller/inventory/sku-low-stock',
			color: 'orange',
		},
	],
	accountingStats: [
		{
			title: 'Giao dịch mới thêm đang chờ hoàn tất',
			count: 0,
			path: '/seller/accounting/pending-transactions',
			color: 'blue',
		},
		{
			title: 'SKU chưa được thiết lập Giá',
			count: 455,
			path: '/seller/accounting/sku-no-price',
			color: 'orange',
		},
	],
};

export const notifications = [
	{
		id: 1,
		title: 'TỰ ĐỘNG QUẢN LÝ ĐƠN GIAO KHÔNG THÀNH CÔNG',
		time: '19/04/2022 14:38',
		isNew: false,
	},
	{
		id: 2,
		title: 'CÔNG CỤ ĐẨY SẢN PHẨM TỰ ĐỘNG TẠI KÊNH QUẢN LÝ',
		time: '23/12/2021 15:52',
		isNew: true,
	},
	{
		id: 3,
		title: 'ZAIO OA- CÔNG THÔNG TIN HỖ TRỢ KÊNH QUẢN LÝ SHOP',
		time: '22/12/2021 10:30',
		isNew: false,
	},
	{
		id: 4,
		title: 'PHÂN BỔ ĐVVC VÀO LÚC 19H30 MỖI NGÀY',
		time: '20/12/2021 09:15',
		isNew: false,
	},
	{
		id: 5,
		title: 'CHÍNH TỒN KHO TẠI KÊNH QUÂN LÝ SHOP ƠI!',
		time: '18/12/2021 16:45',
		isNew: false,
	},
];
