/* eslint-disable react/prop-types */
import React from 'react';
import { formatPriceVND } from '@/utils/helpers';
import { FaShoppingBag, FaUsers, FaBox, FaCreditCard } from 'react-icons/fa';

const OrdersSummary = ({ orders }) => {
	if (!orders || orders.length === 0) {
		return null;
	}

	// Tính toán các thống kê
	const totalAmount = orders.reduce(
		(sum, order) => sum + order.totalAmount,
		0,
	);
	const totalItems = orders.reduce(
		(sum, order) => sum + order.items.length,
		0,
	);
	const uniqueSellers = new Set(orders.map((order) => order.seller._id)).size;
	const uniqueOrderCodes = new Set(orders.map((order) => order.orderCode))
		.size;

	// Lấy thông tin payment chung
	const commonPayment = orders[0]?.paymentId;

	const paymentStatusConfig = {
		UNPAID: {
			label: 'Chưa thanh toán',
			color: 'text-red-500',
			bgColor: 'bg-red-50',
			borderColor: 'border-red-200',
		},
		PAID: {
			label: 'Đã thanh toán',
			color: 'text-green-600',
			bgColor: 'bg-green-50',
			borderColor: 'border-green-200',
		},
		REFUNDED: {
			label: 'Đã hoàn tiền',
			color: 'text-orange-500',
			bgColor: 'bg-orange-50',
			borderColor: 'border-orange-200',
		},
	};

	const paymentConfig =
		paymentStatusConfig[commonPayment?.status] ||
		paymentStatusConfig.UNPAID;

	return (
		<div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200'>
			<div className='flex items-center justify-between mb-6'>
				<div>
					<h2 className='text-2xl font-bold text-gray-900 mb-1'>
						Tổng quan đơn hàng
					</h2>
					<p className='text-sm text-gray-600'>
						Thông tin tổng hợp về tất cả đơn hàng của bạn
					</p>
				</div>
				<div className='text-right'>
					<div className='text-3xl font-bold text-blue-600'>
						{formatPriceVND(totalAmount)}
					</div>
					<div className='text-sm text-gray-500'>Tổng giá trị</div>
				</div>
			</div>

			{/* Statistics Grid */}
			<div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
				<div className='bg-white rounded-lg p-4 text-center'>
					<div className='flex items-center justify-center mb-2'>
						<FaShoppingBag className='text-2xl text-blue-600' />
					</div>
					<div className='text-2xl font-bold text-blue-600'>
						{orders.length}
					</div>
					<div className='text-sm text-gray-600'>Đơn hàng</div>
				</div>
				<div className='bg-white rounded-lg p-4 text-center'>
					<div className='flex items-center justify-center mb-2'>
						<FaBox className='text-2xl text-green-600' />
					</div>
					<div className='text-2xl font-bold text-green-600'>
						{totalItems}
					</div>
					<div className='text-sm text-gray-600'>Sản phẩm</div>
				</div>
				<div className='bg-white rounded-lg p-4 text-center'>
					<div className='flex items-center justify-center mb-2'>
						<FaUsers className='text-2xl text-purple-600' />
					</div>
					<div className='text-2xl font-bold text-purple-600'>
						{uniqueSellers}
					</div>
					<div className='text-sm text-gray-600'>Người bán</div>
				</div>
				<div className='bg-white rounded-lg p-4 text-center'>
					<div className='flex items-center justify-center mb-2'>
						<FaCreditCard className='text-2xl text-orange-600' />
					</div>
					<div className='text-2xl font-bold text-orange-600'>
						{uniqueOrderCodes}
					</div>
					<div className='text-sm text-gray-600'>Mã đơn</div>
				</div>
			</div>

			{/* Payment Information */}
			{commonPayment && (
				<div className='bg-white rounded-lg p-4'>
					<div className='flex items-center justify-between'>
						<div>
							<div className='font-medium text-gray-900 mb-1'>
								Thông tin thanh toán
							</div>
							<div className='text-sm text-gray-600'>
								Mã thanh toán: {commonPayment._id}
							</div>
							<div className='text-sm text-gray-600'>
								Phương thức: {commonPayment.paymentMethod}
							</div>
						</div>
						<div className='text-right'>
							<span
								className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-semibold ${paymentConfig.bgColor} ${paymentConfig.borderColor} ${paymentConfig.color}`}>
								{paymentConfig.label}
							</span>
						</div>
					</div>
				</div>
			)}

			{/* Order Codes Summary */}
			{uniqueOrderCodes > 1 && (
				<div className='mt-4 bg-white rounded-lg p-4'>
					<div className='font-medium text-gray-900 mb-2'>
						Mã đơn hàng:
					</div>
					<div className='flex flex-wrap gap-2'>
						{Array.from(
							new Set(orders.map((order) => order.orderCode)),
						).map((orderCode) => (
							<span
								key={orderCode}
								className='px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-mono'>
								{orderCode}
							</span>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default OrdersSummary;
