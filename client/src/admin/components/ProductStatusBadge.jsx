/* eslint-disable react/prop-types */
import React from 'react';
import { Badge } from 'flowbite-react';
import {
	HiClock,
	HiCheckCircle,
	HiXCircle,
	HiExclamation,
	HiEye,
	HiEyeOff,
} from 'react-icons/hi';

const ProductStatusBadge = ({ status }) => {
	const getStatusConfig = (status) => {
		switch (status?.toUpperCase()) {
			case 'PENDING':
				return {
					color: 'yellow',
					icon: HiClock,
					text: 'Chờ duyệt',
					bgColor: 'bg-yellow-50',
					textColor: 'text-yellow-700',
					borderColor: 'border-yellow-200',
				};
			case 'APPROVED':
				return {
					color: 'success',
					icon: HiCheckCircle,
					text: 'Đã duyệt',
					bgColor: 'bg-green-50',
					textColor: 'text-green-700',
					borderColor: 'border-green-200',
				};
			case 'REJECTED':
				return {
					color: 'failure',
					icon: HiXCircle,
					text: 'Từ chối',
					bgColor: 'bg-red-50',
					textColor: 'text-red-700',
					borderColor: 'border-red-200',
				};
			case 'DRAFT':
				return {
					color: 'gray',
					icon: HiExclamation,
					text: 'Nháp',
					bgColor: 'bg-gray-50',
					textColor: 'text-gray-700',
					borderColor: 'border-gray-200',
				};
			case 'ACTIVE':
				return {
					color: 'success',
					icon: HiEye,
					text: 'Đang hoạt động',
					bgColor: 'bg-emerald-50',
					textColor: 'text-emerald-700',
					borderColor: 'border-emerald-200',
				};
			case 'INACTIVE':
				return {
					color: 'gray',
					icon: HiEyeOff,
					text: 'Không hoạt động',
					bgColor: 'bg-gray-50',
					textColor: 'text-gray-700',
					borderColor: 'border-gray-200',
				};
			default:
				return {
					color: 'gray',
					icon: HiClock,
					text: 'Không xác định',
					bgColor: 'bg-gray-50',
					textColor: 'text-gray-700',
					borderColor: 'border-gray-200',
				};
		}
	};

	const config = getStatusConfig(status);
	const IconComponent = config.icon;

	return (
		<Badge
			color={config.color}
			className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor} transition-all duration-200 hover:scale-105`}>
			<span className='flex items-center gap-1'>
				<IconComponent className='w-3 h-3' />
				{config.text}
			</span>
		</Badge>
	);
};

export default ProductStatusBadge;
