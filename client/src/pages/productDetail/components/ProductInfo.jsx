/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import {
	FaStar,
	FaMapMarkerAlt,
	FaClock,
	FaTruck,
	FaShieldAlt,
	FaHeart,
	FaShare,
	FaFlag,
	FaCheck,
	FaGift,
	FaBox,
	FaRegHeart,
} from 'react-icons/fa';
import { formatPriceVND } from '@/utils/helpers';
import {
	COLOR_OPTIONS,
	CONDITION_OPTIONS,
	WARRANTY_OPTIONS,
	ORIGIN_OPTIONS,
	WASHING_MACHINE_CAPACITY_OPTIONS,
	WASHING_MACHINE_DOOR_OPTIONS,
} from '@/constants/productOptions';
import { formatTimeSince } from '@/utils/helpers';
import { useAppMutation } from '@/hooks/useAppMutation';
import WishlistService from '@/services/wishlist.service';
import { useQueryClient } from '@tanstack/react-query';
import useAppQuery from '@/hooks/useAppQuery';
import ReactStars from 'react-stars';
import ProductVariant from './ProductVariant';
import { Link } from 'react-router-dom';

// Hàm lấy label từ value cho từng trường động
function getLabelByValue(fieldName, value) {
	const optionsMap = {
		color: COLOR_OPTIONS,
		warranty: WARRANTY_OPTIONS,
		origin: ORIGIN_OPTIONS,
		capacity: WASHING_MACHINE_CAPACITY_OPTIONS,
		door: WASHING_MACHINE_DOOR_OPTIONS,
	};
	const options = optionsMap[fieldName];
	if (options) {
		const found = options.find((opt) => opt.value === value);
		return found ? found.label : value;
	}
	return value;
}

const ProductInfo = ({
	product,
	variants,
	quantity,
	onQuantityChange,
	onOpenAddressModal,
	selectedAddress,
	addToCart,
	onVariantSelect,
}) => {
	const queryClient = useQueryClient();
	const [isInWishlist, setIsInWishlist] = useState(false);

	const conditionLabel =
		CONDITION_OPTIONS.find((opt) => opt.value === product?.condition)
			?.label || 'Tốt';

	const colorLabel = (value) => {
		const found = COLOR_OPTIONS.find((opt) => opt.value === value);
		return found ? found.label : value;
	};

	const renderStars = (rating) => {
		return Array.from({ length: 5 }, (_, i) => (
			<FaStar
				key={i}
				className={`w-4 h-4 ${
					i < Math.floor(rating)
						? 'text-yellow-400 fill-current'
						: 'text-gray-300'
				}`}
			/>
		));
	};

	// Kiểm tra trạng thái wishlist khi component mount
	const { data: wishlistStatus } = useAppQuery(
		['wishlist', product._id],
		() => WishlistService.checkWishlistStatus(product._id),
		{
			select: (res) => res.data,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			staleTime: 1000 * 60 * 5,
			cacheTime: 1000 * 60 * 5,
		},
	);

	useEffect(() => {
		if (wishlistStatus) {
			setIsInWishlist(wishlistStatus.isInWishlist);
		}
	}, [wishlistStatus]);

	const { mutateAsync: toggleWishlist } = useAppMutation({
		mutationFn: () => WishlistService.addToWishlist(product._id),
		onSuccess: (res) => {
			queryClient.invalidateQueries(['wishlist']);
			setIsInWishlist(res.data.isInWishlist);
		},
	});

	const time = formatTimeSince(product.createdAt);
	return (
		<div className='p-6'>
			{/* Product Title & Basic Info */}
			<div className='mb-2'>
				<h1 className='text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight'>
					{product.title}
				</h1>

				<div className='flex flex-col items-start gap-4 text-sm text-gray-600 mb-4'>
					<span className='flex items-center gap-1'>
						<FaMapMarkerAlt className='w-4 h-4 mt-1' />
						{product.address.detail || ''}
						{product.address.wardName &&
							`, ${product.address.wardName}`}
						{product.address.districtName &&
							`, ${product.address.districtName}`}
						{product.address.provinceName &&
							`, ${product.address.provinceName}`}
					</span>
					<span className='flex items-center gap-1'>
						<FaClock className='w-4 h-4' />
						Cập nhật {time}
					</span>
				</div>

				{/* Condition & Attributes Badges */}
				<div className='flex flex-wrap gap-2'>
					<span className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium'>
						{conditionLabel}
					</span>
					{Object.entries(product.attributes).map(([key, value]) => (
						<span
							key={key}
							className='bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium'>
							{getLabelByValue(key, value)}
						</span>
					))}
				</div>
			</div>
			{/* Star rating */}
			<div className='flex items-center gap-2'>
				<ReactStars
					count={5}
					value={product?.reviews?.averageRating}
					size={24}
					edit={false}
					color2='#ffd700'
					color1='#e5e7eb'
				/>
				<span className='text-sm text-gray-600'>
					({product?.reviews?.totalReviews || 0} đánh giá)
				</span>
			</div>
			{/* Price Section */}
			<div className='mb-2 py-2 bg-gray-50 rounded-xl'>
				<div className='flex items-baseline gap-3 mb-2'>
					<span className='text-3xl md:text-4xl font-bold text-orange-600'>
						{formatPriceVND(product.price)}
					</span>
					{product.originalPrice > product.price && (
						<span className='text-lg text-gray-500 line-through'>
							{formatPriceVND(product.originalPrice)}
						</span>
					)}
				</div>

				{/* Accessories & Gift Badges */}
				<div className='flex gap-2'>
					{product.includesAccessories && (
						<span className='flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-sm'>
							<FaBox className='w-3 h-3' />
							Kèm phụ kiện
						</span>
					)}
					{product.hasGift && (
						<span className='flex items-center gap-1 bg-pink-100 text-pink-800 px-2 py-1 rounded text-sm'>
							<FaGift className='w-3 h-3' />
							Có quà tặng
						</span>
					)}
				</div>
			</div>

			{/* Contact Buttons */}
			{/* <div className='flex gap-3'>
					<button
						onClick={() => setShowPhone(!showPhone)}
						className='flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors'>
						{showPhone ? '086268****' : 'Hiện số 086268****'}
					</button>
					<button className='flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors'>
						Hỏi mua
					</button>
				</div>
			</div> */}

			{/* Shipping Information */}
			<div className='mb-4 p-4 border border-gray-200 rounded-xl'>
				<div className='flex flex-col gap-2'>
					<div className='flex items-start gap-2'>
						<span className='font-medium text-gray-900 min-w-[100px] self-start'>
							Vận chuyển:
						</span>
						<span className='text-sm text-gray-700'>
							Từ {product.address.provinceName} tới{' '}
							{selectedAddress ? (
								<span
									onClick={onOpenAddressModal}
									className='font-bold text-blue-600 hover:underline cursor-pointer'>
									{selectedAddress?.wardName},{' '}
									{selectedAddress?.districtName},{' '}
									{selectedAddress?.provinceName}
								</span>
							) : (
								<span
									onClick={onOpenAddressModal}
									className='font-bold text-blue-600 hover:underline cursor-pointer'>
									Chọn địa chỉ vận chuyển
								</span>
							)}
						</span>
					</div>
					<span className='text-green-600 font-medium flex items-center gap-1 mt-1'>
						<FaTruck className='w-4 h-4' />
						Miễn phí vận chuyển
					</span>
				</div>
			</div>
			{/* Variants  */}
			{variants?.length > 0 && (
				<div className='mb-6'>
					<ProductVariant
						variants={variants}
						onVariantSelect={onVariantSelect}
					/>
				</div>
			)}
			{/* Quantity Selector */}
			<div className='mb-6'>
				<div className='flex items-center justify-between mb-2'>
					<span className='font-medium text-gray-900'>Số lượng:</span>
					<span className='text-sm text-gray-600'>
						{product.stock || 1} sản phẩm có sẵn
					</span>
				</div>
				<div className='flex items-center gap-3 text-textPrimary'>
					<button
						onClick={() =>
							onQuantityChange(Math.max(1, quantity - 1))
						}
						disabled={quantity <= 1}
						className='w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg'>
						-
					</button>
					<input
						type='number'
						value={quantity}
						onChange={(e) => {
							const value = parseInt(e.target.value) || 1;
							const clampedValue = Math.max(
								1,
								Math.min(value, product.stock || 1),
							);
							onQuantityChange(clampedValue);
						}}
						onBlur={(e) => {
							// Đảm bảo giá trị hợp lệ khi blur
							const value = parseInt(e.target.value) || 1;
							const clampedValue = Math.max(
								1,
								Math.min(value, product.stock || 1),
							);
							if (value !== clampedValue) {
								onQuantityChange(clampedValue);
							}
						}}
						min={1}
						max={product.stock || 1}
						className='w-12 h-10 text-center font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 pl-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
					/>
					<button
						onClick={() =>
							onQuantityChange(
								Math.min(quantity + 1, product.stock || 1),
							)
						}
						disabled={quantity >= (product.stock || 1)}
						className='w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg'>
						+
					</button>
				</div>
			</div>

			{/* Action Buttons */}
			<div className='space-y-3 mb-6'>
				<Link
					onClick={() => addToCart(product._id, quantity)}
					className='w-full inline-block text-center bg-red-600 hover:opacity-90 text-white py-3 px-6 rounded-xl font-bold text-lg transition-colors'>
					Mua ngay
				</Link>
				<button
					onClick={() => addToCart(product._id, quantity)}
					className='w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3 px-6 rounded-xl font-bold text-lg transition-colors'>
					Thêm vào giỏ hàng
				</button>
			</div>

			{/* Guarantees */}
			<div className='mb-6 space-y-3'>
				<div className='flex items-start gap-3 p-3 bg-green-50 rounded-lg'>
					<FaShieldAlt className='w-5 h-5 text-green-600 mt-0.5 flex-shrink-0' />
					<div className='text-sm text-green-800'>
						<p className='font-medium'>Bảo vệ người mua</p>
						<p>Nhận sản phẩm như mô tả hoặc được hoàn tiền 100%</p>
					</div>
				</div>
				<div className='flex items-start gap-3 p-3 bg-blue-50 rounded-lg'>
					<FaCheck className='w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0' />
					<div className='text-sm text-blue-800'>
						<p className='font-medium'>Thanh toán an toàn</p>
						<p>Thông tin thanh toán được bảo mật tuyệt đối</p>
					</div>
				</div>
			</div>

			{/* Action Icons */}
			<div className='flex items-center justify-between pt-4 border-t border-gray-200'>
				<div className='flex gap-4'>
					<button
						onClick={() => toggleWishlist(product._id)}
						className='flex items-center gap-2 
					text-gray-600 hover:text-pink-600 transition-colors'>
						{isInWishlist ? (
							<FaHeart className='w-4 h-4 text-pink-600' />
						) : (
							<FaRegHeart className='w-4 h-4 ' />
						)}
						<span className='text-sm'>Yêu thích</span>
					</button>
					<button className='flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors'>
						<FaShare className='w-5 h-5' />
						<span className='text-sm'>Chia sẻ</span>
					</button>
				</div>
				<button className='flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors'>
					<FaFlag className='w-5 h-5' />
					<span className='text-sm'>Báo cáo</span>
				</button>
			</div>
		</div>
	);
};

export default ProductInfo;
