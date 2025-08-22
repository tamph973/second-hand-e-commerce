import {
	Orders,
	Products,
	Dashboard,
	OrderDetail,
	ProductCreate,
} from '@/seller';

const sellerRoutes = [
	{ path: '/seller/dashboard', component: Dashboard, layout: 'seller' },
	{ path: '/seller/products', component: Products, layout: 'seller' },
	{ path: '/seller/orders', component: Orders, layout: 'seller' },
	{
		path: '/seller/orders/:orderId',
		component: OrderDetail,
		layout: 'seller',
	},
	{
		path: '/seller/products/create',
		component: ProductCreate,
	},
	// { path: '/seller/profile', component: Profile, layout: 'seller' },
	// { path: '/seller/settings', component: Settings, layout: 'seller' },
	// { path: '/seller/logout', component: Logout, layout: 'seller' },
];

export default sellerRoutes;
