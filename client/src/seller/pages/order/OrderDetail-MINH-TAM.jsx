import Table from '@/components/common/Table';
import useAppQuery from '@/hooks/useAppQuery';
import OrderService from '@/services/order.service';
import { formatPriceVND } from '@/utils/helpers';
import { FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import { TableCell, TableRow } from 'flowbite-react';
import { useParams } from 'react-router-dom';
import CustomInput from '@/components/form/CustomInput';
import { ORDER_STATUS_OPTIONS } from '@/constants/productOptions';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
const headers = [
	{
		label: 'Tên sản phẩm',
		key: 'title',
	},
	{
		label: 'Số lượng',
		key: 'quantity',
	},
	{
		label: 'Giá',
		key: 'price',
	},
	{
		label: 'Tổng tiền',
		key: 'total',
	},
];

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
	SHIPPING: 'Đang vận chuyển',
};
const OrderDetail = () => {
	const { orderId } = useParams();
	const queryClient = useQueryClient();
	const {
		data: order = [],
		isLoading,
		isError,
	} = useAppQuery(
		['orderDetail', orderId],
		() => OrderService.getOrderDetail(orderId),
		{
			select: (res) => res.data,
			enabled: !!orderId,
		},
	);

	if (isLoading) {
		return <div>Đang tải dữ liệu đơn hàng...</div>;
	}
	if (isError) {
		return <div>Không thể tải dữ liệu đơn hàng!</div>;
	}
	if (!order) {
		return <div>Không có dữ liệu đơn hàng.</div>;
	}

	const paymentDisplay = getPaymentStatusDisplay(order);
	const handleChangeStatus = async (e) => {
		try {
			const res = await OrderService.updateOrderStatus(
				orderId,
				e.target.value,
			);
			if (res.status === 200) {
				toast.success('Cập nhật trạng thái đơn hàng thành công');
				queryClient.invalidateQueries(['orderDetail', orderId]);
			}
		} catch (error) {
			toast.error('Cập nhật trạng thái đơn hàng thất bại');
		}
	};
	return (
		<div className='flex flex-col lg:flex-row gap-6 p-6 bg-gray-50 min-h-screen text-textPrimary'>
			{/* Cột trái */}
			<div className='flex-1 bg-white rounded-xl shadow-md p-6'>
				<h2 className='text-2xl font-bold mb-2 flex items-center gap-2'>
					<span role='img' aria-label='order'>
						📝
					</span>
					Chi tiết đơn hàng
				</h2>
				<div className='flex flex-col md:flex-row md:items-center md:justify-between mb-4'>
					<div>
						<span className='font-semibold'>Mã đơn hàng:</span>
						<span className='ml-2 text-blue-600 font-mono'>
							#{order.orderCode}
						</span>
					</div>
					<div className='text-gray-500 text-sm'>
						{order.createdAt &&
							new Date(order.createdAt).toLocaleString('vi-VN')}
					</div>
				</div>
				{/* <div className='flex gap-2 mb-4'>
					<button className='btn-primary'>
						Show locations on map
					</button>
					<button className='btn-secondary'>Print Invoice</button>
				</div> */}
				<div className='mb-2 flex items-center gap-1'>
					<span className='font-semibold'>Trạng thái:</span>
					<span
						className={`font-semibold ${
							statusColor[order.status] || 'text-gray-700'
						}`}>
						{statusLabel?.[order.status] || order.status}
					</span>
				</div>
				<div className='mb-2'>
					<span className='font-semibold'>
						Phương thức thanh toán:
					</span>
					<span className='ml-2'>{paymentDisplay.methodLabel}</span>
				</div>
				<div className='mb-2 flex items-center gap-1'>
					<span className='font-semibold'>
						Trạng thái thanh toán:
					</span>
					<span
						className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-semibold ${paymentDisplay.bgColor} ${paymentDisplay.borderColor} ${paymentDisplay.color}`}>
						<paymentDisplay.icon
							className={`w-4 h-4 ${paymentDisplay.color}`}
						/>
						{paymentDisplay.label}
					</span>
				</div>

				{/* Table sản phẩm */}
				<div className='overflow-x-auto'>
					<Table
						headers={headers}
						data={order.items}
						renderRow={(item) => (
							<TableRow
								key={item.id}
								className='hover:!bg-gray-200'>
								<TableCell>
									<div className='flex items-center gap-2'>
										<img
											src={item.thumbnail}
											alt={item.title}
											className='w-10 h-10 object-cover'
										/>
										<div>{item.title}</div>
									</div>
								</TableCell>
								<TableCell>{item.quantity}</TableCell>
								<TableCell>{item.price}</TableCell>
								<TableCell>
									{item.quantity * item.price}
								</TableCell>
							</TableRow>
						)}
					/>
				</div>

				{/* Tổng kết */}
				<div className='mt-6 space-y-1 text-right'>
					<div>
						Giá sản phẩm:{' '}
						<span className='font-bold'>
							{formatPriceVND(order.subTotal)}
						</span>
					</div>
					<div>
						Tạm tính:{' '}
						<span className='font-bold'>
							{formatPriceVND(order.subTotal)}
						</span>
					</div>
					{order.itemDiscount && (
						<div>
							Giảm giá sản phẩm:{' '}
							<span className='font-bold'>
								{formatPriceVND(order.itemDiscount)}
							</span>
						</div>
					)}
					<div>
						Phí vận chuyển:{' '}
						<span className='font-bold'>
							{formatPriceVND(order.shippingFee)}
						</span>
					</div>
					<div className='text-lg mt-2'>
						Total:{' '}
						<span className='font-bold text-blue-600'>
							{order.total?.toLocaleString() ||
								(
									order.subTotal +
									(order.tax || 0) +
									(order.shippingFee || 0) -
									(order.itemDiscount || 0) -
									(order.couponDiscount || 0)
								).toLocaleString()}
							₫
						</span>
					</div>
				</div>
			</div>

			{/* Cột phải */}
			<div className='w-full lg:w-1/3 flex flex-col gap-4'>
				{/* Trạng thái đơn hàng */}
				<div className='bg-white rounded-xl shadow-md p-4'>
					<div className='mb-2'>
						<CustomInput
							type='select'
							label='Trạng thái đơn hàng'
							id='status'
							options={ORDER_STATUS_OPTIONS}
							name='status'
							value={order.status}
							onChange={handleChangeStatus}
						/>
					</div>
				</div>
				{/* Thông tin khách hàng */}
				<div className='bg-white rounded-xl shadow-md p-4'>
					<div className='font-semibold mb-2 flex items-center gap-2'>
						<span role='img' aria-label='customer'>
							👤
						</span>{' '}
						Thông tin khách hàng
					</div>
					<div className='flex items-center gap-2'>
						<span className='font-semibold'>
							{order.buyerInfo.fullName}
						</span>
						|
						<span className='font-semibold'>
							{order.buyerInfo.phoneNumber}
						</span>
					</div>
					<div className='text-xs text-gray-500'>
						{order.buyerInfo.email}
					</div>
				</div>
				{/* Địa chỉ giao hàng */}
				<div className='bg-white rounded-xl shadow-md p-4'>
					<div className='font-semibold mb-2'>Địa chỉ giao hàng</div>
					<div>Họ tên: {order.shippingAddress?.fullName}</div>
					<div>
						Số điện thoại: {order.shippingAddress?.phoneNumber}
					</div>
					<div>
						{order.shippingAddress?.addressDetail},{' '}
						{order.shippingAddress?.wardName},{' '}
						{order.shippingAddress?.districtName},{' '}
						{order.shippingAddress?.provinceName}
					</div>
				</div>
				{/* Địa chỉ thanh toán */}
				{/* <div className='bg-white rounded-xl shadow-md p-4'>
					<div className='font-semibold mb-2'>Billing address</div>
					<div>Name: {order.shippingAddress?.fullName}</div>
					<div>Contact: {order.shippingAddress?.phoneNumber}</div>
					<div>
						{order.shippingAddress?.addressDetail},{' '}
						{order.shippingAddress?.wardName},{' '}
						{order.shippingAddress?.districtName},{' '}
						{order.shippingAddress?.provinceName}
					</div>
				</div> */}
			</div>
		</div>
	);
};

export default OrderDetail;
