// Public routes
export const publicRoutes = {
	HOME: '/',
	USER: '/user/*',
	CART: '/cart',
	SEARCH: '/search',

	// PRODUCT ROUTES
	PRODUCTS: '/products',
	PRODUCT_DETAIL: '/products/:slug',
	CATEGORIES: '/categories',
	PRODUCTS_CATEGORY: '/categories/:categorySlug',
	CHECKOUT: '/checkout',
	CHECKOUT_SUCCESS: '/checkout/success',
	WISHLIST: '/wishlist',
	SHOP: '/shop/:shopId',
};

// SELLER ROUTES
export const sellerRoutes = {
	SELLER_DASHBOARD: '/seller/dashboard',
	SELLER_PRODUCTS: '/seller/products',
	SELLER_ORDERS: '/seller/orders',
	SELLER_ORDER_DETAIL: '/seller/orders/:orderId',
	SELLER_PRODUCT_CREATE: '/seller/products/create',
};

// ADMIN ROUTES
export const adminRoutes = {
	ADMIN_DASHBOARD: '/admin/dashboard',
	ADMIN_USERS: '/admin/users',
	ADMIN_ORDERS: '/admin/orders',
	ADMIN_ORDER_DETAIL: '/admin/orders/:orderId',
	ADMIN_PRODUCT_CREATE: '/admin/products/create',
};
