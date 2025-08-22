import React from 'react';
import { formatPriceVND } from '@/utils/helpers';

const MultipleOrdersSummary = ({ orders, paymentId, onViewOrder }) => {
	return (
		<div className='bg-white rounded-xl shadow-md p-6'>
			<div className='mb-4'>
				<h3 className='text-lg font-semibold text-gray-900'>
					Đơn hàng đã được tạo
				</h3>
				<p className='text-sm text-gray-600'>
					Đã tạo {orders.length} đơn hàng từ các người bán khác nhau
				</p>
			</div>

			<div className='space-y-3'>
				{orders.map((order, index) => (
					<div
						key={order.orderId}
						className='border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer'
						onClick={() => onViewOrder(order.orderId)}>
						<div className='flex justify-between items-start'>
							<div className='flex-1'>
								<div className='font-medium text-gray-900'>
									Đơn hàng #{order.orderCode}
								</div>
								<div className='text-sm text-gray-600'>
									Người bán: {order.sellerName || 'N/A'}
								</div>
								<div className='text-sm text-gray-600'>
									Trạng thái:
									<span
										className={`ml-1 font-medium ${
											order.status === 'PENDING'
												? 'text-yellow-600'
												: order.status === 'CONFIRMED'
												? 'text-blue-600'
												: 'text-gray-600'
										}`}>
										{order.status}
									</span>
								</div>
							</div>
							<div className='text-right'>
								<div className='font-semibold text-gray-900'>
									{formatPriceVND(order.totalAmount)}
								</div>
								<button
									className='text-blue-600 text-sm hover:text-blue-800 mt-1'
									onClick={(e) => {
										e.stopPropagation();
										onViewOrder(order.orderId);
									}}>
									Xem chi tiết
								</button>
							</div>
						</div>
					</div>
				))}
			</div>

			<div className='mt-4 pt-4 border-t border-gray-200'>
				<div className='text-sm text-gray-600'>
					Mã thanh toán:{' '}
					<span className='font-mono'>{paymentId}</span>
				</div>
				<div className='text-sm text-gray-600'>
					Tất cả đơn hàng sẽ được xử lý cùng một lúc
				</div>
			</div>
		</div>
	);
};

export default MultipleOrdersSummary;
