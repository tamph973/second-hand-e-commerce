import React from 'react';
import DashboardNotifications from '@/seller/components/DashboardNotifications';
import DashboardStats from '@/seller/components/DashboardStats';
import SalesOverview from '@/seller/components/SalesOverview';

const Dashboard = () => {
	return (
		<div className='space-y-6'>
			{/* Page Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-2xl font-bold text-gray-900'>
						Bảng tổng quan
					</h1>
					<p className='text-gray-600 mt-1'>
						Quản lý và theo dõi hoạt động bán hàng của bạn
					</p>
				</div>
			</div>

			{/* Main Content Grid */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Left Column - Stats and Tasks */}
				<div className='lg:col-span-2 space-y-6'>
					{/* Tasks to Process */}
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
						<h2 className='text-xl font-semibold text-gray-800 mb-2'>
							Danh sách việc cần xử lý
						</h2>
						<p className='text-sm text-gray-600 mb-6'>
							Những việc bạn cần hoàn thành
						</p>
						<DashboardStats />
					</div>
				</div>

				{/* Right Column - Notifications and Sales Overview */}
				<div className='space-y-6'>
					<DashboardNotifications />
					<SalesOverview />
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
