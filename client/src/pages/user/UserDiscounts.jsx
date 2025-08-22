import React from 'react';
import { FaGift, FaClock, FaCheckCircle, FaCopy } from 'react-icons/fa';
import { formatPriceVND } from '@/utils/helpers';
import useAppQuery from '@/hooks/useAppQuery';
import DiscountService from '@/services/discount.service';
import { toast } from 'react-toastify';

const UserDiscounts = () => {
	const { data: discounts, isLoading } = useAppQuery(
		['user-discounts'],
		() => DiscountService.getDiscountsForUser(),
		{
			select: (res) => res.data,
			refetchOnWindowFocus: false,
			staleTime: 1000 * 60 * 5,
			gcTime: 1000 * 60 * 5,
		},
	);

	const getTypeBadge = (type) => {
		const typeConfig = {
			PERCENT: {
				text: 'Phần trăm',
				className: 'bg-blue-100 text-blue-800',
			},
			FIXED: {
				text: 'Cố định',
				className: 'bg-purple-100 text-purple-800',
			},
		};
		const config = typeConfig[type] || typeConfig.PERCENT;
		return (
			<span
				className={`px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>
				{config.text}
			</span>
		);
	};

	const getCouponTypeBadge = (type) => {
		const typeConfig = {
			DISCOUNT_ON_PURCHASE: {
				text: 'Giảm giá đơn hàng',
				className: 'bg-green-100 text-green-800',
			},
			DISCOUNT_ON_SHIPPING: {
				text: 'Giảm phí ship',
				className: 'bg-orange-100 text-orange-800',
			},
		};
		const config = typeConfig[type] || typeConfig.DISCOUNT_ON_PURCHASE;
		return (
			<span
				className={`px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>
				{config.text}
			</span>
		);
	};

	const copyDiscountCode = (code) => {
		navigator.clipboard.writeText(code);
		toast.success('Đã sao chép mã giảm giá!');
	};

	if (isLoading) {
		return (
			<div className='flex justify-center items-center py-12'>
				<div className='flex flex-col items-center space-y-4'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
					<p className='text-gray-600'>Đang tải mã giảm giá...</p>
				</div>
			</div>
		);
	}

	if (!discounts || discounts.length === 0) {
		return (
			<div className='text-center py-12'>
				<div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
					<FaGift className='h-10 w-10 text-gray-400' />
				</div>
				<h3 className='text-lg font-semibold text-gray-900 mb-2'>
					Không có mã giảm giá
				</h3>
				<p className='text-gray-500 max-w-md mx-auto'>
					Hiện tại không có mã giảm giá nào dành cho bạn. Hãy theo dõi
					để nhận những ưu đãi mới nhất!
				</p>
			</div>
		);
	}

	return (
		<div className='space-y-6 bg-white rounded-2xl shadow-lg p-8'>
			<div className='flex items-center justify-between'>
				<div>
					<h2 className='text-3xl font-bold text-lime-600 mb-2'>
						Mã giảm giá của bạn
					</h2>
					<p className='text-gray-600 mt-1'>
						Chọn mã giảm giá phù hợp để tiết kiệm chi phí
					</p>
				</div>
				<div className='text-sm text-gray-500'>
					{discounts.length} mã giảm giá
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{discounts.map((discount) => (
					<div
						key={discount._id}
						className='bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300 group'>
						{/* Header with icon and code */}
						<div className='flex items-start justify-between mb-4'>
							<div className='flex items-center space-x-3'>
								<div>
									<div className='flex items-center space-x-2'>
										<div className='flex items-center space-x-2'>
											<h3 className='text-lg font-bold text-gray-900'>
												{discount.code}
											</h3>
											<button
												onClick={() =>
													copyDiscountCode(
														discount.code,
													)
												}
												className='text-gray-400 hover:text-blue-600 transition-colors'>
												<FaCopy className='w-4 h-4' />
											</button>
											{getCouponTypeBadge(
												discount.couponType,
											)}
										</div>
									</div>
									<p className='text-sm text-gray-600 mt-1 line-clamp-2 h-10'>
										{discount.title}
									</p>
								</div>
							</div>
						</div>

						{/* Discount details */}
						<div className='space-y-3 mb-6'>
							{/* Discount amount */}
							<div className='flex items-center justify-between'>
								<span className='text-sm font-medium text-gray-700'>
									Giảm giá:
								</span>
								<div className='flex items-center space-x-2'>
									{getTypeBadge(discount.discountType)}
									<span className='font-bold text-lg text-gray-900'>
										{discount.discountType === 'PERCENT'
											? `${discount.amount}%`
											: formatPriceVND(discount.amount)}
									</span>
								</div>
							</div>

							{/* Minimum purchase */}
							{discount.minimumPurchase && (
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium text-gray-700'>
										Đơn hàng tối thiểu:
									</span>
									<span className='font-medium text-gray-900'>
										{formatPriceVND(
											discount.minimumPurchase,
										)}
									</span>
								</div>
							)}

							{/* Usage limit */}
							<div className='flex items-center justify-between'>
								<span className='text-sm font-medium text-gray-700'>
									Giới hạn sử dụng:
								</span>
								<span className='font-medium text-gray-900'>
									{discount.limitUsage} lần
								</span>
							</div>

							{/* Expiration date */}
							<div className='flex items-center space-x-2 text-sm text-gray-500 pt-2 border-t border-gray-100'>
								<FaClock className='w-4 h-4' />
								<span>
									Hết hạn:{' '}
									{new Date(
										discount.endDate,
									).toLocaleDateString('vi-VN')}
								</span>
							</div>
						</div>

						{/* Action button */}
						<button
							className='w-full  hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg'
							style={{
								background:
									'linear-gradient(to right, #007bff, #00bfff)',
							}}>
							Sử dụng ngay
						</button>
					</div>
				))}
			</div>

			{/* Additional info */}
			<div className='bg-blue-50 rounded-lg p-4 mt-8'>
				<div className='flex items-start space-x-3'>
					<FaCheckCircle className='w-5 h-5 text-blue-600 mt-0.5' />
					<div>
						<h4 className='font-semibold text-blue-900 mb-1'>
							Lưu ý khi sử dụng mã giảm giá
						</h4>
						<ul className='text-sm text-blue-800 space-y-1'>
							<li>
								• Mã giảm giá chỉ có thể sử dụng số lần cho phép
							</li>
							<li>
								• Không thể kết hợp với các chương trình khuyến
								mãi khác
							</li>
							<li>
								• Áp dụng cho đơn hàng có giá trị tối thiểu theo
								quy định
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserDiscounts;
