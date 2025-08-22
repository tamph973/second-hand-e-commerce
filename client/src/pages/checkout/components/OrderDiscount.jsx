/* eslint-disable react/prop-types */
import React, { useState, useMemo, useEffect } from 'react';
import { FaChevronRight, FaTimes, FaTag } from 'react-icons/fa';
import disountIcon from '@/assets/icons/icon-discount.png';
import { useModal } from '@/hooks/useModal';
import DiscountCard from './DiscountCard';
import { formatPriceVND } from '@/utils/helpers';
import toast from 'react-hot-toast';
import DiscountService from '@/services/discount.service';

// Utility function to transform API data to voucher format
const transformDiscountToVoucher = (discount, subtotal = 0) => {
	const startDate = new Date(discount.startDate);
	const endDate = new Date(discount.endDate);
	const now = new Date();

	// Calculate remaining days
	const remainingDays = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

	// Create description based on discount type
	let description = '';
	if (discount.discountType === 'PERCENT') {
		description = `Giảm ${discount.amount}% (tối đa ${formatPriceVND(
			discount.maximumDiscount,
		)}) cho đơn hàng từ ${formatPriceVND(discount.minimumPurchase)}`;
	} else if (discount.discountType === 'FIXED') {
		description = `Giảm ${formatPriceVND(
			discount.amount,
		)} cho đơn hàng từ ${formatPriceVND(discount.minimumPurchase)}`;
	} else if (discount.couponType === 'DISCOUNT_ON_SHIPPING') {
		description = `Giảm phí vận chuyển ${formatPriceVND(
			discount.amount,
		)} cho đơn hàng từ ${formatPriceVND(discount.minimumPurchase)}`;
	}

	// Kiểm tra xem voucher có áp dụng được không
	const isApplicable = subtotal >= discount.minimumPurchase;

	return {
		id: discount._id,
		title: discount.title,
		description,
		discount: discount.amount,
		discountType: discount.discountType,
		maximumDiscount: discount.maximumDiscount,
		minOrderValue: discount.minimumPurchase,
		validity: `Áp dụng trong ${remainingDays} ngày từ khi lấy mã`,
		quantity: discount.limitUsage,
		isReceived: false,
		code: discount.code,
		startDate: discount.startDate,
		endDate: discount.endDate,
		status: discount.status,
		isApplicable,
		couponType: discount.couponType,
	};
};

// Sample data - will be replaced with API data later
const sampleShippingVouchers = [
	{
		id: 1,
		title: 'Voucher vận chuyển',
		description:
			'Giảm 30000₫ phí vận chuyển đối với các đơn hàng trị giá 1₫ trở lên',
		discount: 30000,
		minOrderValue: 1,
		validity: 'Áp dụng trong 1 ngày từ khi lấy mã',
		quantity: 2,
		isReceived: false,
		isApplicable: true,
		couponType: 'DISCOUNT_ON_SHIPPING',
	},
	{
		id: 2,
		title: 'Voucher vận chuyển',
		description:
			'Giảm 40000₫ phí vận chuyển đối với các đơn hàng trị giá 45000₫',
		discount: 40000,
		minOrderValue: 45000,
		validity: 'Áp dụng trong 1 ngày từ khi lấy mã',
		quantity: 1,
		isReceived: false,
		isApplicable: true,
		couponType: 'DISCOUNT_ON_SHIPPING',
	},
];

const OrderDiscount = ({ discounts, setDiscount, subtotal = 0 }) => {
	const { isOpen, open, close } = useModal();
	const [promoCode, setPromoCode] = useState('');
	const [selectedVouchers, setSelectedVouchers] = useState([]);
	const [useNoDiscount, setUseNoDiscount] = useState(false);
	const [promoCodeDiscount, setPromoCodeDiscount] = useState(0);
	const [promoCodeData, setPromoCodeData] = useState(null);

	// Transform API data to vouchers
	const transformedVouchers = useMemo(() => {
		if (!discounts || discounts.length === 0) {
			return {
				shipping: [],
				order: [],
			};
		}

		const shippingVouchers = [];
		const orderVouchers = [];

		discounts.forEach((discount) => {
			const voucher = transformDiscountToVoucher(discount, subtotal);
			if (voucher.status === 'ACTIVE') {
				if (discount.couponType === 'DISCOUNT_ON_SHIPPING') {
					shippingVouchers.push(voucher);
				} else {
					orderVouchers.push(voucher);
				}
			}
		});

		return {
			shipping: shippingVouchers.length > 0 ? shippingVouchers : [],
			order: orderVouchers.length > 0 ? orderVouchers : [],
		};
	}, [discounts, subtotal]);

	/*
	// Calculate total discount amount: 
	// 1. Từ phiếu giảm giá 
	// 2. Từ mã giảm giá
	*/
	const calculateTotalDiscount = useMemo(() => {
		let totalDiscount = 0;

		// Calculate discount from selected vouchers
		selectedVouchers.forEach((voucherId) => {
			const allVouchers = [
				...transformedVouchers.shipping,
				...transformedVouchers.order,
			];
			const voucher = allVouchers.find((v) => v.id === voucherId);
			if (voucher && voucher.isApplicable) {
				if (voucher.couponType === 'DISCOUNT_ON_SHIPPING') {
					// For shipping discounts, the amount is the discount
					totalDiscount += voucher.discount;
				} else {
					// For order discounts, calculate based on type
					if (voucher.discountType === 'PERCENT') {
						const discountAmount =
							(subtotal * voucher.discount) / 100;
						totalDiscount += Math.min(
							discountAmount,
							voucher.maximumDiscount || discountAmount,
						);
					} else {
						// For FIXED discounts, ensure we don't exceed maximum
						const maxDiscount =
							voucher.maximumDiscount || voucher.discount;
						totalDiscount += Math.min(
							voucher.discount,
							maxDiscount,
						);
					}
				}
			}
		});

		// Add promo code discount
		totalDiscount += promoCodeDiscount;

		// Ensure discount doesn't exceed subtotal
		return Math.min(totalDiscount, subtotal);
	}, [selectedVouchers, transformedVouchers, subtotal, promoCodeDiscount]);

	// Update parent component with discount amount
	useEffect(() => {
		console.log('Total discount calculated:', calculateTotalDiscount);
		setDiscount(calculateTotalDiscount);
	}, [calculateTotalDiscount, setDiscount]);

	const handleReceiveVoucher = (voucherId, type) => {
		setSelectedVouchers((prev) => {
			// Remove any existing voucher of the same type
			const filteredVouchers = prev.filter((id) => {
				const allVouchers = [
					...transformedVouchers.shipping,
					...transformedVouchers.order,
				];
				const voucher = allVouchers.find((v) => v.id === id);
				return voucher && getVoucherType(voucher) !== type;
			});

			// If this voucher is already selected, remove it
			if (prev.includes(voucherId)) {
				return filteredVouchers;
			}

			// Add the new voucher
			return [...filteredVouchers, voucherId];
		});
		setUseNoDiscount(false);
	};

	const getVoucherType = (voucher) => {
		return transformedVouchers.shipping.some((v) => v.id === voucher.id)
			? 'shipping'
			: 'order';
	};

	const handleApplyPromoCode = async () => {
		if (!promoCode.trim()) {
			toast.error('Vui lòng nhập mã khuyến mãi');
			return;
		}

		try {
			const response = await DiscountService.validateDiscountCode(
				promoCode.trim(),
				subtotal,
			);

			const { discountAmount } = response.data;
			setPromoCodeDiscount(discountAmount);
			setPromoCodeData(response.data.discount);
			toast.success('Áp dụng mã khuyến mãi thành công!');
		} catch (error) {
			console.error('Promo code validation error:', error);
			toast.error(error || 'Mã khuyến mãi không hợp lệ');
			setPromoCodeDiscount(0);
			setPromoCodeData(null);
		}
	};

	const handleConfirm = () => {
		close();
	};

	const handleClearPromoCode = () => {
		setPromoCode('');
		setPromoCodeDiscount(0);
		setPromoCodeData(null);
	};

	// Get selected voucher info for display
	const selectedVoucherInfo = useMemo(() => {
		if (selectedVouchers.length === 0 && promoCodeData === null) {
			return null;
		}

		const allVouchers = [
			...transformedVouchers.shipping,
			...transformedVouchers.order,
		];

		const selectedVoucher = allVouchers.find((v) =>
			selectedVouchers.includes(v.id),
		);

		return {
			voucher: selectedVoucher,
			promoCode: promoCodeData,
			totalDiscount: calculateTotalDiscount,
		};
	}, [
		selectedVouchers,
		transformedVouchers,
		promoCodeData,
		calculateTotalDiscount,
	]);

	return (
		<>
			<div className='bg-white rounded-2xl shadow-xl p-6 mb-6'>
				<h2 className='text-xl font-bold mb-6 text-gray-900'>
					Giảm giá
				</h2>

				{/* Discount Banner */}
				<div
					onClick={open}
					className='bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors'>
					{/* Left side - Icon and Text */}
					<div className='flex items-center gap-3'>
						{/* Red coupon icon with white checkmark */}
						<div className='relative'>
							<div className='w-12 h-10 bg-red-500 rounded-lg flex items-center justify-center'>
								<img
									src={disountIcon}
									alt='discount-icon'
									className='w-full h-10'
								/>
							</div>
							{/* White checkmark overlay */}
							<div className='absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center'>
								<div className='w-2 h-2 bg-green-500 rounded-full'></div>
							</div>
						</div>

						{/* Discount text */}
						<div>
							<p className='text-gray-900 font-medium'>
								Giảm giá từ 2ECOC
							</p>
							{selectedVoucherInfo ? (
								<p className='text-sm text-green-600 font-medium'>
									Đã giảm{' '}
									{formatPriceVND(
										selectedVoucherInfo.totalDiscount,
									)}
								</p>
							) : (
								<p className='text-sm text-gray-500'>
									Chọn mã giảm giá phù hợp
								</p>
							)}
						</div>
					</div>

					{/* Right side - Chevron */}
					<FaChevronRight className='text-gray-400 text-lg' />
				</div>

				{/* Selected discount info */}
				{selectedVoucherInfo && (
					<div className='mt-4 p-3 bg-green-50 border border-green-200 rounded-lg'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-green-800'>
									{selectedVoucherInfo.voucher?.title ||
										selectedVoucherInfo.promoCode?.title}
								</p>
								<p className='text-xs text-green-600'>
									Giảm{' '}
									{formatPriceVND(
										selectedVoucherInfo.totalDiscount,
									)}
								</p>
							</div>
							<button
								onClick={() => {
									setSelectedVouchers([]);
									setPromoCodeDiscount(0);
									setPromoCodeData(null);
									setUseNoDiscount(true);
								}}
								className='text-red-500 hover:text-red-700 text-sm font-medium'>
								Xóa
							</button>
						</div>
					</div>
				)}

				{/* Additional discount options can be added here */}
				<div className='mt-4 space-y-2'>
					<div className='text-sm text-gray-600'>
						• Mã giảm giá cho khách hàng mới
					</div>
					<div className='text-sm text-gray-600'>
						• Giảm giá theo danh mục sản phẩm
					</div>
					<div className='text-sm text-gray-600'>
						• Ưu đãi đặc biệt cho đơn hàng lớn
					</div>
				</div>
			</div>

			{/* Modal */}
			{isOpen && (
				<div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'>
					<div className='bg-white w-full max-w-md rounded-2xl max-h-[80vh] overflow-hidden flex flex-col'>
						{/* Sticky Header */}
						<div className='flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10'>
							<h2 className='text-lg font-bold text-gray-900'>
								Giảm giá từ 2ECOC
							</h2>
							<button
								onClick={close}
								className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
								<FaTimes className='text-gray-500' />
							</button>
						</div>

						{/* Scrollable Content */}
						<div className='flex-1 overflow-y-auto p-4 space-y-4'>
							{/* Info Banner */}
							<div
								className='rounded-xl p-4 flex items-center gap-3 border border-blue-100'
								style={{
									background:
										'linear-gradient(to right, #eff6ff, #faf5ff)',
								}}>
								<div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center'>
									<FaTag className='text-white text-sm' />
								</div>
								<p className='text-sm text-gray-700 font-medium'>
									Chúng tôi đã áp dụng giảm giá tốt nhất bạn
									có
								</p>
							</div>

							{/* Shipping Vouchers */}
							{transformedVouchers.shipping.length > 0 && (
								<div>
									<h3 className='text-md font-semibold text-gray-900 mb-3 flex items-center gap-2'>
										<span className='w-2 h-2 bg-blue-500 rounded-full'></span>
										Voucher vận chuyển
									</h3>
									<div className='space-y-3'>
										{transformedVouchers.shipping.map(
											(voucher) => (
												<DiscountCard
													key={voucher.id}
													voucher={voucher}
													onReceive={(id) =>
														handleReceiveVoucher(
															id,
															'shipping',
														)
													}
													type='shipping'
													isSelected={selectedVouchers.includes(
														voucher.id,
													)}
												/>
											),
										)}
									</div>
								</div>
							)}

							{/* Order Vouchers */}
							{transformedVouchers.order.length > 0 && (
								<div>
									<h3 className='text-md font-semibold text-gray-900 mb-3 flex items-center gap-2'>
										<span className='w-2 h-2 bg-green-500 rounded-full'></span>
										Giảm giá đơn hàng
									</h3>
									<div className='space-y-3'>
										{transformedVouchers.order.map(
											(voucher) => (
												<DiscountCard
													key={voucher.id}
													voucher={voucher}
													onReceive={(id) =>
														handleReceiveVoucher(
															id,
															'order',
														)
													}
													type='order'
													isSelected={selectedVouchers.includes(
														voucher.id,
													)}
												/>
											),
										)}
									</div>
								</div>
							)}

							{/* No Discount Option */}
							<div className='flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors'>
								<span className='text-gray-900 font-medium'>
									Không dùng phiếu giảm giá
								</span>
								<button
									onClick={() => {
										setUseNoDiscount(!useNoDiscount);
										setSelectedVouchers([]);
										setPromoCodeDiscount(0);
										setPromoCodeData(null);
									}}
									className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
										useNoDiscount
											? 'bg-red-500 border-red-500'
											: 'border-gray-300 hover:border-red-400'
									}`}>
									{useNoDiscount && (
										<div className='w-2 h-2 bg-white rounded-full'></div>
									)}
								</button>
							</div>

							{/* Promotional Code */}
							<div className='bg-gray-50 rounded-xl p-4'>
								<h3 className='text-md font-semibold text-gray-900 mb-3 flex items-center gap-2'>
									<span className='w-2 h-2 bg-orange-500 rounded-full'></span>
									Thêm mã khuyến mãi
								</h3>
								<div className='flex gap-2'>
									<input
										type='text'
										value={promoCode}
										onChange={(e) =>
											setPromoCode(e.target.value)
										}
										placeholder='Nhập mã'
										className='flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200'
									/>
									<button
										onClick={handleApplyPromoCode}
										className='px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-sm'>
										Áp dụng
									</button>
								</div>
								{promoCodeData && (
									<div className='mt-3 p-3 bg-green-50 border border-green-200 rounded-lg'>
										<div className='flex items-center justify-between'>
											<div>
												<p className='text-sm font-medium text-green-800'>
													{promoCodeData.title}
												</p>
												<p className='text-xs text-green-600'>
													Giảm{' '}
													{formatPriceVND(
														promoCodeDiscount,
													)}
												</p>
											</div>
											<button
												onClick={handleClearPromoCode}
												className='text-red-500 hover:text-red-700 text-sm font-medium'>
												Xóa
											</button>
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Sticky Footer */}
						<div className='p-4 border-t border-gray-200 bg-white sticky bottom-0'>
							<button
								onClick={handleConfirm}
								className='w-full text-white py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl'
								style={{
									background:
										'linear-gradient(to right, #ef4444, #dc2626)',
								}}
								onMouseEnter={(e) => {
									e.target.style.background =
										'linear-gradient(to right, #dc2626, #b91c1c)';
								}}
								onMouseLeave={(e) => {
									e.target.style.background =
										'linear-gradient(to right, #ef4444, #dc2626)';
								}}>
								Xác nhận
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default OrderDiscount;
