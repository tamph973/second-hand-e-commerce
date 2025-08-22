/* eslint-disable react/prop-types */
import { formatPriceVND, getOrderStatusLabel } from '@/utils/helpers';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { MdStorefront } from 'react-icons/md';
import { FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import PaymentService from '@/services/payment.service';
import OrderService from '@/services/order.service';
import toast from 'react-hot-toast';
import momo from '@/assets/icons/momo.svg';
import vnpay from '@/assets/icons/vnpay.svg';
import { useModal } from '@/hooks/useModal';
import EditAddressModal from '@/components/address/EditAddressModal';
import OrderCancelModal from './OrderCancelModal';
import ReviewModal from '@/pages/productDetail/components/ReviewModal';
import { useAppMutation } from '@/hooks/useAppMutation';
import ReviewService from '@/services/review.service';
import { useQueryClient } from '@tanstack/react-query';

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
	PENDING: {
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

export default function OrderCard({ order, onDetail }) {
	const navigate = useNavigate();
	const [isProcessing, setIsProcessing] = useState(false);
	const [reviewProduct, setReviewProduct] = useState({});
	const { isOpen, open, close } = useModal();
	const {
		isOpen: isReviewOpen,
		open: openReview,
		close: closeReview,
	} = useModal();
	const queryClient = useQueryClient();
	const paymentConfig =
		paymentStatusConfig[order.paymentStatus] || paymentStatusConfig.PENDING;
	const PaymentIcon = paymentConfig.icon;

	// Kiểm tra xem đơn hàng có cần thanh toán không
	const needsPayment =
		order.paymentStatus === 'UNPAID' && order.status === 'PENDING';

	// Xử lý thanh toán cho đơn hàng
	const handlePayment = async (paymentMethod) => {
		if (!needsPayment) return;

		setIsProcessing(true);
		try {
			// Cập nhật phương thức thanh toán trước khi gọi paymentService
			await OrderService.updateOrder({
				orderId: order.orderId,
				paymentMethod,
			});

			if (paymentMethod === 'VNPAY') {
				const res = await PaymentService.vnpayPayment({
					paymentId: order.paymentId,
					totalAmount: order.subTotal + order.shippingFee,
				});
				window.location.href = res.data.paymentUrl;
			} else if (paymentMethod === 'MOMO') {
				const res = await PaymentService.momoPayment({
					paymentId: order.paymentId,
					totalAmount: order.subTotal + order.shippingFee,
				});
				window.location.href = res.data.paymentUrl;
			}
			// COD mặc định đã là phương thức khi tạo đơn hàng
		} catch (error) {
			toast.error(error.message || 'Có lỗi xảy ra khi thanh toán');
		} finally {
			setIsProcessing(false);
		}
	};

	const handleCancelOrder = async (reason) => {
		try {
			await OrderService.cancelOrder(order.orderId);
			toast.success('Đã hủy đơn hàng thành công!');
			window.location.reload();
		} catch (error) {
			toast.error(error.message || 'Hủy đơn hàng thất bại');
		}
	};

	const handleConfirmReceived = async () => {
		try {
			const res = await OrderService.confirmOrderReceived(order.orderId);
			if (res.status === 200) {
				toast.success('Xác nhận đã nhận hàng thành công!');
				window.location.reload();
			}
		} catch (error) {
			toast.error(error || 'Xác nhận đã nhận hàng thất bại');
		}
	};

	// Mua lại đơn hàng => Check out
	const handleBuyAgain = async (order) => {
		// Chuyển đổi dữ liệu order thành format phù hợp cho checkout
		const selectedItems = [
			{
				sellerId: order.sellerInfo.sellerId,
				address: order.shippingAddress.provinceName,
				fullName: order.sellerInfo.fullName,
				avatar: order.sellerInfo.avatar,
				products: order.items.map((item) => ({
					title: item.title,
					thumbnail: item.thumbnail,
					condition: item.condition,
					attributes: item.attributes,
					price: item.price,
					quantity: item.quantity,
					variantId: item.variantId || null,
					id: item.productId,
					stock: item.stock || 0,
					sold: item.sold || 0,
				})),
			},
		];

		navigate('/checkout', {
			state: {
				orderId: order.orderId,
				selectedItems: selectedItems,
				fromCart: false,
			},
		});
	};

	// Convert order items to product objects for review
	const convertOrderItemsToProducts = (items) => {
		return items.map((item) => ({
			_id: item.productId,
			title: item.title,
			thumbnail: {
				url: item.thumbnail,
			},
			// Add any other fields that ReviewModal might need
		}));
	};

	// Update handleReview to use the new format
	const handleReview = (order) => {
		const reviewProducts = convertOrderItemsToProducts(order.items);
		setReviewProduct(reviewProducts[0]);
		openReview();
	};

	const { mutateAsync: createReview, isPending } = useAppMutation({
		mutationFn: (data) => ReviewService.createReview(data),
		onSuccess: () => {
			toast.success('Đã đánh giá sản phẩm');
			closeReview();
			queryClient.invalidateQueries({ queryKey: ['reviews'] });
		},
		onError: (error) => {
			toast.error(error);
		},
	});

	return (
		<>
			<div className='bg-white rounded-xl shadow p-4 mb-4 border border-gray-100 hover:shadow-md transition'>
				{/* Header: Thông tin đơn hàng */}
				<div className='flex justify-between items-start mb-3 pb-3 border-b border-gray-200'>
					<div className='flex-1'>
						{/* Shop info */}
						<div className='flex items-center gap-2 mb-2'>
							<MdStorefront className='text-gray-500 text-lg' />
							<span className='font-medium text-gray-700'>
								{order.sellerInfo?.fullName || 'Người bán'}
							</span>
							<Link
								to={`/shop/${order.sellerInfo?.sellerId}`}
								className='text-primary font-medium text-sm rounded-md px-2 py-1 border border-primary'>
								Xem shop
							</Link>
						</div>
						{/* Order info */}
						<div className='text-xs text-gray-500'>
							Mã đơn:{' '}
							<span className='font-medium'>
								{order.orderCode}
							</span>
						</div>
						<div className='text-xs text-gray-500'>
							Ngày đặt:{' '}
							{new Date(order.createdAt).toLocaleString('vi-VN')}
						</div>
					</div>
					<div className='text-right'>
						{/* Order Status */}
						<div
							className={`font-bold text-lg ${
								statusColor[order.status] || 'text-gray-700'
							}`}>
							{getOrderStatusLabel(order.status) || order.status}
						</div>
						{/* Payment Status */}
						{order.status !== 'CANCELLED' && (
							<div
								className={`flex items-center justify-end gap-1 mt-1 px-2 py-1 rounded-full text-xs font-medium ${paymentConfig.bgColor} ${paymentConfig.borderColor} border`}>
								<PaymentIcon
									className={`w-3 h-3 ${paymentConfig.color}`}
								/>
								<span className={paymentConfig.color}>
									{paymentConfig.label}
								</span>
							</div>
						)}
						<div className='text-primary font-semibold text-base mt-1'>
							{formatPriceVND(order.subTotal)}
						</div>
					</div>
				</div>

				{/* Danh sách sản phẩm */}
				<div className='space-y-3'>
					{order.items.map((product, index) => (
						<div
							key={product.id || index}
							className='flex items-center gap-3 p-2 bg-gray-50 rounded-lg'>
							<div className='flex-shrink-0 w-16 h-16 bg-white rounded overflow-hidden flex items-center justify-center'>
								{product?.thumbnail ? (
									<img
										src={product.thumbnail}
										alt={product.title}
										className='object-cover w-full h-full'
									/>
								) : (
									<div className='text-gray-300 text-xs'>
										No image
									</div>
								)}
							</div>
							<div className='flex-1 min-w-0'>
								<Link
									to={`/products/${product?.slug}-${product?.productId}`}
									className='font-medium text-sm text-blue-900 line-clamp-2 w-1/2'>
									{product?.title || 'Sản phẩm'}
								</Link>
								<div className='text-xs text-gray-500 mt-1'>
									Số lượng: {product?.quantity} |{' '}
									{formatPriceVND(product?.price)}/sản phẩm
								</div>
							</div>
							<div className='text-right'>
								<div className='font-semibold text-sm text-gray-700'>
									{formatPriceVND(
										product?.price * product?.quantity,
									)}
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Footer: Tổng tiền và nút hành động */}
				<div className='flex justify-between items-center mt-4 pt-3 border-t border-gray-200'>
					<div className='text-sm text-gray-600'>
						Tổng cộng:{' '}
						<span className='font-semibold text-primary'>
							{order.items.length} sản phẩm
						</span>
					</div>
					<div className='flex flex-wrap gap-2 justify-end mt-2'>
						{/* Nút thanh toán (nếu cần) */}
						{needsPayment && (
							<div className='flex gap-2'>
								<button
									onClick={() => handlePayment('VNPAY')}
									disabled={isProcessing}
									className='flex items-center gap-2 px-3 py-2 rounded bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition disabled:opacity-50'>
									<img
										src={vnpay}
										alt='VNPay'
										className='w-4 h-4'
									/>
									VNPay
								</button>
								<button
									onClick={() => handlePayment('MOMO')}
									disabled={isProcessing}
									className='flex items-center gap-2 px-3 py-2 rounded bg-pink-600 text-white font-medium text-sm hover:bg-pink-700 transition disabled:opacity-50'>
									<img
										src={momo}
										alt='MoMo'
										className='w-4 h-4'
									/>
									MoMo
								</button>
							</div>
						)}

						{/* Nút thay đổi thông tin (nếu PENDING) */}
						{/* {order.status === 'PENDING' && (
							<button
								onClick={open}
								className='px-3 py-2 rounded bg-orange-600 text-white font-medium text-sm hover:bg-orange-700 transition'>
								Thay đổi thông tin
							</button>
						)} */}

						{/* Nút hủy đơn (nếu PENDING) */}
						{order.status === 'PENDING' && (
							<button
								onClick={open}
								className='px-3 py-2 rounded border border-red-300 text-red-600 font-medium text-sm bg-white hover:bg-red-50 transition'>
								Hủy đơn hàng
							</button>
						)}
						{order.status === 'DELIVERED' && (
							<button
								onClick={handleConfirmReceived}
								className='px-3 py-2 rounded border border-green-300 text-green-600 font-medium text-sm bg-white hover:bg-green-50 transition'>
								Xác nhận đã nhận hàng
							</button>
						)}
						{/* Nút đánh giá */}
						{order.status === 'COMPLETED' && (
							<button
								onClick={() => handleReview(order)}
								className='px-4 py-2.5 rounded-lg border border-orange-300 text-orange-600 font-medium text-sm bg-white hover:bg-orange-50 hover:border-orange-400 transition-all duration-200 shadow-sm hover:shadow-md'>
								<svg
									className='w-4 h-4 inline mr-2'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
									/>
								</svg>
								Đánh giá
							</button>
						)}
						{/* Nút mua lại */}
						{(order.status === 'COMPLETED' ||
							order.status === 'CANCELLED') && (
							<button
								onClick={() => handleBuyAgain(order)}
								className='px-4 py-2.5 rounded-lg border border-green-300 text-green-600 font-medium text-sm bg-white hover:bg-green-50 hover:border-green-400 transition-all duration-200 shadow-sm hover:shadow-md'>
								<svg
									className='w-4 h-4 inline mr-2'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01'
									/>
								</svg>
								Mua lại
							</button>
						)}
						{/* Nút xem chi tiết (luôn hiển thị) */}
						<button
							className='px-4 py-2 rounded border border-blue-200 text-blue-600 font-medium text-sm bg-white hover:bg-blue-50 transition'
							onClick={() => onDetail?.(order)}>
							Xem chi tiết
						</button>
					</div>
				</div>
				<OrderCancelModal
					isOpen={isOpen}
					onClose={close}
					onConfirm={handleCancelOrder}
				/>
				{/* Review Modal */}
				<ReviewModal
					isOpen={isReviewOpen}
					onClose={closeReview}
					product={reviewProduct}
					onSubmit={createReview}
					loading={isPending}
				/>
				{/* <EditAddressModal
					isOpen={isOpen}
					onClose={close}
					address={order.shippingAddress}
					onSuccess={handleSuccess}
				/> */}
			</div>
		</>
	);
}
