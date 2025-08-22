import LoadingThreeDot from '@/components/common/LoadingThreeDot';
import useAppQuery from '@/hooks/useAppQuery';
import OrderService from '@/services/order.service';
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
	FaMapMarkerAlt,
	FaUser,
	FaPhone,
	FaCreditCard,
	FaMoneyBillWave,
	FaCheckCircle,
} from 'react-icons/fa';
import { formatPriceVND } from '@/utils/helpers';

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

const paymentStatusConfig = {
	UNPAID: {
		label: 'Chưa thanh toán',
		color: 'text-red-500',
		bgColor: 'bg-red-50',
		borderColor: 'border-red-200',
		icon: FaMoneyBillWave,
	},
	PAID: {
		label: 'Đã thanh toán',
		color: 'text-green-600',
		bgColor: 'bg-green-50',
		borderColor: 'border-green-200',
		icon: FaCreditCard,
	},
	REFUNDED: {
		label: 'Đã hoàn tiền',
		color: 'text-orange-500',
		bgColor: 'bg-orange-50',
		borderColor: 'border-orange-200',
		icon: FaMoneyBillWave,
	},
};

const getPaymentStatusDisplay = (order) => {
	const config =
		paymentStatusConfig[order.paymentStatus] || paymentStatusConfig.UNPAID;
	let methodLabel = '';
	if (order.paymentMethod === 'COD') methodLabel = 'Thanh toán khi nhận hàng';
	if (order.paymentMethod === 'VNPAY') methodLabel = 'Thanh toán với VNPay';
	if (order.paymentMethod === 'MOMO') methodLabel = 'Thanh toán với MoMo';
	return {
		...config,
		methodLabel,
	};
};

const statusLabel = {
	COMPLETED: 'Đã nhận hàng',
	DELIVERED: 'Đã giao hàng',
	PENDING: 'Chờ xác nhận',
	CANCELLED: 'Đã hủy',
	CONFIRMED: 'Đã xác nhận',
	SHIPPING: 'Đang giao',
};

const UserOrderDetail = () => {
	const { orderId } = useParams();
	const navigate = useNavigate();
	const {
		data: order,
		isLoading,
		isError,
	} = useAppQuery(['order'], () => OrderService.getOrderDetail(orderId), {
		select: (res) => res.data,
		enabled: !!orderId,
	});

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	if (isLoading) return <LoadingThreeDot />;
	if (isError || !order)
		return (
			<div className='text-center text-red-500 py-10'>
				Không tìm thấy đơn hàng
			</div>
		);

	const paymentDisplay = getPaymentStatusDisplay(order);
	return (
		<div className='bg-gray-50 min-h-screen rounded-2xl shadow-lg p-4 md:p-8'>
			<div className='max-w-6xl mx-auto'>
				{/* Header */}
				<div className='flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2'>
					<div className='flex flex-col md:flex-row md:items-center gap-2'>
						<span className='text-lg font-semibold text-gray-700'>
							Chi tiết đơn hàng
						</span>
						<span className='font-mono text-base text-gray-500'>
							#{order.orderId}
						</span>
						<span
							className={`font-semibold ${
								statusColor[order.status] || 'text-gray-700'
							}`}>
							- {statusLabel?.[order.status] || order.status}
						</span>
					</div>
					<div className='text-sm text-gray-500'>
						Đặt lúc:{' '}
						{order.createdAt &&
							new Date(order.createdAt).toLocaleString('vi-VN')}
					</div>
				</div>

				{/* Thông tin nhận hàng & thanh toán */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
					{/* Địa chỉ */}
					<div className='bg-white rounded-xl shadow p-4 flex flex-col gap-2'>
						<div className='flex items-center gap-2 mb-2 text-blue-700 font-semibold'>
							<FaUser className='w-5 h-5' />
							THÔNG TIN NHẬN HÀNG
						</div>
						<div className='flex items-center gap-2 text-gray-700'>
							<FaUser className='w-4 h-4' />
							Người nhận:{' '}
							<span className='font-semibold'>
								{order.buyerInfo?.fullName}
							</span>
							{order.buyerInfo?.phoneNumber && (
								<span className='font-semibold'>
									{' '}
									- {order.buyerInfo.phoneNumber}
								</span>
							)}
						</div>
						<div className='flex items-center gap-2 text-gray-700'>
							<FaMapMarkerAlt className='w-4 h-4' />
							Nhận tại:{' '}
							{order.shippingAddress?.addressDetail
								? `${order.shippingAddress.addressDetail}, `
								: ''}
							{order.shippingAddress?.wardName},{' '}
							{order.shippingAddress?.districtName},{' '}
							{order.shippingAddress?.provinceName}
						</div>
						{/* Khi người bán đã xác nhận đơn hàng */}
						{order.status === 'CONFIRMED' && (
							<>
								<div className='flex items-center gap-2 text-gray-700'>
									<FaCheckCircle className='w-4 h-4' />
									Người bán đã xác nhận đơn hàng
								</div>
								<div className='text-gray-500 text-sm'>
									Nhận lúc:{' '}
									{order.createdAt &&
										new Date(
											order.createdAt,
										).toLocaleString('vi-VN')}
								</div>
							</>
						)}
					</div>
					{/* Hình thức thanh toán */}
					<div className='bg-white rounded-xl shadow p-4 flex flex-col gap-2'>
						<div className='flex items-center gap-2 mb-2 text-blue-700 font-semibold'>
							<FaCreditCard className='w-5 h-5' />
							HÌNH THỨC THANH TOÁN
						</div>
						{/* Payment method + status */}
						<div className='flex items-center gap-2'>
							<span className={`ml-2 text-base  text-gray-700`}>
								{paymentDisplay.methodLabel} -{' '}
							</span>
							<span
								className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-semibold ${paymentDisplay.bgColor} ${paymentDisplay.borderColor} ${paymentDisplay.color}`}>
								<paymentDisplay.icon
									className={`w-4 h-4 ${paymentDisplay.color}`}
								/>
								{paymentDisplay.label}
							</span>
						</div>
					</div>
				</div>

				{/* Thông tin sản phẩm */}
				<div className='bg-white rounded-xl shadow p-4 mb-6'>
					<div className='flex items-center gap-2 mb-3 text-blue-700 font-semibold'>
						<svg
							className='w-5 h-5'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M3 7h18M3 12h18M3 17h18'
							/>
						</svg>
						THÔNG TIN SẢN PHẨM
					</div>
					{order.items.map((item, idx) => (
						<div
							key={item.productId}
							className='flex flex-col md:flex-row items-center gap-4 border-b last:border-b-0 py-3'>
							<img
								src={item.thumbnail}
								alt={item.title}
								className='w-20 h-20 object-cover rounded-lg border'
							/>
							<div className='flex-1 min-w-0'>
								<div className='font-medium text-gray-900'>
									{item.title}
								</div>
								<div className='text-xs text-gray-500 mt-1'>
									Số lượng: {item.quantity}
								</div>
							</div>
							<div className='text-right'>
								<div className='font-semibold text-base text-gray-700'>
									{formatPriceVND(item.price)}
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Tổng tiền */}
				<div className='flex flex-col md:flex-row md:justify-end gap-4 mb-6'>
					<div className='bg-white rounded-xl shadow p-4 w-full md:w-1/2'>
						<div className='flex justify-between text-gray-700 mb-2'>
							<span>Tạm tính:</span>
							<span>{formatPriceVND(order.subTotal)}</span>
						</div>
						<div className='flex justify-between text-gray-700 mb-2'>
							<span>Phí vận chuyển:</span>
							<span>{formatPriceVND(order.shippingFee)}</span>
						</div>
						<div className='flex justify-between text-gray-700 mb-2'>
							<span className='text-green-500'>Giảm giá:</span>
							<span className='text-green-500'>
								- {formatPriceVND(order.discount)}
							</span>
						</div>
						<div className='flex justify-between text-lg font-bold text-blue-900 mb-2'>
							<span>Tổng tiền:</span>
							<span>{formatPriceVND(order.totalAmount)}</span>
						</div>
						<div className='flex justify-between text-lg font-bold text-red-600'>
							<span>Số tiền đã thanh toán:</span>
							<span>
								{order.paymentStatus === 'PAID'
									? formatPriceVND(order.totalAmount)
									: '0'}
							</span>
						</div>
					</div>
				</div>

				{/* Nút trở về */}
				<div className='flex justify-center'>
					<button
						onClick={() => navigate('/user/purchases')}
						className='px-6 py-2 rounded-lg border border-orange-500 text-orange-600 font-semibold bg-white hover:bg-orange-50 transition'>
						VỀ TRANG DANH SÁCH ĐƠN HÀNG
					</button>
				</div>
			</div>
		</div>
	);
};

export default UserOrderDetail;
