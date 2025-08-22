import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import AdminLayout from '@/layouts/AdminLayout';
import { PrivateRoute } from './PrivateRoute';
import SellerLayout from '@/layouts/SellerLayout';

// Route configs
import publicRoutes from './config/publicRoutes';
import authRoutes from './config/authRoutes';
import adminRoutes from './config/adminRoutes';
import sellerRoutes from './config/sellerRoutes';

export default function AppRoute() {
	

	return (
		<Routes>
			{/* Public Routes with MainLayout */}
			<Route element={<MainLayout />}>
				{publicRoutes.map((route) => (
					<Route
						key={route.path}
						path={route.path}
						element={<route.component />}
					/>
				))}
				{authRoutes
					.filter((route) => route.layout === 'main')
					.map((route) => (
						<Route
							key={route.path}
							path={route.path}
							element={<route.component />}
						/>
					))}
			</Route>

			{/* Standalone Auth Routes */}
			{authRoutes
				.filter((route) => route.layout === null)
				.map((route) => (
					<Route
						key={route.path}
						path={route.path}
						element={<route.component />}
					/>
				))}

			{/* Private Admin Routes */}
			<Route element={<PrivateRoute isAdmin={true} />}>
				<Route element={<AdminLayout />}>
					{adminRoutes.map((route) => (
						<Route
							key={route.path}
							path={route.path}
							element={<route.component />}
						/>
					))}
				</Route>
			</Route>

			{/* Private Seller Routes */}
			<Route element={<PrivateRoute isSeller={true} />}>
				<Route element={<SellerLayout />}>
					{sellerRoutes.map((route) => (
						<Route
							key={route.path}
							path={route.path}
							element={<route.component />}
						/>
					))}
				</Route>
			</Route>
			{/* 404 page */}
			{/* <Route path='*' element={<NoPage />}></Route> */}
		</Routes>
	);
}
