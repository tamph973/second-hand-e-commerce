import React, { useState, useEffect } from 'react';
import {
	StatsCards,
	RevenueChart,
	OrderAnalytics,
	RecentOrders,
} from '@/seller/components/dashboard';
import {
	getDashboardStats,
	getOrderStats,
	getRevenueData,
	getRecentOrders,
} from '@/seller/services/dashboardService';

const Dashboard = () => {
	const [stats, setStats] = useState(null);
	const [orderStats, setOrderStats] = useState(null);
	const [revenueData, setRevenueData] = useState(null);
	const [recentOrders, setRecentOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				setLoading(true);
				const [statsData, orderStatsData, revenueData, ordersData] =
					await Promise.all([
						getDashboardStats(),
						getOrderStats(),
						getRevenueData(),
						getRecentOrders(),
					]);

				setStats(statsData);
				setOrderStats(orderStatsData);
				setRevenueData(revenueData);
				setRecentOrders(ordersData);
			} catch (error) {
				console.error('Error fetching dashboard data:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchDashboardData();
	}, []);

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600'></div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50 p-6'>
			{/* Page Header */}
			<div className='mb-8'>
				<div className='flex items-center justify-between'>
					<div>
						<h1 className='text-3xl font-bold text-gray-900'>
							Chào mừng bạn trở lại!
						</h1>
						<p className='text-gray-600 mt-2'>
							Theo dõi và quản lý hoạt động bán hàng của bạn
						</p>
					</div>
					<div className='flex items-center space-x-4'>
						<button className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2'>
							<svg
								className='w-4 h-4'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M12 6v6m0 0v6m0-6h6m-6 0H6'
								/>
							</svg>
							<span>Sản phẩm</span>
						</button>
					</div>
				</div>
			</div>

			{/* Stats Cards */}
			<StatsCards stats={stats} />

			{/* Main Content - Full Width Sections */}
			<div className='space-y-8'>
				{/* Revenue Chart */}
				<RevenueChart data={revenueData} />

				{/* Order Analytics */}
				<OrderAnalytics orderStats={orderStats} />

				{/* Recent Orders */}
				<RecentOrders orders={recentOrders} />

				{/* Quick Actions */}
				<div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
					<h3 className='text-lg font-semibold text-gray-900 mb-4'>
						Thao tác nhanh
					</h3>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
						<button className='text-left p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200'>
							<div className='flex items-center space-x-3'>
								<div className='p-2 bg-green-100 rounded-lg'>
									<svg
										className='w-5 h-5 text-green-600'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M12 6v6m0 0v6m0-6h6m-6 0H6'
										/>
									</svg>
								</div>
								<div>
									<p className='font-medium text-gray-900'>
										Thêm sản phẩm mới
									</p>
									<p className='text-sm text-gray-600'>
										Tạo sản phẩm mới để bán
									</p>
								</div>
							</div>
						</button>

						<button className='text-left p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200'>
							<div className='flex items-center space-x-3'>
								<div className='p-2 bg-blue-100 rounded-lg'>
									<svg
										className='w-5 h-5 text-blue-600'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
										/>
									</svg>
								</div>
								<div>
									<p className='font-medium text-gray-900'>
										Xem đơn hàng
									</p>
									<p className='text-sm text-gray-600'>
										Quản lý tất cả đơn hàng
									</p>
								</div>
							</div>
						</button>

						<button className='text-left p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200'>
							<div className='flex items-center space-x-3'>
								<div className='p-2 bg-purple-100 rounded-lg'>
									<svg
										className='w-5 h-5 text-purple-600'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
										/>
									</svg>
								</div>
								<div>
									<p className='font-medium text-gray-900'>
										Báo cáo chi tiết
									</p>
									<p className='text-sm text-gray-600'>
										Xem báo cáo doanh thu
									</p>
								</div>
							</div>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
