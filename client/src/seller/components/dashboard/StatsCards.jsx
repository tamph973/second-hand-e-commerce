/* eslint-disable react/prop-types */
import React from 'react';
import { FaSackDollar } from 'react-icons/fa6';
import { FaExclamationTriangle, FaUser, FaShoppingBag } from 'react-icons/fa';
import { formatPriceVND } from '@/utils/helpers';
const StatsCards = ({ stats }) => {
	console.log(stats);
	const cards = [
		{
			title: 'DOANH THU THỰC TẾ',
			value: formatPriceVND(stats?.sellerBalance || 0),
			change: '+12%',
			changeType: 'increase',
			icon: FaSackDollar,
			iconColor: 'bg-green-500',
			iconBg: 'bg-green-100',
			textColor: 'text-green-600',
			subtitle: 'Sau khi trừ hoa hồng',
		},
		// {
		// 	title: 'SỐ DƯ HIỆN TẠI',
		// 	value: stats?.sellerBalance
		// 		? new Intl.NumberFormat('vi-VN').format(stats.sellerBalance)
		// 		: '50.000.000',
		// 	change: '',
		// 	changeType: 'neutral',
		// 	icon: FaSackDollar,
		// 	iconColor: 'bg-emerald-500',
		// 	iconBg: 'bg-emerald-100',
		// 	textColor: 'text-emerald-600',
		// 	unit: '₫',
		// 	subtitle: 'Có thể rút tiền',
		// },
		{
			title: 'TỔNG ĐƠN HÀNG',
			value: stats?.totalOrders || 0,
			change: '+8%',
			changeType: 'increase',
			icon: FaShoppingBag,
			iconColor: 'bg-blue-500',
			iconBg: 'bg-blue-100',
			textColor: 'text-blue-600',
			unit: '',
			subtitle: 'Tất cả trạng thái',
		},
		{
			title: 'SẢN PHẨM SẮP HẾT',
			value: stats?.lowStockProducts || 0,
			change: '',
			changeType: 'neutral',
			icon: FaExclamationTriangle,
			iconColor: 'bg-red-500',
			iconBg: 'bg-red-100',
			textColor: 'text-red-600',
			unit: '',
			subtitle: 'Dưới 10 sản phẩm',
		},
	];

	return (
		<div className='grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4'>
			{cards.map((card, index) => (
				<div
					key={index}
					className='p-6 transition-all duration-300 bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-lg hover:border-gray-300'>
					<div className='relative flex items-start justify-between mb-4'>
						<div className='flex-1'>
							<p className='mb-1 text-sm font-medium text-gray-600'>
								{card.title}
							</p>
							{card.subtitle && (
								<p className='mb-2 text-xs text-gray-500'>
									{card.subtitle}
								</p>
							)}
							<div className='flex items-baseline mb-2'>
								<p className='px-4 text-3xl font-bold text-gray-900'>
									{card.value}
								</p>
								{card.unit && (
									<span className='ml-1 text-lg font-semibold text-gray-600'>
										{card.unit}
									</span>
								)}
							</div>
							{card.change && (
								<div className='flex items-center'>
									<span
										className={`text-sm font-medium ${
											card.changeType === 'increase'
												? 'text-green-600'
												: card.changeType === 'decrease'
												? 'text-red-600'
												: 'text-gray-500'
										}`}>
										{card.change}
									</span>
									<span className='ml-1 text-xs text-gray-500'>
										so với tháng trước
									</span>
								</div>
							)}
						</div>
						<div
							className={`p-3 rounded-xl ${card.iconBg} flex-shrink-0 absolute top-0 right-0`}>
							<card.icon
								className={`h-6 w-6 ${card.iconColor} text-white`}
							/>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default StatsCards;
