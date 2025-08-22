/* eslint-disable react/prop-types */
import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const MultipleOrdersWarning = ({ orders }) => {
	// Kiểm tra xem có orders cùng orderCode không
	const orderCodeGroups = {};
	orders.forEach((order) => {
		if (!orderCodeGroups[order.orderCode]) {
			orderCodeGroups[order.orderCode] = [];
		}
		orderCodeGroups[order.orderCode].push(order);
	});

	const hasDuplicateOrderCodes = Object.values(orderCodeGroups).some(
		(group) => group.length > 1,
	);

	if (!hasDuplicateOrderCodes) {
		return null;
	}

	return (
		<div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6'>
			<div className='flex items-start gap-3'>
				<FaExclamationTriangle className='text-yellow-600 text-xl mt-0.5 flex-shrink-0' />
				<div className='flex-1'>
					<h3 className='text-lg font-semibold text-yellow-800 mb-2'>
						⚠️ Lưu ý về vấn đề hiện tại
					</h3>
					<div className='text-yellow-700 space-y-2 text-sm'>
						<p>
							Phát hiện các đơn hàng có cùng mã đơn hàng từ các
							người bán khác nhau:
						</p>
						{Object.entries(orderCodeGroups).map(
							([orderCode, orderGroup]) => {
								if (orderGroup.length > 1) {
									return (
										<div
											key={orderCode}
											className='ml-4 p-2 bg-yellow-100 rounded border-l-4 border-yellow-400'>
											<p className='font-medium'>
												Mã đơn:{' '}
												<span className='font-mono'>
													{orderCode}
												</span>
											</p>
											<p className='text-xs mt-1'>
												{orderGroup.length} đơn hàng từ{' '}
												{
													new Set(
														orderGroup.map(
															(o) => o.seller._id,
														),
													).size
												}{' '}
												người bán
											</p>
										</div>
									);
								}
								return null;
							},
						)}
						<div className='mt-3 p-2 bg-blue-50 rounded border-l-4 border-blue-400'>
							<p className='text-blue-800 text-xs'>
								<strong>Nguyên nhân:</strong> Race condition
								trong hàm tạo mã đơn hàng khi tạo nhiều đơn cùng
								lúc.
							</p>
							<p className='text-blue-800 text-xs mt-1'>
								<strong>Giải pháp:</strong> Cần sửa logic
								generateOrderCode() để đảm bảo tính duy nhất.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MultipleOrdersWarning;
