/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import {
	FiEye,
	FiMapPin,
	FiUser,
	FiBriefcase,
	FiShoppingCart,
} from 'react-icons/fi';
import { useModal } from '@/hooks/useModal';
import ModalProductDetail from '@/components/modal/ModalProductDetail';
import { Link } from 'react-router-dom';
import { formatPriceVND, formatTimeSince } from '@/utils/helpers';
import { getAuthLocalStorage } from '@/utils/localStorageUtils';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getCart } from '@/store/cart/cartSlice';
import toast from 'react-hot-toast';
import CartService from '@/services/cart.service';
import { GoDotFill } from 'react-icons/go';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import ReactStars from 'react-stars';
import { useEffect, useState } from 'react';
import useAppQuery from '@/hooks/useAppQuery';
import WishlistService from '@/services/wishlist.service';
import { useAppMutation } from '@/hooks/useAppMutation';
import { useQueryClient } from '@tanstack/react-query';

export default function ProductListCard({ product }) {
	const { isOpen, open, close } = useModal();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const hasDiscount = product.discount > 0;
	const [isInWishlist, setIsInWishlist] = useState(false);
	const [wishlistCount, setWishlistCount] = useState(product.wishlist || 0);
	const queryClient = useQueryClient();
	// Cập nhật state khi product thay đổi
	useEffect(() => {
		setWishlistCount(product.wishlist || 0);
	}, [product.wishlist]);

	// Kiểm tra trạng thái wishlist khi component mount
	const { data: wishlistStatus } = useAppQuery(
		['wishlist', product._id],
		() => WishlistService.checkWishlistStatus(product._id),
		{
			select: (res) => res.data,
			enabled: !!product._id,
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

	const handleAddToCart = async () => {
		const { userId } = getAuthLocalStorage();
		if (!userId) {
			toast.error('Vui lòng đăng nhập để tiếp tục');
			navigate('/auth/login');
			return;
		}
		const newCart = await CartService.addToCart({
			productId: product._id,
		});
		dispatch(getCart());
		toast.success(
			<div>
				Đã thêm vào giỏ hàng!
				<button
					className='ml-2 underline text-blue-600'
					onClick={() => {
						window.location.href = '/cart';
					}}>
					Xem giỏ hàng
				</button>
			</div>,
		);
	};
	const { mutateAsync: toggleWishlist } = useAppMutation({
		mutationFn: () => WishlistService.addToWishlist(product._id),
		onSuccess: (res) => {
			queryClient.invalidateQueries(['wishlist']);
			// Cập nhật state ngay lập tức
			setIsInWishlist(res.data.isInWishlist);

			// Cập nhật số lượng wishlist
			if (res.data.isInWishlist) {
				setWishlistCount((prev) => prev + 1);
			} else {
				setWishlistCount((prev) => Math.max(0, prev - 1));
			}

			toast.success(res.data.message);
		},
		onError: (error) => {
			toast.error(error);
		},
	});
	const handleWishlistToggle = () => {
		toggleWishlist();
	};
	return (
		<>
			<div className='bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex w-full min-h-[200px]'>
				{/* Image Section */}
				<div className='relative w-[320px] aspect-[4/3] flex justify-center items-center bg-gray-100 overflow-hidden group'>
					{hasDiscount && (
						<span className='absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full z-10'>
							-{product.discount}%
						</span>
					)}
					<img
						src={product?.thumbnail?.url}
						alt={product.title}
						className='object-contain w-full h-full transition-transform duration-300 group-hover:scale-105'
						loading='lazy'
					/>
					<div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-30'>
						<button
							className='bg-white border-2 border-blue-500 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-blue-50 transition-all duration-200'
							onClick={open}>
							<FiEye className='w-5 h-5 text-blue-500' />
						</button>
					</div>
				</div>

				{/* Content Section */}
				<div className='w-[calc(100%-320px)] p-4 flex flex-col justify-between'>
					<div>
						<h3 className='text-lg font-semibold text-gray-800 mb-2 line-clamp-2'>
							<Link
								to={`/products/${product.slug}-${product._id}`}
								className='hover:text-blue-600 transition-colors'
								title={product.title}>
								{product.title}
							</Link>
						</h3>
						{product.description && (
							<p className='text-sm text-gray-600 mb-3 line-clamp-2'>
								{product.description}
							</p>
						)}
						<div className='flex items-center gap-2 mb-3'>
							{hasDiscount && (
								<span className='text-sm text-gray-400 line-through'>
									{formatPriceVND(
										product.originalPrice ||
											product.price *
												(1 + product.discount / 100),
									)}
								</span>
							)}
							<span className='text-xl font-bold text-red-600'>
								{formatPriceVND(product.price)}
							</span>
						</div>
					</div>

					{/* Actions and Meta */}
					<div className='flex flex-col gap-3'>
						{/* Sao đánh giá */}
						<div className='flex items-center gap-2 mb-2 justify-between'>
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
									({product?.reviews?.totalReviews || 0} đánh
									giá)
								</span>
							</div>
							<button
								onClick={handleAddToCart}
								className='w-fit bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-base font-medium flex items-center justify-center gap-2'>
								<FiShoppingCart className='w-5 h-5' /> Thêm vào
								giỏ
							</button>
						</div>

						<div className='flex items-center text-xs text-gray-500 gap-2 flex-wrap'>
							<div className='flex items-center gap-1'>
								<div className='flex items-center gap-2'>
									<img
										src={product.userId.avatar.url}
										alt={product.userId.fullName}
										className='w-5 h-5 rounded-full object-cover border border-gray-200'
									/>
									<span className='text-sm'>
										{product.userId.fullName}
									</span>
								</div>
								<GoDotFill className='text-[10px] text-gray-400' />
								<span
									className='truncate max-w-[80px]'
									title={formatTimeSince(product.createdAt)}>
									{formatTimeSince(product.createdAt)}
								</span>
							</div>
							<span className='ml-auto text-green-600 text-sm'>
								Đã bán: {product.sold || 0}
							</span>
						</div>
						<div className='flex items-center gap-2 justify-between'>
							<span
								className='flex items-center text-gray-400 text-sm'
								title={product?.address?.provinceName}>
								<FiMapPin className='w-4 h-4 mr-1 min-w-[16px]' />
								<span className=''>
									{product?.address?.provinceName}
								</span>
							</span>
							<button
								onClick={handleWishlistToggle}
								className='border border-pink-600 text-pink-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors'>
								{isInWishlist ? (
									<FaHeart className='w-4 h-4 text-pink-600' />
								) : (
									<FaRegHeart className='w-4 h-4' />
								)}
								<span>{wishlistCount}</span>
							</button>
						</div>
					</div>
				</div>
			</div>
			<ModalProductDetail
				product={product}
				isOpen={isOpen}
				onClose={close}
			/>
		</>
	);
}

ProductListCard.propTypes = {
	product: PropTypes.shape({
		_id: PropTypes.string,
		title: PropTypes.string,
		price: PropTypes.number,
		originalPrice: PropTypes.number,
		discount: PropTypes.number,
		rating: PropTypes.number,
		reviewCount: PropTypes.number,
		address: PropTypes.shape({
			provinceName: PropTypes.string,
		}),
		thumbnail: PropTypes.shape({
			url: PropTypes.string,
		}),
		description: PropTypes.string,
		isBusiness: PropTypes.bool,
		timeAgo: PropTypes.string,
		sold: PropTypes.number,
	}).isRequired,
};
