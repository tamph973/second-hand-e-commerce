/* eslint-disable react/prop-types */
import React from 'react';
import { formatPriceVND } from '@/utils/helpers';
import { useNavigate } from 'react-router-dom';

const OrdersList = ({ orders }) => {
	const navigate = useNavigate();

	const statusColor = {
		PENDING: 'text-yellow-500',
		CONFIRMED: 'text-blue-500',
		SHIPPING: 'text-indigo-500',
		DELIVERED: 'text-green-600',
		CANCELLED: 'text-red-500',
		FAILED: 'text-gray-400',
		RETURNED: 'text-orange-500',
		COMPLETED: 'text-green-600',
	};

	const statusLabel = {
		COMPLETED: 'Đã nhận hàng',
		DELIVERED: 'Đã giao hàng',
		PENDING: 'Chờ xác nhận',
		CANCELLED: 'Đã hủy',
		CONFIRMED: 'Đã xác nhận',
		SHIPPING: 'Đang vận chuyển',
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

	const handleViewOrder = (orderId) => {
		navigate(`/orders/${orderId}`);
	};

	const handleViewShop = (sellerId) => {
		navigate(`/shop/${sellerId}`);
	};

	return (
		<div className='space-y-4'>
			{orders.map((order) => {
				const paymentConfig =
					paymentStatusConfig[order.paymentId?.status] ||
					paymentStatusConfig.UNPAID;

				return (
					<div
						key={order._id}
						className='bg-white rounded-xl shadow-md p-6'>
						{/* Header */}
						<div className='flex justify-between items-start mb-4'>
							<div className='flex-1'>
								<div className='flex items-center gap-3 mb-2'>
									<h3 className='text-lg font-semibold text-gray-900'>
										Đơn hàng #{order.orderCode}
									</h3>
									<span
										className={`inline-flex items-center px-2 py-1 rounded-full border text-xs font-semibold ${paymentConfig.bgColor} ${paymentConfig.borderColor} ${paymentConfig.color}`}>
										{paymentConfig.label}
									</span>
								</div>
								<div className='text-sm text-gray-600'>
									Ngày đặt:{' '}
									{new Date(order.createdAt).toLocaleString(
										'vi-VN',
									)}
								</div>
							</div>
							<div className='text-right'>
								<div className='text-lg font-bold text-blue-600'>
									{formatPriceVND(order.totalAmount)}
								</div>
								<div className='text-sm text-gray-500'>
									{order.items.length} sản phẩm
								</div>
							</div>
						</div>

						{/* Seller Info */}
						<div className='flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg'>
							<div className='flex items-center gap-3'>
								<img
									src={order.seller.avatar.url}
									alt={order.seller.fullName}
									className='w-10 h-10 rounded-full object-cover'
								/>
								<div>
									<div className='font-medium text-gray-900'>
										{order.seller.fullName}
									</div>
									<div className='text-sm text-gray-600'>
										Người bán
									</div>
								</div>
							</div>
							<button
								onClick={() => handleViewShop(order.seller._id)}
								className='text-blue-600 hover:text-blue-800 text-sm font-medium'>
								Xem shop
							</button>
						</div>

						{/* Products */}
						<div className='space-y-3 mb-4'>
							{order.items.map((item) => (
								<div
									key={item._id}
									className='flex items-center gap-3 p-3 border border-gray-200 rounded-lg'>
									<img
										src={item.productId.thumbnail.url}
										alt={item.productId.title}
										className='w-16 h-16 object-cover rounded-lg'
									/>
									<div className='flex-1'>
										<div className='font-medium text-gray-900 line-clamp-2'>
											{item.productId.title}
										</div>
										{/* <div className='text-sm text-gray-600'>
											{item.productId.condition} •{' '}
											{item.productId.attributes?.color ||
												'N/A'}
										</div> */}
										<div className='text-sm text-gray-600'>
											Số lượng: {item.quantity} ×{' '}
											{formatPriceVND(item.price)}
										</div>
									</div>
									<div className='text-right'>
										<div className='font-semibold text-gray-900'>
											{formatPriceVND(
												item.quantity * item.price,
											)}
										</div>
									</div>
								</div>
							))}
						</div>

						{/* Order Summary */}
						<div className='border-t border-gray-200 pt-4'>
							<div className='space-y-2 text-sm'>
								<div className='flex justify-between'>
									<span>Tạm tính:</span>
									<span>
										{formatPriceVND(order.subTotal)}
									</span>
								</div>
								{order.discount > 0 && (
									<div className='flex justify-between text-green-600'>
										<span>Giảm giá:</span>
										<span>
											-{formatPriceVND(order.discount)}
										</span>
									</div>
								)}
								<div className='flex justify-between'>
									<span>Phí vận chuyển:</span>
									<span>
										{formatPriceVND(order.shippingFee)}
									</span>
								</div>
								<div className='flex justify-between font-semibold text-lg border-t border-gray-200 pt-2'>
									<span>Tổng cộng:</span>
									<span className='text-blue-600'>
										{formatPriceVND(order.totalAmount)}
									</span>
								</div>
							</div>
						</div>

						{/* Actions */}
						<div className='flex justify-between items-center mt-4 pt-4 border-t border-gray-200'>
							<div className='flex items-center gap-2'>
								<span className='text-sm text-gray-600'>
									Trạng thái:
								</span>
								<span
									className={`font-medium ${
										statusColor[order.status] ||
										'text-gray-600'
									}`}>
									{statusLabel[order.status] || order.status}
								</span>
							</div>
							<div className='flex gap-2'>
								<button
									onClick={() => handleViewOrder(order._id)}
									className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium'>
									Xem chi tiết
								</button>
								{order.paymentId?.status === 'UNPAID' && (
									<button className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium'>
										Hủy đơn hàng
									</button>
								)}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default OrdersList;
