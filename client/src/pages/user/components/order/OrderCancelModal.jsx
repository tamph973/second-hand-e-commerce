import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaExclamationCircle, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const OrderCancelModal = ({ isOpen, onClose, onConfirm }) => {
	const [selectedReason, setSelectedReason] = useState('');
	const [otherReason, setOtherReason] = useState('');

	const cancelReasons = [
		{
			id: 'update_info',
			label: 'Tôi muốn cập nhật địa chỉ/sđt nhận hàng',
		},
		{
			id: 'no_response',
			label: 'Người bán không trả lời thắc mắc / yêu cầu của tôi',
		},
		{
			id: 'change_order',
			label: 'Thay đổi đơn hàng (màu sắc, kích thước, thêm mã giảm giá,...)',
		},
		{
			id: 'no_need',
			label: 'Tôi không có nhu cầu mua nữa',
		},
		{
			id: 'other',
			label: 'Lý do khác',
		},
	];

	const handleConfirm = () => {
		if (!selectedReason) {
			alert('Vui lòng chọn lý do hủy đơn hàng');
			return;
		}

		const reason =
			selectedReason === 'other'
				? otherReason
				: cancelReasons.find((r) => r.id === selectedReason)?.label;

		onConfirm({
			reason,
			reasonType: selectedReason,
		});
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
			<div className='bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto'>
				{/* Header */}
				<div className='p-4 border-b border-gray-200'>
					<div className='flex items-center justify-between'>
						<h2 className='text-lg font-semibold text-gray-900'>
							Lý Do Hủy
						</h2>
						<button
							onClick={onClose}
							className='text-gray-400 hover:text-gray-600 transition-colors'>
							<FaTimes size={20} />
						</button>
					</div>
				</div>

				{/* Warning Section */}
				<div className='p-4 bg-orange-50 border border-orange-200 mx-4 mt-4 rounded-lg'>
					<div className='flex items-start gap-3'>
						<FaExclamationCircle className='text-orange-500 mt-0.5 flex-shrink-0' />
						<div className='text-sm text-gray-700'>
							<p className='mb-2'>
								<strong>Bạn có biết?</strong> Bạn có thể cập
								nhật thông tin nhận hàng cho đơn hàng (1 lần duy
								nhất). Nếu bạn xác nhận hủy, toàn bộ đơn hàng sẽ
								được hủy.
							</p>
							<p>
								Trường hợp bạn đã thanh toán đơn hàng, tiền sẽ
								được hoàn về ví của bạn trong mục
								<Link
									to='/user/wallet'
									className='text-blue-500 hover:underline font-semibold px-1'>
									&quot;Tiền của tôi&quot;
								</Link>
								trong vòng 24 giờ và lâu hơn đối với các phương
								thức thanh toán khác.
							</p>
						</div>
					</div>
				</div>

				{/* Body - Radio Buttons */}
				<div className='p-4'>
					<div className='space-y-3'>
						{cancelReasons.map((reason) => (
							<label
								key={reason.id}
								className='flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors'>
								<input
									type='radio'
									name='cancelReason'
									value={reason.id}
									checked={selectedReason === reason.id}
									onChange={(e) =>
										setSelectedReason(e.target.value)
									}
									className='mt-1 text-red-600 focus:ring-red-500 border-2 border-gray-300'
								/>
								<span className='text-sm text-gray-700 leading-relaxed'>
									{reason.label}
								</span>
							</label>
						))}
					</div>

					{/* Other Reason Input */}
					{selectedReason === 'other' && (
						<div className='mt-4 text-textPrimary'>
							<textarea
								value={otherReason}
								onChange={(e) => setOtherReason(e.target.value)}
								placeholder='Vui lòng nhập lý do hủy đơn hàng...'
								className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none'
								rows='3'
							/>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className='p-4 border-t border-gray-200'>
					<button
						onClick={handleConfirm}
						className='w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2'>
						Xác nhận hủy
					</button>
				</div>
			</div>
		</div>
	);
};

OrderCancelModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onConfirm: PropTypes.func.isRequired,
	orderId: PropTypes.string.isRequired,
};

export default OrderCancelModal;
