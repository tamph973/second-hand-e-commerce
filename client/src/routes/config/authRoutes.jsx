import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import AdminLogin from '@/pages/auth/AdminLogin';
import RegisterSeller from '@/seller/pages/auth/RegisterSeller';
import CCCDVerificationPage from '@/seller/pages/auth/CCCDVerificationPage';

const authRoutes = [
	// Routes within MainLayout
	{ path: '/auth/login', component: Login, layout: null },
	{ path: '/auth/register', component: Register, layout: null },

	{
		path: '/auth/forgot-password',
		component: ForgotPassword,
		layout: 'main',
	},
	{
		path: '/auth/reset-password',
		component: ResetPassword,
		layout: 'main',
	},

	// Standalone routes
	{ path: '/auth/admin/login', component: AdminLogin, layout: null },
	{ path: '/seller/register', component: RegisterSeller, layout: null },
	{
		path: '/seller/verify-cccd',
		component: CCCDVerificationPage,
		layout: null,
	},
];

export default authRoutes;
