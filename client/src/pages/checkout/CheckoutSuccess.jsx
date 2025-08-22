import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
	FaCheckCircle,
	FaShoppingBag,
	FaHome,
	FaArrowRight,
	FaMapMarkerAlt,
	FaBox,
	FaTruck,
	FaClock,
} from 'react-icons/fa';
import { formatPriceVND, getUrlSearchParam } from '@/utils/helpers';
import useAppQuery from '@/hooks/useAppQuery';
import OrderService from '@/services/order.service';

const getPaymentStatusDisplay = (order) => {
	let methodLabel = '';
	if (order?.paymentMethod === 'COD')
		methodLabel = 'Thanh toán khi nhận hàng';
	if (order?.paymentMethod === 'VNPAY') methodLabel = 'Thanh toán với VNPay';
	if (order?.paymentMethod === 'MOMO') methodLabel = 'Thanh toán với MoMo';
	return methodLabel;
};
const CheckoutSuccess = () => {
	const location = useLocation();
	const orderId = getUrlSearchParam('orderId');
	

	const { data: order, isLoading } = useAppQuery(
		['orderDetail', orderId],
		() => OrderService.getOrderDetail(orderId),
		{
			select: (res) => res.data,
		},
	);

	const orderData = location.state?.orderData || {
		orderId: 'FINO2025080300004',
		totalAmount: 500000,
		paymentMethod: 'Thanh toán khi nhận hàng',
		shippingAddress: {
			name: 'LAN',
			phone: '0918458752',
			address: '55/5 Hoàng Hữu Nam, 12, 3, Hồ Chí Minh',
		},
		items: [
			{
				id: 1,
				title: 'Áo MUSCLE CAR TEE',
				thumbnail: 'https://via.placeholder.com/60x60',
				price: 280000,
				quantity: 1,
			},
			{
				id: 2,
				title: 'Áo Thun Nam in Sundaze Rush',
				thumbnail: 'https://via.placeholder.com/60x60',
				price: 120000,
				quantity: 1,
			},
			{
				id: 3,
				title: 'Quần Âu Nam Ống Rộng Lụa Cotton',
				thumbnail: 'https://via.placeholder.com/60x60',
				price: 220000,
				quantity: 1,
			},
		],
	};

	const nextSteps = [
		{
			step: 1,
			title: 'Chờ xác nhận',
			description:
				'Chúng tôi sẽ liên hệ xác nhận đơn hàng trong vòng 24h',
			icon: FaClock,
		},
		{
			step: 2,
			title: 'Chuẩn bị hàng',
			description: 'Đơn hàng sẽ được đóng gói và chuẩn bị giao',
			icon: FaBox,
		},
		{
			step: 3,
			title: 'Giao hàng',
			description: 'Sản phẩm sẽ được giao đến địa chỉ bạn đã cung cấp',
			icon: FaTruck,
		},
	];

	const containerVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				staggerChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<div className='min-h-screen bg-gray-50 py-8'>
			<div className='max-w-5xl mx-auto px-4 text-textPrimary'>
				<motion.div
					variants={containerVariants}
					initial='hidden'
					animate='visible'
					className='space-y-8'>
					{/* Header */}
					<motion.div variants={itemVariants} className='text-center'>
						<div className='flex flex-col items-center justify-center gap-3 mb-4'>
							<div className='flex items-center gap-3'>
								<FaShoppingBag className='text-4xl text-blue-600' />
								<h1 className='text-4xl font-bold text-gray-900'>
									Đặt hàng thành công
								</h1>
							</div>
							<p className='text-gray-600'>
								Cảm ơn bạn đã tin tưởng và mua hàng tại 2ECoC
							</p>
						</div>
					</motion.div>

					{/* SECTION 1: Success Notification */}
					<motion.div
						variants={itemVariants}
						className='bg-white rounded-2xl shadow-lg p-8 text-center relative overflow-hidden'>
						{/* Background decoration */}
						<div
							className='absolute top-0 left-0 w-full h-1'
							style={{
								background:
									'linear-gradient(to right, #4ade80, #3b82f6)',
							}}></div>

						{/* Success icon with animation */}
						<motion.div
							className='flex items-center justify-center mb-6'
							initial={{ scale: 0, rotate: -180 }}
							animate={{ scale: 1, rotate: 0 }}
							transition={{
								duration: 0.6,
								type: 'spring',
								stiffness: 200,
							}}>
							<div className='w-20 h-20 rounded-full flex items-center justify-center shadow-lg bg-[#22C55E]'>
								<FaCheckCircle className='text-4xl text-white' />
							</div>
						</motion.div>

						{/* Title with subtle animation */}
						<motion.h2
							className='text-3xl font-bold text-gray-900 mb-4'
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3, duration: 0.5 }}>
							Đặt hàng thành công!
						</motion.h2>

						{/* Order info with fade in */}
						<motion.p
							className='text-gray-600 mb-6 text-lg'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5, duration: 0.5 }}>
							Đơn hàng{' '}
							<span className='font-mono font-semibold text-blue-600'>
								#{order?.orderId}
							</span>{' '}
							đã được tạo thành công
						</motion.p>

						{/* Order summary with slide up animation */}
						<motion.div
							className='rounded-xl p-6 inline-block border border-gray-100 shadow-sm'
							style={{
								background:
									'linear-gradient(to right, #f9fafb, #eff6ff)',
							}}
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.7, duration: 0.5 }}>
							<div className='flex items-center justify-center gap-2 mb-2'>
								<div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
								<p className='text-gray-700 font-medium'>
									Tổng tiền:{' '}
									<span className='font-bold text-2xl text-green-600'>
										{formatPriceVND(order?.totalAmount)}
									</span>
								</p>
							</div>
							<p className='text-gray-600 text-sm'>
								Phương thức:{' '}
								<span className='font-medium text-gray-700'>
									{getPaymentStatusDisplay(order)}
								</span>
							</p>
						</motion.div>
					</motion.div>

					{/* SECTION 2: Order Details */}
					<motion.div
						variants={itemVariants}
						className='bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden'>
						{/* Background decoration */}
						<div
							className='absolute top-0 left-0 w-full h-1'
							style={{
								background:
									'linear-gradient(to right, #60a5fa, #a855f7)',
							}}></div>

						{/* Header with icon */}
						<div className='flex items-center gap-3 mb-6'>
							<div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
								<FaShoppingBag className='text-xl text-blue-600' />
							</div>
							<h3 className='text-xl font-bold text-gray-900'>
								Chi tiết đơn hàng
							</h3>
						</div>

						{/* Order breakdown */}
						<div className='space-y-4'>
							{/* Subtotal */}
							<div className='flex justify-between items-center py-3 border-b border-gray-100'>
								<span className='text-gray-600 flex items-center gap-2'>
									<div className='w-2 h-2 bg-gray-400 rounded-full'></div>
									Tạm tính:
								</span>
								<span className='font-medium text-gray-900'>
									{formatPriceVND(order?.subTotal)}
								</span>
							</div>

							{/* Shipping fee */}
							<div className='flex justify-between items-center py-3 border-b border-gray-100'>
								<span className='text-gray-600 flex items-center gap-2'>
									<div className='w-2 h-2 bg-blue-400 rounded-full'></div>
									Phí vận chuyển:
								</span>
								<span className='font-medium text-gray-900'>
									{formatPriceVND(order?.shippingFee)}
								</span>
							</div>

							{/* Discount - NEW */}
							<div className='flex justify-between items-center py-3 border-b border-gray-100'>
								<span className='text-green-600 flex items-center gap-2'>
									<div className='w-2 h-2 bg-green-500 rounded-full'></div>
									Giảm giá:
								</span>
								<span className='font-medium text-green-600'>
									- {formatPriceVND(order?.discount)}
								</span>
							</div>

							{/* Total */}
							<div
								className='flex justify-between items-center py-4 rounded-lg px-4'
								style={{
									background:
										'linear-gradient(to right, #f9fafb, #eff6ff)',
								}}>
								<span className='text-lg font-bold text-gray-900 flex items-center gap-2'>
									<div className='w-3 h-3 bg-blue-600 rounded-full'></div>
									Tổng cộng:
								</span>
								<span className='text-xl font-bold text-blue-600'>
									{formatPriceVND(order?.totalAmount)}
								</span>
							</div>

							{/* Savings indicator */}
							<div className='mt-4 p-3 bg-green-50 rounded-lg border border-green-200'>
								<div className='flex items-center justify-center gap-2 text-green-700'>
									<div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
									<span className='text-sm font-medium'>
										Bạn đã tiết kiệm được{' '}
										{formatPriceVND(order?.discount)} với mã
										giảm giá!
									</span>
								</div>
							</div>
						</div>
					</motion.div>

					{/* SECTION 3: Address and Products */}
					<motion.div
						variants={itemVariants}
						className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
						{/* Left: Address Information */}
						<div className='lg:col-span-1 bg-white rounded-2xl shadow-lg p-6'>
							<div className='flex items-center gap-3 mb-4'>
								<FaMapMarkerAlt className='text-2xl text-blue-600' />
								<h3 className='text-xl font-bold text-gray-900'>
									Địa chỉ giao hàng
								</h3>
							</div>
							{order?.shippingAddress && (
								<div className='space-y-3'>
									<div className='flex items-center gap-2'>
										<span className='font-medium text-gray-900'>
											{order.shippingAddress.fullName} -{' '}
											{order.shippingAddress.phoneNumber}
										</span>
									</div>
									<div className='text-gray-600'>
										{order.shippingAddress.addressDetail} -{' '}
										{order.shippingAddress.wardName} -{' '}
										{order.shippingAddress.districtName} -{' '}
										{order.shippingAddress.provinceName}
									</div>
								</div>
							)}
						</div>

						{/* Right: Product Information */}
						<div className='lg:col-span-2 bg-white rounded-2xl shadow-lg p-6'>
							<div className='flex items-center gap-3 mb-4'>
								<FaBox className='text-2xl text-blue-600' />
								<h3 className='text-xl font-bold text-gray-900'>
									Sản phẩm đã đặt
								</h3>
							</div>
							<div className='space-y-4'>
								{order?.items.map((item, index) => (
									<div
										key={item.id}
										className='flex items-center gap-4 p-3 bg-gray-50 rounded-lg'>
										<img
											src={item.thumbnail}
											alt={item.title}
											className='w-12 h-12 object-cover rounded-lg'
										/>
										<div className='flex-1 min-w-0'>
											<h4 className='font-medium text-gray-900 truncate'>
												{item.title}
											</h4>
											<p className='text-sm text-gray-500'>
												Số lượng: {item.quantity} | Đơn
												giá:{' '}
												{formatPriceVND(item.price)}
											</p>
										</div>
										<div className='text-right'>
											<span className='font-bold text-blue-600'>
												{formatPriceVND(
													item.price * item.quantity,
												)}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					</motion.div>

					{/* SECTION 4: Next Steps */}
					<motion.div
						variants={itemVariants}
						className='bg-white rounded-2xl shadow-lg p-8'>
						<h3 className='text-xl font-bold text-gray-900 mb-6 text-center'>
							Bước tiếp theo
						</h3>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
							{nextSteps.map((step, index) => (
								<motion.div
									key={step.step}
									variants={itemVariants}
									className='text-center group'
									whileHover={{ scale: 1.02 }}
									transition={{ duration: 0.2 }}>
									<div className='relative'>
										<div className='w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-700 transition-colors'>
											<step.icon className='text-white text-xl' />
										</div>
										{index < nextSteps.length - 1 && (
											<div className='hidden md:block absolute top-6 left-full w-full h-0.5 bg-gray-200 -ml-2'>
												<div className='w-0 h-full bg-blue-600 transition-all duration-500 group-hover:w-full'></div>
											</div>
										)}
									</div>
									<h4 className='font-bold text-gray-900 mb-2'>
										{step.title}
									</h4>
									<p className='text-sm text-gray-600 leading-relaxed'>
										{step.description}
									</p>
								</motion.div>
							))}
						</div>
					</motion.div>

					{/* Footer: Action Buttons */}
					<motion.div
						variants={itemVariants}
						className='flex flex-col sm:flex-row gap-4 justify-center'>
						<Link
							to='/user/purchases'
							className='flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg transform hover:scale-105'>
							<FaShoppingBag className='text-lg' />
							Xem đơn hàng
						</Link>
						<Link
							to='/products'
							className='flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-md hover:shadow-lg transform hover:scale-105'>
							<FaArrowRight className='text-lg' />
							Tiếp tục mua sắm
						</Link>
						<Link
							to='/'
							className='flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-md hover:shadow-lg transform hover:scale-105'>
							<FaHome className='text-lg' />
							Về trang chủ
						</Link>
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
};

export default CheckoutSuccess;
