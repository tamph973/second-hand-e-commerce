import React from 'react';
import PropTypes from 'prop-types';
import { formatPriceVND } from '@/utils/helpers';
import LoadingThreeDot from '@/components/common/LoadingThreeDot';

const OrderSummary = ({
	subtotal,
	discount,
	shippingFee,
	total,
	onCheckout,
	isProcessing,
}) => {
	return (
		<div className='bg-white rounded-2xl shadow-xl p-6'>
			<h2 className='text-xl font-bold mb-6 text-gray-900'>
				Tóm tắt đơn hàng
			</h2>
			{/* Tổng tiền hàng */}
			<div className='flex justify-between items-center mb-4'>
				<span className='text-gray-700'>Tổng tiền hàng:</span>
				<span className='font-semibold text-gray-900'>
					{formatPriceVND(subtotal)}
				</span>
			</div>
			{/* Voucher giảm giá */}
			<div className='flex justify-between items-center mb-4'>
				<span className='text-gray-700'>Voucher giảm giá:</span>
				<span className='font-semibold text-green-600'>
					{discount > 0 ? `-${formatPriceVND(discount)}` : '0 ₫'}
				</span>
			</div>
			{/* Phí vận chuyển */}
			<div className='flex justify-between items-center mb-4'>
				<span className='text-gray-700'>Phí vận chuyển:</span>
				<span className='font-semibold text-gray-900'>
					{formatPriceVND(shippingFee)}
				</span>
			</div>
			{/* Đường kẻ phân cách */}
			<div className='border-t border-gray-200 my-4'></div>
			{/* Tổng cộng */}
			<div className='flex justify-between items-center mb-6'>
				<span className='text-lg font-bold text-gray-900'>
					Tổng cộng:
				</span>
				<span className='text-2xl font-bold text-orange-600'>
					{formatPriceVND(total)}
				</span>
			</div>
			{/* Nút thanh toán */}
			<button
				onClick={onCheckout}
				className='w-full py-4 rounded-xl text-white font-bold text-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] mb-4 disabled:opacity-50 disabled:cursor-not-allowed'
				disabled={isProcessing}
				style={{
					background: 'linear-gradient(to right, #6b46c1, #4f46e5)',
				}}>
				{isProcessing ? <LoadingThreeDot /> : 'Xác nhận đặt hàng'}
			</button>
			{/* Thông tin bổ sung */}
			<div className='text-center text-sm text-gray-500'>
				<p className='mb-2'>
					Bạn muốn dùng thêm mã giảm giá hoặc thay đổi số lượng sản
					phẩm?
				</p>
				<a
					href='/cart'
					className='text-blue-600 hover:text-blue-700 hover:underline font-medium'>
					Quay lại giỏ hàng
				</a>
			</div>
			{/* Thông tin bảo mật */}
			<div className='mt-4 pt-4 border-t border-gray-100'>
				<div className='flex items-center justify-center text-xs text-gray-400'>
					<span className='mr-2'>🔒</span>
					<span>Thanh toán an toàn với SSL</span>
				</div>
			</div>
		</div>
	);
};

OrderSummary.propTypes = {
	subtotal: PropTypes.number.isRequired,
	discount: PropTypes.number.isRequired,
	shippingFee: PropTypes.number.isRequired,
	total: PropTypes.number.isRequired,
	onCheckout: PropTypes.func.isRequired,
	isProcessing: PropTypes.bool.isRequired,
};

export default OrderSummary;
