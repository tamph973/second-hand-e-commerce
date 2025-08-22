import { Link } from 'react-router-dom';
import { notifications } from '@/seller/constants/menuItems';

export default function DashboardNotifications() {
	return (
		<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
			<div className='flex items-center justify-between mb-4'>
				<h3 className='text-lg font-semibold text-gray-800'>
					Thông báo
				</h3>
				<Link
					to='/seller/notifications'
					className='text-sm text-blue-600 hover:text-blue-800 font-medium'>
					Xem tất cả
				</Link>
			</div>
			<div className='space-y-3'>
				{notifications.map((notification) => (
					<div
						key={notification.id}
						className='p-4 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors'>
						<div className='flex items-start justify-between'>
							<div className='flex-1'>
								<p className='text-sm font-medium text-gray-800 mb-1'>
									{notification.title}
								</p>
								<p className='text-xs text-gray-500'>
									{notification.time}
								</p>
							</div>
							{notification.isNew && (
								<span className='ml-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full'>
									Mới
								</span>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
