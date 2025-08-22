/* eslint-disable react/prop-types */
import React from 'react';
import { FaEye } from 'react-icons/fa';

const RecentOrders = ({ orders }) => {
	// Dữ liệu mẫu cho đơn hàng gần đây
	const recentOrders = orders || [
		{
			id: 'ORD-001',
			customer: 'Nguyễn Văn A',
			amount: 2500000,
			status: 'delivered',
			date: '2024-01-15',
			items: 3,
		},
		{
			id: 'ORD-002',
			customer: 'Trần Thị B',
			amount: 1800000,
			status: 'processing',
			date: '2024-01-14',
			items: 2,
		},
		{
			id: 'ORD-003',
			customer: 'Lê Văn C',
			amount: 3200000,
			status: 'shipped',
			date: '2024-01-13',
			items: 4,
		},
		{
			id: 'ORD-004',
			customer: 'Phạm Thị D',
			amount: 1500000,
			status: 'pending',
			date: '2024-01-12',
			items: 1,
		},
		{
			id: 'ORD-005',
			customer: 'Hoàng Văn E',
			amount: 4200000,
			status: 'delivered',
			date: '2024-01-11',
			items: 5,
		},
	];

	const getStatusColor = (status) => {
		switch (status) {
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'processing':
				return 'bg-blue-100 text-blue-800';
			case 'confirmed':
				return 'bg-green-100 text-green-800';
			case 'shipped':
				return 'bg-purple-100 text-purple-800';
			case 'delivered':
				return 'bg-green-100 text-green-800';
			case 'cancelled':
				return 'bg-red-100 text-red-800';
			case 'completed':
				return 'bg-green-100 text-green-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusText = (status) => {
		switch (status) {
			case 'pending':
				return 'Chờ xác nhận';
			case 'processing':
				return 'Đang xử lý';
			case 'confirmed':
				return 'Đã xác nhận';
			case 'shipped':
				return 'Đang giao hàng';
			case 'delivered':
				return 'Đã giao hàng';
			case 'cancelled':
				return 'Đã hủy';
			case 'completed':
				return 'Đã hoàn thành';
			default:
				return 'Không xác định';
		}
	};

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
		}).format(amount);
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString('vi-VN', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});
	};

	return (
		<div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
			<div className='flex items-center justify-between mb-6'>
				<h3 className='text-lg font-semibold text-gray-900'>
					Đơn hàng gần đây
				</h3>
				<button className='text-sm text-blue-600 hover:text-blue-800 font-medium'>
					Xem tất cả
				</button>
			</div>
			<div className='space-y-4'>
				{recentOrders.map((order) => (
					<div
						key={order.id}
						className='flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200'>
						<div className='flex items-center space-x-4'>
							<div className='flex-1'>
								<div className='flex items-center space-x-2'>
									<h4 className='font-medium text-gray-900'>
										{order.id}
									</h4>
									<span
										className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
											order.status,
										)}`}>
										{getStatusText(order.status)}
									</span>
								</div>
								<p className='text-sm text-gray-600 mt-1'>
									{order.customer} • {order.items} sản phẩm
								</p>
								<p className='text-xs text-gray-500 mt-1'>
									{formatDate(order.date)}
								</p>
							</div>
						</div>
						<div className='flex items-center space-x-3'>
							<span className='font-semibold text-gray-900'>
								{formatCurrency(order.amount)}
							</span>
							<button className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200'>
								<FaEye className='h-4 w-4' />
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default RecentOrders;
