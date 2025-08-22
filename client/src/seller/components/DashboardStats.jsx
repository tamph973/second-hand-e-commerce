import { Link } from 'react-router-dom';
import { dashboardStats } from '@/seller/constants/menuItems';

export default function DashboardStats() {
	const { orderStats, inventoryStats, accountingStats } = dashboardStats;

	const getColorClasses = (color) => {
		const colors = {
			blue: 'bg-blue-50 border-blue-200 text-blue-800',
			orange: 'bg-orange-50 border-orange-200 text-orange-800',
			red: 'bg-red-50 border-red-200 text-red-800',
			green: 'bg-green-50 border-green-200 text-green-800',
		};
		return colors[color] || colors.blue;
	};

	const getCountColor = (color) => {
		const colors = {
			blue: 'text-blue-600',
			orange: 'text-orange-600',
			red: 'text-red-600',
			green: 'text-green-600',
		};
		return colors[color] || colors.blue;
	};

	return (
		<div className='space-y-6'>
			{/* Orders Section */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
				<h3 className='text-lg font-semibold text-gray-800 mb-4'>
					Đơn hàng
				</h3>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{orderStats.map((stat, index) => (
						<Link
							key={index}
							to={stat.path}
							className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${getColorClasses(
								stat.color,
							)}`}>
							<div className='flex items-center justify-between'>
								<div className='flex-1'>
									<p className='text-sm font-medium mb-1'>
										{stat.title}
									</p>
									<p
										className={`text-2xl font-bold ${getCountColor(
											stat.color,
										)}`}>
										{stat.count}
									</p>
								</div>
								{stat.hasAlert && (
									<div className='w-3 h-3 bg-red-500 rounded-full'></div>
								)}
							</div>
						</Link>
					))}
				</div>
			</div>

			{/* Inventory Section */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
				<h3 className='text-lg font-semibold text-gray-800 mb-4'>
					Tồn kho
				</h3>
				<div className='mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200'>
					<p className='text-sm text-blue-800'>
						Khi bạn thay đổi thông tin tồn kho trên Kênh Quản Lý
						Shop, dữ liệu tồn kho trên Kênh Người Bán sẽ được tự
						động cập nhật tương ứng.
					</p>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{inventoryStats.map((stat, index) => (
						<Link
							key={index}
							to={stat.path}
							className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${getColorClasses(
								stat.color,
							)}`}>
							<div className='flex items-center justify-between'>
								<div className='flex-1'>
									<p className='text-sm font-medium mb-1'>
										{stat.title}
									</p>
									<p
										className={`text-2xl font-bold ${getCountColor(
											stat.color,
										)}`}>
										{stat.count}
									</p>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>

			{/* Accounting Section */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
				<h3 className='text-lg font-semibold text-gray-800 mb-4'>
					Kế toán
				</h3>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{accountingStats.map((stat, index) => (
						<Link
							key={index}
							to={stat.path}
							className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${getColorClasses(
								stat.color,
							)}`}>
							<div className='flex items-center justify-between'>
								<div className='flex-1'>
									<p className='text-sm font-medium mb-1'>
										{stat.title}
									</p>
									<p
										className={`text-2xl font-bold ${getCountColor(
											stat.color,
										)}`}>
										{stat.count}
									</p>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
