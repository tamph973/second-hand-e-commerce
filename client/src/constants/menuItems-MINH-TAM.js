import orderBuy from '@/assets/icons/icon-shopping-bag.png';
import orderSell from '@/assets/icons/icon-list.png';
import seller from '@/assets/icons/icon-seller.png';
import postProduct from '@/assets/icons/icon-post-product.png';
import profile from '@/assets/icons/icon-user-profile.png';
import dashboard from '@/assets/icons/icon-dashboard.png';

export const userMenuItems = [
	{
		group: 'Quản lí đơn hàng',
		items: [
			{
				key: 'orders_buy',
				title: 'Đơn mua',
				path: '/user/purchases',
				icon: orderBuy,
				roles: ['USER', 'SELLER'],
			},
			{
				key: 'orders_sell',
				title: 'Đơn bán',
				path: '/orders/sell',
				icon: orderSell,
				roles: ['SELLER'],
			},
		],
	},
	{
		group: 'Dành cho người bán',
		items: [
			{
				key: 'seller_dashboard',
				title: 'Quản lý bán hàng',
				path: '/seller/dashboard',
				icon: dashboard,
				roles: ['SELLER'],
			},
			{
				key: 'register_seller',
				title: 'Đăng ký bán hàng',
				path: '/seller/register',
				icon: seller,
				roles: ['USER'],
			},
			{
				key: 'post_product',
				title: 'Đăng bán',
				path: '/seller/create-product',
				icon: postProduct,
				roles: ['SELLER'],
			},
		],
	},
	{
		group: 'Quản lí tài khoản',
		items: [
			{
				key: 'profile',
				title: 'Thông tin cá nhân',
				path: '/user/profile',
				icon: profile,
				roles: ['USER', 'SELLER'],
			},
		],
	},
];

export const adminMenuItems = [
	{
		key: 'dashboard',
		title: 'Tổng quan',
		items: [
			{
				key: 'dashboard',
				title: 'Bảng điều khiển',
				icon: '🏠',
				path: '/admin/dashboard',
				type: 'single',
			},
			// {
			// 	key: 'pos',
			// 	title: 'POS',
			// 	icon: '💳',
			// 	path: '/admin/pos',
			// 	type: 'single',
			// },
		],
	},
	{
		key: 'orders',
		title: 'Quản lý đơn hàng',
		items: [
			{
				key: 'orders',
				title: 'Đơn hàng',
				icon: '🛒',
				type: 'submenu',
				subItems: [
					{
						key: 'orders_all',
						title: 'Tất cả',
						path: '/admin/orders/all',
						badge: '190',
						badgeColor: 'info',
					},
					{
						key: 'orders_pending',
						title: 'Chờ xác nhận',
						path: '/admin/orders/pending',
						badge: '58',
						badgeColor: 'info',
					},
					{
						key: 'orders_confirmed',
						title: 'Đã xác nhận',
						path: '/admin/orders/confirmed',
						badge: '21',
						badgeColor: 'success',
					},
					{
						key: 'orders_processing',
						title: 'Đang xử lý',
						path: '/admin/orders/processing',
						badge: '9',
						badgeColor: 'warning',
					},
					{
						key: 'orders_out_for_delivery',
						title: 'Đang giao hàng',
						path: '/admin/orders/out-for-delivery',
						badge: '8',
						badgeColor: 'warning',
					},
					{
						key: 'orders_delivered',
						title: 'Đã giao hàng',
						path: '/admin/orders/delivered',
						badge: '76',
						badgeColor: 'success',
					},
					{
						key: 'orders_returned',
						title: 'Đã hoàn hàng',
						path: '/admin/orders/returned',
						badge: '4',
						badgeColor: 'danger',
					},
					{
						key: 'orders_canceled',
						title: 'Đã hủy',
						path: '/admin/orders/canceled',
						badge: '9',
						badgeColor: 'danger',
					},
				],
			},
			{
				key: 'refunds',
				title: 'Yêu cầu hoàn trả',
				icon: '💰',
				type: 'submenu',
				subItems: [
					{
						key: 'refunds_pending',
						title: 'Đang xử lý',
						path: '/admin/refunds/pending',
						badge: '4',
						badgeColor: 'danger',
					},
					{
						key: 'refunds_approved',
						title: 'Đã xác nhận',
						path: '/admin/refunds/approved',
						badge: '2',
						badgeColor: 'info',
					},
					{
						key: 'refunds_refunded',
						title: 'Đã hoàn trả',
						path: '/admin/refunds/refunded',
						badge: '3',
						badgeColor: 'success',
					},
					{
						key: 'refunds_rejected',
						title: 'Đã từ chối',
						path: '/admin/refunds/rejected',
						badge: '3',
						badgeColor: 'danger',
					},
				],
			},
		],
	},
	{
		key: 'products',
		title: 'Quản lý sản phẩm',
		items: [
			{
				key: 'categories',
				title: 'Danh mục',
				icon: '📂',
				type: 'submenu',
				subItems: [
					{
						key: 'categories',
						title: 'Danh mục',
						path: '/admin/categories',
					},
					{
						key: 'sub_categories',
						title: 'Danh mục con',
						path: '/admin/sub-categories',
					},
				],
			},
			{
				key: 'brands',
				title: 'Thương hiệu',
				icon: '🏷️',
				type: 'submenu',
				subItems: [
					{
						key: 'brands_add',
						title: 'Thêm mới',
						path: '/admin/brands/add',
					},
					{
						key: 'brands_list',
						title: 'Danh sách',
						path: '/admin/brands/list',
					},
				],
			},
			// {
			// 	key: 'attributes',
			// 	title: 'Thuộc tính sản phẩm',
			// 	icon: '⚙️',
			// 	path: '/admin/attributes',
			// 	type: 'single',
			// },
			{
				key: 'products',
				title: 'Sản phẩm',
				icon: '📦',
				type: 'submenu',
				subItems: [
					{
						key: 'products_in_house',
						title: 'Danh sách sản phẩm',
						path: '/admin/products/in-house',
						badge: '194',
						badgeColor: 'success',
					},
					{
						key: 'products_add',
						title: 'Thêm mới sản phẩm',
						path: '/admin/products/add',
					},
					// {
					// 	key: 'products_bulk_import',
					// 	title: 'Nhập hàng',
					// 	path: '/admin/products/bulk-import',
					// },
					// {
					// 	key: 'products_restock_requests',
					// 	title: 'Yêu cầu nhập hàng',
					// 	path: '/admin/products/restock-requests',
					// },
				],
			},
			{
				key: 'vendorProducts',
				title: 'Sản phẩm từ người bán',
				icon: '🏪',
				type: 'submenu',
				subItems: [
					{
						key: 'vendor_products_requests',
						title: 'Yêu cầu sản phẩm mới',
						path: '/admin/vendor-products/requests',
						badge: '36',
						badgeColor: 'danger',
					},
					// {
					// 	key: 'vendor_products_update_requests',
					// 	title: 'Yêu cầu cập nhật sản phẩm',
					// 	path: '/admin/vendor-products/update-requests',
					// 	badge: '0',
					// 	badgeColor: 'info',
					// },
					{
						key: 'vendor_products_approved',
						title: 'Sản phẩm đã được phê duyệt',
						path: '/admin/vendor-products/approved',
						badge: '172',
						badgeColor: 'success',
					},
					{
						key: 'vendor_products_rejected',
						title: 'Sản phẩm bị từ chối',
						path: '/admin/vendor-products/rejected',
						badge: '0',
						badgeColor: 'danger',
					},
				],
			},
		],
	},
	{
		key: 'promotions',
		title: 'Quản lý khuyến mãi',
		items: [
			// {
			// 	key: 'banners',
			// 	title: 'Banner',
			// 	icon: '🎯',
			// 	path: '/admin/banners',
			// 	type: 'single',
			// },
			{
				key: 'offers',
				title: 'Mã giảm giá & Ưu đãi',
				icon: '🎁',
				type: 'submenu',
				subItems: [
					{
						key: 'discounts',
						title: 'Mã giảm giá',
						path: '/admin/discounts',
					},
					// {
					// 	key: 'flash_deals',
					// 	title: 'Flash Deals',
					// 	path: '/admin/flash-deals',
					// },
					// {
					// 	key: 'deal_of_day',
					// 	title: 'Deal of the day',
					// 	path: '/admin/deal-of-day',
					// },
					// {
					// 	key: 'featured_deals',
					// 	title: 'Featured Deal',
					// 	path: '/admin/featured-deals',
					// },
					// {
					// 	key: 'clearance_sale',
					// 	title: 'Clearance Sale',
					// 	path: '/admin/clearance-sale',
					// },
				],
			},
			// {
			// 	key: 'notifications',
			// 	title: 'Notifications',
			// 	icon: '📢',
			// 	type: 'submenu',
			// 	subItems: [
			// 		{
			// 			key: 'notifications_send',
			// 			title: 'Send notification',
			// 			path: '/admin/notifications/send',
			// 		},
			// 		{
			// 			key: 'notifications_push_setup',
			// 			title: 'Push notifications setup',
			// 			path: '/admin/push-notifications',
			// 		},
			// 	],
			// },
			// {
			// 	key: 'announcement',
			// 	title: 'Announcement',
			// 	icon: '📢',
			// 	path: '/admin/announcements',
			// 	type: 'single',
			// },
		],
	},
	// {
	// 	key: 'support',
	// 	title: 'Hỗ trợ & Liên lạc',
	// 	items: [
	// 		{
	// 			key: 'inbox',
	// 			title: 'Inbox',
	// 			icon: '📧',
	// 			path: '/admin/inbox',
	// 			type: 'single',
	// 		},
	// 		{
	// 			key: 'messages',
	// 			title: 'Messages',
	// 			icon: '💬',
	// 			path: '/admin/messages',
	// 			type: 'single',
	// 		},
	// 		{
	// 			key: 'support',
	// 			title: 'Support Ticket',
	// 			icon: '🎧',
	// 			path: '/admin/support-tickets',
	// 			type: 'single',
	// 		},
	// 	],
	// },
	// {
	// 	key: 'reports',
	// 	title: 'Báo cáo & Phân tích',
	// 	items: [
	// 		{
	// 			key: 'reports',
	// 			title: 'Sales & Transaction Report',
	// 			icon: '📊',
	// 			type: 'submenu',
	// 			subItems: [
	// 				{
	// 					key: 'reports_earnings',
	// 					title: 'Earning Reports',
	// 					path: '/admin/reports/earnings',
	// 				},
	// 				{
	// 					key: 'reports_inhouse_sales',
	// 					title: 'Inhouse Sales',
	// 					path: '/admin/reports/inhouse-sales',
	// 				},
	// 				{
	// 					key: 'reports_vendor_sales',
	// 					title: 'Vendor Sales',
	// 					path: '/admin/reports/vendor-sales',
	// 				},
	// 				{
	// 					key: 'reports_transactions',
	// 					title: 'Transaction Report',
	// 					path: '/admin/reports/transactions',
	// 				},
	// 			],
	// 		},
	// 		{
	// 			key: 'productReport',
	// 			title: 'Product Report',
	// 			icon: '📈',
	// 			path: '/admin/reports/products',
	// 			type: 'single',
	// 		},
	// 		{
	// 			key: 'orderReport',
	// 			title: 'Order Report',
	// 			icon: '📋',
	// 			path: '/admin/reports/orders',
	// 			type: 'single',
	// 		},
	// 	],
	// },
	{
		key: 'users',
		title: 'Quản lý người dùng',
		items: [
			{
				key: 'customers',
				title: 'Khách hàng',
				icon: '👥',
				type: 'submenu',
				subItems: [
					{
						key: 'customers_list',
						title: 'Danh sách khách hàng',
						path: '/admin/customers/list',
					},
					// {
					// 	key: 'customers_reviews',
					// 	title: 'Đánh giá khách hàng',
					// 	path: '/admin/customers/reviews',
					// },
					// {
					// 	key: 'customers_wallet',
					// 	title: 'Ví khách hàng',
					// 	path: '/admin/customers/wallet',
					// },
					// {
					// 	key: 'customers_wallet_bonus',
					// 	title: 'Thiết lập ví khách hàng',
					// 	path: '/admin/customers/wallet-bonus',
					// },
					// {
					// 	key: 'customers_loyalty',
					// 	title: 'Điểm thưởng khách hàng',
					// 	path: '/admin/customers/loyalty',
					// },
				],
			},
			{
				key: 'vendors',
				title: 'Người bán',
				icon: '🏪',
				type: 'submenu',
				subItems: [
					{
						key: 'vendors_add',
						title: 'Thêm mới người bán',
						path: '/admin/vendors/add',
					},
					{
						key: 'vendors_list',
						title: 'Danh sách người bán',
						path: '/admin/vendors/list',
					},
					{
						key: 'vendors_withdraws',
						title: 'Rút tiền',
						path: '/admin/vendors/withdraws',
					},
					// {
					// 	key: 'vendors_withdrawal_methods',
					// 	title: 'Phương thức rút tiền',
					// 	path: '/admin/vendors/withdrawal-methods',
					// },
				],
			},
			// {
			// 	key: 'delivery',
			// 	title: 'Delivery men',
			// 	icon: '🚚',
			// 	type: 'submenu',
			// 	subItems: [
			// 		{
			// 			key: 'delivery_add',
			// 			title: 'Add new',
			// 			path: '/admin/delivery/add',
			// 		},
			// 		{
			// 			key: 'delivery_list',
			// 			title: 'List',
			// 			path: '/admin/delivery/list',
			// 		},
			// 		{
			// 			key: 'delivery_withdraws',
			// 			title: 'Withdraws',
			// 			path: '/admin/delivery/withdraws',
			// 		},
			// 		{
			// 			key: 'delivery_emergency',
			// 			title: 'Emergency Contact',
			// 			path: '/admin/delivery/emergency',
			// 		},
			// 	],
			// },
			// {
			// 	key: 'employees',
			// 	title: 'Employees',
			// 	icon: '👨‍💼',
			// 	type: 'submenu',
			// 	subItems: [
			// 		{
			// 			key: 'employees_roles',
			// 			title: 'Employee Role Setup',
			// 			path: '/admin/employees/roles',
			// 		},
			// 		{
			// 			key: 'employees_list',
			// 			title: 'Employees',
			// 			path: '/admin/employees/list',
			// 		},
			// 	],
			// },
			// {
			// 	key: 'subscribers',
			// 	title: 'Subscribers',
			// 	icon: '📧',
			// 	path: '/admin/subscribers',
			// 	type: 'single',
			// },
		],
	},
	// {
	// 	key: 'settings',
	// 	title: 'Cài đặt hệ thống',
	// 	items: [
	// 		{
	// 			key: 'business',
	// 			title: 'Business Setup',
	// 			icon: '⚙️',
	// 			path: '/admin/business-setup',
	// 			type: 'single',
	// 		},
	// 		{
	// 			key: 'inhouse',
	// 			title: 'Inhouse Shop',
	// 			icon: '🏪',
	// 			path: '/admin/inhouse-shop',
	// 			type: 'single',
	// 		},
	// 		{
	// 			key: 'seo',
	// 			title: 'SEO Settings',
	// 			icon: '🔍',
	// 			path: '/admin/seo-settings',
	// 			type: 'single',
	// 		},
	// 		{
	// 			key: 'priority',
	// 			title: 'Priority Setup',
	// 			icon: '📋',
	// 			path: '/admin/priority-setup',
	// 			type: 'single',
	// 		},
	// 		{
	// 			key: 'pages',
	// 			title: 'Pages & Media',
	// 			icon: '📄',
	// 			type: 'submenu',
	// 			subItems: [
	// 				{
	// 					key: 'pages_business',
	// 					title: 'Business Pages',
	// 					path: '/admin/pages/business',
	// 				},
	// 				{
	// 					key: 'pages_social_media',
	// 					title: 'Social Media Links',
	// 					path: '/admin/pages/social-media',
	// 				},
	// 				{
	// 					key: 'pages_vendor_registration',
	// 					title: 'Vendor Registration',
	// 					path: '/admin/pages/vendor-registration',
	// 				},
	// 			],
	// 		},
	// 		{
	// 			key: 'system',
	// 			title: 'System Setup',
	// 			icon: '🔧',
	// 			path: '/admin/system-setup',
	// 			type: 'single',
	// 		},
	// 		{
	// 			key: 'login',
	// 			title: 'Login Settings',
	// 			icon: '🔐',
	// 			path: '/admin/login-settings',
	// 			type: 'single',
	// 		},
	// 		{
	// 			key: 'email',
	// 			title: 'Email Template',
	// 			icon: '📧',
	// 			path: '/admin/email-templates',
	// 			type: 'single',
	// 		},
	// 		{
	// 			key: 'gallery',
	// 			title: 'Gallery',
	// 			icon: '🖼️',
	// 			path: '/admin/gallery',
	// 			type: 'single',
	// 		},
	// 		{
	// 			key: 'payments',
	// 			title: 'Payment Methods',
	// 			icon: '💳',
	// 			path: '/admin/payment-methods',
	// 			type: 'single',
	// 		},
	// 		{
	// 			key: 'firebase',
	// 			title: 'Firebase',
	// 			icon: '🔥',
	// 			path: '/admin/firebase',
	// 			type: 'single',
	// 		},
	// 		{
	// 			key: 'marketing',
	// 			title: 'Marketing Tools',
	// 			icon: '📈',
	// 			path: '/admin/marketing-tools',
	// 			type: 'single',
	// 		},
	// 		{
	// 			key: 'social',
	// 			title: 'Other Configuration',
	// 			icon: '🔗',
	// 			path: '/admin/social-config',
	// 			type: 'single',
	// 		},
	// 		{
	// 			key: 'theme',
	// 			title: 'Theme Setup',
	// 			icon: '🎨',
	// 			path: '/admin/theme-setup',
	// 			type: 'single',
	// 		},
	// 		{
	// 			key: 'addons',
	// 			title: 'System Addons',
	// 			icon: '🔌',
	// 			path: '/admin/addons',
	// 			type: 'single',
	// 		},
	// 	],
	// },
	// {
	// 	key: 'content',
	// 	title: 'Nội dung',
	// 	items: [
	// 		{
	// 			key: 'blog',
	// 			title: 'Blog',
	// 			icon: '📝',
	// 			type: 'submenu',
	// 			subItems: [
	// 				{
	// 					key: 'blog_add',
	// 					title: 'Add new',
	// 					path: '/admin/blog/add',
	// 				},
	// 				{
	// 					key: 'blog_list',
	// 					title: 'List',
	// 					path: '/admin/blog/list',
	// 				},
	// 			],
	// 		},
	// 	],
	// },
];
