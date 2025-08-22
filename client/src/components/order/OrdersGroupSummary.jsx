/* eslint-disable react/prop-types */
import React from 'react';
import { formatPriceVND } from '@/utils/helpers';

const OrdersGroupSummary = ({ orders }) => {
	// Tính tổng các giá trị
	const totalAmount = orders.reduce(
		(sum, order) => sum + order.totalAmount,
		0,
	);
	const totalItems = orders.reduce(
		(sum, order) => sum + order.items.length,
		0,
	);
	const uniqueSellers = new Set(orders.map((order) => order.seller._id)).size;

	// Lấy thông tin payment chung (tất cả orders cùng paymentId)
	const commonPayment = orders[0]?.paymentId;

	// Kiểm tra xem có phải tất cả orders cùng trạng thái không
	const allSameStatus = orders.every(
		(order) => order.status === orders[0].status,
	);
	const commonStatus = allSameStatus ? orders[0].status : 'MIXED';

	const statusColor = {
		PENDING: 'text-yellow-500',
		CONFIRMED: 'text-blue-500',
		SHIPPING: 'text-indigo-500',
		DELIVERED: 'text-green-600',
		CANCELLED: 'text-red-500',
		FAILED: 'text-gray-400',
		RETURNED: 'text-orange-500',
		COMPLETED: 'text-green-600',
		MIXED: 'text-gray-600',
	};

	const statusLabel = {
		COMPLETED: 'Đã nhận hàng',
		DELIVERED: 'Đã giao hàng',
		PENDING: 'Chờ xác nhận',
		CANCELLED: 'Đã hủy',
		CONFIRMED: 'Đã xác nhận',
		SHIPPING: 'Đang vận chuyển',
		MIXED: 'Trạng thái khác nhau',
	};

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
			<div className='flex items-center justify-between mb-4'>
				<div>
					<h2 className='text-xl font-bold text-gray-900 mb-1'>
						Đơn hàng #{orders[0].orderCode}
					</h2>
				</div>
				<div className='text-right'>
					<div className='text-2xl font-bold text-blue-600'>
						{formatPriceVND(totalAmount)}
					</div>
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
				<div className='bg-white rounded-lg p-4 text-center'>
					<div className='text-2xl font-bold text-blue-600'>
						{orders.length}
					</div>
					<div className='text-sm text-gray-600'>Đơn hàng</div>
				</div>
				<div className='bg-white rounded-lg p-4 text-center'>
					<div className='text-2xl font-bold text-green-600'>
						{totalItems}
					</div>
					<div className='text-sm text-gray-600'>Sản phẩm</div>
				</div>
				<div className='bg-white rounded-lg p-4 text-center'>
					<div className='text-2xl font-bold text-purple-600'>
						{uniqueSellers}
					</div>
					<div className='text-sm text-gray-600'>Người bán</div>
				</div>
			</div>

			{/* <div className='flex flex-wrap items-center gap-4 text-sm'>
				<div className='flex items-center gap-2'>
					<span className='text-gray-600'>Trạng thái:</span>
					<span
						className={`font-medium ${statusColor[commonStatus]}`}>
						{statusLabel[commonStatus]}
					</span>
				</div>
				<div className='flex items-center gap-2'>
					<span className='text-gray-600'>Thanh toán:</span>
					<span
						className={`inline-flex items-center px-2 py-1 rounded-full border text-xs font-semibold ${paymentConfig.bgColor} ${paymentConfig.borderColor} ${paymentConfig.color}`}>
						{paymentConfig.label}
					</span>
				</div>
				<div className='flex items-center gap-2'>
					<span className='text-gray-600'>Ngày đặt:</span>
					<span className='font-medium'>
						{new Date(orders[0].createdAt).toLocaleDateString(
							'vi-VN',
						)}
					</span>
				</div>
			</div> */}

			{/* Thông tin người bán */}
			<div className='mt-4'>
				<h3 className='font-semibold text-gray-900 mb-2'>Người bán:</h3>
				<div className='space-y-2'>
					{orders.map((order, index) => (
						<div
							key={order.seller._id}
							className='flex items-center justify-between bg-white rounded-lg p-3'>
							<div className='flex items-center gap-3'>
								<img
									src={order.seller.avatar.url}
									alt={order.seller.fullName}
									className='w-8 h-8 rounded-full object-cover'
								/>
								<div>
									<div className='font-medium text-gray-900'>
										{order.seller.fullName}
									</div>
									<div className='text-sm text-gray-600'>
										{order.items.length} sản phẩm
									</div>
								</div>
							</div>
							<div className='text-right'>
								<div className='font-semibold text-gray-900'>
									{formatPriceVND(order.totalAmount)}
								</div>
								<div className='text-xs text-gray-500'>
									Đơn #{index + 1}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Thông tin thanh toán */}
			{commonPayment && (
				<div className='mt-4 p-3 bg-white rounded-lg'>
					<div className='text-sm text-gray-600 mb-1'>
						Thông tin thanh toán:
					</div>
					<div className='flex items-center justify-between'>
						<div>
							<div className='font-medium text-gray-900'>
								Mã thanh toán: {commonPayment._id}
							</div>
							<div className='text-sm text-gray-600'>
								Phương thức: {commonPayment.paymentMethod}
							</div>
						</div>
						<div className='text-right'>
							<div className='font-semibold text-gray-900'>
								{formatPriceVND(totalAmount)}
							</div>
							<div className='text-xs text-gray-500'>
								Tổng thanh toán
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default OrdersGroupSummary;
