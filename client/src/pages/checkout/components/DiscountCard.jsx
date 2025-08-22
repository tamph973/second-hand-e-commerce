/* eslint-disable react/prop-types */
import React from 'react';
import { FaCheck } from 'react-icons/fa';

const DiscountCard = ({
	voucher,
	onReceive,
	type = 'shipping',
	isSelected = false,
}) => {
	const {
		id,
		title,
		description,
		discount,
		minOrderValue,
		validity,
		quantity,
		isReceived = false,
		isApplicable = true,
	} = voucher;

	return (
		<div
			className={`bg-white rounded-xl border-2 p-4 shadow-sm transition-all duration-200 hover:shadow-md ${
				isSelected
					? 'border-blue-500 bg-blue-50'
					: !isApplicable
					? 'border-gray-200 bg-gray-50 opacity-60'
					: 'border-gray-200 hover:border-gray-300'
			}`}>
			{/* Header with tag and quantity */}
			<div className='flex items-start justify-between mb-3'>
				<div className='flex items-center gap-2'>
					<span
						className='text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-sm'
						style={{
							background:
								'linear-gradient(to right, #2dd4bf, #3b82f6)',
						}}>
						{type === 'shipping' ? 'XTRA' : 'SALE'} Từ 2ECOC
					</span>
				</div>
				{quantity > 1 && (
					<div className='bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-medium'>
						x{quantity}
					</div>
				)}
			</div>

			{/* Title */}
			<h3 className='text-lg font-bold text-gray-900 mb-2'>{title}</h3>

			{/* Description */}
			<p className='text-sm text-gray-600 mb-3 leading-relaxed'>
				{description}
			</p>

			{/* Validity */}
			<p className='text-xs text-gray-500 mb-4 flex items-center gap-1'>
				<span
					className={`w-1.5 h-1.5 rounded-full ${
						isApplicable ? 'bg-green-500' : 'bg-red-500'
					}`}></span>
				{isApplicable
					? validity
					: `Cần đơn hàng tối thiểu ${minOrderValue?.toLocaleString(
							'vi-VN',
					  )} VNĐ`}
			</p>

			{/* Footer with conditions and action */}
			<div className='flex items-center justify-between'>
				<div className='text-xs text-gray-600 flex-1'>
					Cho sản phẩm đủ điều kiện{' '}
					<button className='text-blue-600 hover:underline font-medium'>
						Điều khoản áp dụng
					</button>
				</div>

				{/* Selection button */}
				<button
					onClick={() => onReceive(id)}
					disabled={isReceived || !isApplicable}
					className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
						isReceived || !isApplicable
							? 'bg-gray-100 border-gray-300 cursor-not-allowed'
							: isSelected
							? 'bg-blue-500 border-blue-500 hover:bg-blue-600'
							: 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
					}`}>
					{isSelected && (
						<FaCheck
							className={`text-sm ${
								isReceived || !isApplicable
									? 'text-gray-400'
									: 'text-white'
							}`}
						/>
					)}
				</button>
			</div>
		</div>
	);
};

export default DiscountCard;
