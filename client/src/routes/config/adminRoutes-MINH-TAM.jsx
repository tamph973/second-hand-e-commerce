import Dashboard from '@/admin/page/Dashboard';
import AddBrand from '@/admin/page/brand/AddBrand';
import Category from '@/admin/page/category/Category';
import CategoryUpdate from '@/admin/page/category/CategoryUpdate';
import SubCategory from '@/admin/page/category/SubCategory';
import Discount from '@/admin/page/discount/Discount';
import ProductListRequest from '@/admin/page/product/vendor/ProductListRequest';
import ProductListApproved from '@/admin/page/product/vendor/ProductListApproved';
import ProductListRejected from '@/admin/page/product/vendor/ProductListRejected';

const adminRoutes = [
	{ path: '/admin/dashboard', component: Dashboard, layout: 'admin' },
	{ path: '/admin/categories', component: Category, layout: 'admin' },
	{ path: '/admin/category/:id', component: CategoryUpdate, layout: 'admin' },
	{ path: '/admin/sub-categories', component: SubCategory, layout: 'admin' },
	{ path: '/admin/brands/add', component: AddBrand, layout: 'admin' },
	{ path: '/admin/discounts', component: Discount, layout: 'admin' },
	{
		path: '/admin/vendor-products/requests',
		component: ProductListRequest,
		layout: 'admin',
	},
	{
		path: '/admin/vendor-products/approved',
		component: ProductListApproved,
		layout: 'admin',
	},
	{
		path: '/admin/vendor-products/rejected',
		component: ProductListRejected,
		layout: 'admin',
	},
];

export default adminRoutes;
