/* eslint-disable react/prop-types */
import React from 'react';
import {
	FaClock,
	FaTruck,
	FaTimesCircle,
	FaExclamationTriangle,
	FaArrowAltCircleRight,
	FaArchive,
	FaCheck,
} from 'react-icons/fa';

const OrderAnalytics = ({ orderStats }) => {
	const statusCards = [
		{
			title: 'Chờ xác nhận',
			count: orderStats?.pending || 3,
			icon: FaClock,
			color: 'text-blue-600',
			bgColor: 'bg-blue-50',
			iconColor: 'text-blue-600',
		},
		{
			title: 'Đã xác nhận',
			count: orderStats?.confirmed || 4,
			icon: FaCheck,
			color: 'text-green-600',
			bgColor: 'bg-green-50',
			iconColor: 'text-green-600',
		},
		{
			title: 'Đang đóng gói',
			count: orderStats?.packaging || 1,
			icon: FaArchive,
			color: 'text-orange-600',
			bgColor: 'bg-orange-50',
			iconColor: 'text-orange-600',
		},
		{
			title: 'Đang giao hàng',
			count: orderStats?.outForDelivery || 2,
			icon: FaTruck,
			color: 'text-purple-600',
			bgColor: 'bg-purple-50',
			iconColor: 'text-purple-600',
		},
		{
			title: 'Đã giao hàng',
			count: orderStats?.delivered || 10,
			icon: FaCheck,
			color: 'text-green-600',
			bgColor: 'bg-green-50',
			iconColor: 'text-green-600',
		},
		{
			title: 'Đã hủy',
			count: orderStats?.canceled || 1,
			icon: FaTimesCircle,
			color: 'text-red-600',
			bgColor: 'bg-red-50',
			iconColor: 'text-red-600',
		},
		{
			title: 'Đã hoàn trả',
			count: orderStats?.returned || 1,
			icon: FaArrowAltCircleRight,
			color: 'text-indigo-600',
			bgColor: 'bg-indigo-50',
			iconColor: 'text-indigo-600',
		},
		{
			title: 'Giao hàng thất bại',
			count: orderStats?.failedToDelivery || 2,
			icon: FaExclamationTriangle,
			color: 'text-red-600',
			bgColor: 'bg-red-50',
			iconColor: 'text-red-600',
		},
	];

	return (
		<div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
			<div className='flex items-center justify-between mb-6'>
				<div className='flex items-center'>
					<div className='p-2 bg-indigo-100 rounded-lg mr-3'>
						<svg
							className='w-5 h-5 text-indigo-600'
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
					<h3 className='text-lg font-semibold text-gray-900'>
						Thống kê đơn hàng
					</h3>
				</div>
				<div className='flex items-center space-x-2'>
					<select className='text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500'>
						<option>Tổng quan</option>
						<option>Tháng này</option>
						<option>Tuần này</option>
					</select>
				</div>
			</div>
			<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
				{statusCards.map((card, index) => (
					<div
						key={index}
						className={`${card.bgColor} rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow duration-200`}>
						<div className='flex items-center justify-between'>
							<div className='flex-1'>
								<p className='text-sm font-medium text-gray-600 mb-1'>
									{card.title}
								</p>
								<p
									className={`text-2xl font-bold ${card.color}`}>
									{card.count}
								</p>
							</div>
							<div className={`p-2 rounded-lg ${card.bgColor}`}>
								<card.icon
									className={`h-5 w-5 ${card.iconColor}`}
								/>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default OrderAnalytics;
