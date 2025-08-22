import CartPage from '@/pages/cart/CartPage';
import CheckoutPage from '@/pages/checkout/Checkout';
import CheckoutSuccess from '@/pages/checkout/CheckoutSuccess';
import Home from '@/pages/home/Home';
import ProductDetail from '@/pages/productDetail/ProductDetail';
import UserLayout from '@/pages/user/UserLayout';
import ShopPage from '@/pages/shop/ShopPage';
import CategoryPage from '@/pages/category/CategoryPage';
import Products from '@/pages/product/Products';
import SearchPage from '@/pages/search/SearchPage';
import Wishlist from '@/pages/wishlist/Wishlist';

const publicRoutes = [
	{ path: '/', component: Home },
	{ path: '/user/*', component: UserLayout },
	{
		path: '/cart',
		component: CartPage,
	},
	{
		path: '/search',
		component: SearchPage,
	},
	{
		path: '/products',
		component: SearchPage,
	},
	{
		path: '/checkout',
		component: CheckoutPage,
	},
	{
		path: '/checkout/success',
		component: CheckoutSuccess,
	},
	{
		path: '/wishlist',
		component: Wishlist,
	},
	{
		path: '/products/:slug',
		component: ProductDetail,
	},
	{
		path: '/shop/:shopId',
		component: ShopPage,
	},
	// Route cho danh mục sản phẩm - phải đặt trước /products/:slug để tránh conflict
	{
		path: '/:categorySlug',
		component: Products,
	},
	{
		path: '/categories',
		component: CategoryPage,
	},
];

export default publicRoutes;
