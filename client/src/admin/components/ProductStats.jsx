import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'flowbite-react';
import {
	HiClipboardList,
	HiClock,
	HiCheckCircle,
	HiXCircle,
	HiEye,
	HiEyeOff,
} from 'react-icons/hi';

const ProductStats = ({ stats = {} }) => {
	// Sử dụng stats từ API hoặc fallback về 0
	const {
		total = 0,
		pending = 0,
		approved = 0,
		rejected = 0,
		active = 0,
		inactive = 0,
	} = stats;

	const statCards = [
		{
			title: 'Tất cả sản phẩm',
			value: total,
			icon: HiClipboardList,
			color: 'blue',
			bgColor: 'bg-blue-50',
			textColor: 'text-blue-600',
			description: 'Tổng số sản phẩm',
		},
		{
			title: 'Chờ duyệt',
			value: pending,
			icon: HiClock,
			color: 'yellow',
			bgColor: 'bg-yellow-50',
			textColor: 'text-yellow-600',
			description: 'Cần kiểm duyệt',
		},
		{
			title: 'Đã duyệt',
			value: approved,
			icon: HiCheckCircle,
			color: 'green',
			bgColor: 'bg-green-50',
			textColor: 'text-green-600',
			description: 'Đã được phê duyệt',
		},
		{
			title: 'Từ chối',
			value: rejected,
			icon: HiXCircle,
			color: 'red',
			bgColor: 'bg-red-50',
			textColor: 'text-red-600',
			description: 'Bị từ chối',
		},
		{
			title: 'Đang hoạt động',
			value: active,
			icon: HiEye,
			color: 'green',
			bgColor: 'bg-emerald-50',
			textColor: 'text-emerald-600',
			description: 'Đang bán',
		},
		{
			title: 'Không hoạt động',
			value: inactive,
			icon: HiEyeOff,
			color: 'gray',
			bgColor: 'bg-gray-50',
			textColor: 'text-gray-600',
			description: 'Tạm ngưng',
		},
	];

	return (
		<div className='grid grid-cols-3 gap-4 mb-8'>
			{statCards.map((stat, index) => {
				const IconComponent = stat.icon;
				return (
					<Card
						key={index}
						className='transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer dark:bg-white dark:border-0 dark:shadow-none !border !border-gray-200'>
						<div className='flex items-center justify-between'>
							<div className='flex-1'>
								<p className='text-xs font-medium text-gray-500 mb-1'>
									{stat.description}
								</p>
								<p className='text-xl font-bold text-gray-900 mb-1'>
									{stat.value.toLocaleString()}
								</p>
								<p className='text-xs text-gray-600'>
									{stat.title}
								</p>
							</div>
							<div
								className={`p-2 rounded-full ${stat.bgColor} ml-3`}>
								<IconComponent
									className={`w-5 h-5 ${stat.textColor}`}
								/>
							</div>
						</div>
					</Card>
				);
			})}
		</div>
	);
};

ProductStats.propTypes = {
	stats: PropTypes.object,
};

export default ProductStats;
