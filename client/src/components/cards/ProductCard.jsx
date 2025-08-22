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
import { toast } from 'react-hot-toast';
import CartService from '@/services/cart.service';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import useAppQuery from '@/hooks/useAppQuery';
import WishlistService from '@/services/wishlist.service';
import { useAppMutation } from '@/hooks/useAppMutation';
import { useQueryClient } from '@tanstack/react-query';
import ReactStars from 'react-stars';

export default function ProductCard({ product }) {
	const { isOpen, open, close } = useModal();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const hasDiscount = product.discount > 0; // Giả định có trường discount
	const [isInWishlist, setIsInWishlist] = useState(false);
	const queryClient = useQueryClient();

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
			setIsInWishlist(res.data.isInWishlist);
		},
		onError: (err) => {
			toast.error(err);
		},
	});
	const handleWishlistToggle = () => {
		if (!getAuthLocalStorage().userId) {
			toast.error('Vui lòng đăng nhập để tiếp tục');
			navigate('/auth/login');
			return;
		}
		toggleWishlist();
	};

	return (
		<>
			<div
				className='bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col cursor-pointer min-w-[220px] max-w-[240px] w-full h-full min-h-[360px] max-h-[390px] mx-auto'
				style={{ boxSizing: 'border-box' }}>
				{/* Hình ảnh và overlay */}
				<div className='relative w-full aspect-[4/3] flex justify-center items-center bg-gray-200 overflow-hidden group hover:scale-105 transition-transform duration-300'>
					{hasDiscount && (
						<span className='absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
							-{product.discount}%
						</span>
					)}
					<img
						src={product?.thumbnail?.url}
						alt={product.title}
						className='object-cover w-full h-full transition duration-300 max-h-[180px] min-h-[180px]'
						loading='lazy'
						style={{
							aspectRatio: '4/3',
							objectFit: 'cover',
							width: '100%',
							height: '100%',
						}}
					/>

					{/* Overlay + Eye icon */}
					<div className='absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-20'>
						<button
							className='bg-white border-2 border-blue-500 rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-blue-50 transition-all duration-200'
							onClick={open}>
							<FiEye className='w-6 h-6 text-blue-500' />
						</button>
					</div>
				</div>

				{/* Nội dung chi tiết */}
				<div className='single-product-details p-3 flex-1 flex flex-col justify-between'>
					<div>
						<h3 className=' text-base font-semibold leading-tight min-h-[48px] max-h-[48px] line-clamp-2 overflow-hidden text-gray-800'>
							<Link
								to={`/products/${product.slug}-${product._id}`}
								className='hover:text-blue-600 transition-colors block w-full max-w-full'
								title={product.title}
								style={{
									display: '-webkit-box',
									WebkitLineClamp: 2,
									WebkitBoxOrient: 'vertical',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'normal',
								}}>
								{product.title}
							</Link>
						</h3>
						{/* {product.description && (
							<p
								className='text-xs text-gray-500 mb-2 line-clamp-2 max-h-[32px] overflow-hidden'
								style={{
									display: '-webkit-box',
									WebkitLineClamp: 2,
									WebkitBoxOrient: 'vertical',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'normal',
									minHeight: '32px',
									maxHeight: '32px',
								}}
								title={product.description}>
								{product.description}
							</p>
						)} */}
						{/* Star rating */}
						<div className='flex items-center gap-1'>
							<ReactStars
								count={5}
								value={product?.reviews?.averageRating}
								size={16}
								edit={false}
								color2='#ffd700'
								color1='#e5e7eb'
							/>
							<span className='text-gray-500 text-xs'>
								({product?.reviews?.totalReviews || 0})
							</span>
						</div>

						<div className='flex items-center gap-2 mb-2'>
							{hasDiscount && (
								<span className='text-sm font-medium text-gray-400 line-through'>
									{formatPriceVND(
										product.originalPrice ||
											product.price *
												(1 + product.discount / 100),
									)}
								</span>
							)}
							<span className='text-lg font-bold text-red-600'>
								{formatPriceVND(product.price)}
							</span>
						</div>
					</div>

					{/* Nút hành động */}
					<div className='flex flex-col gap-2'>
						<button
							onClick={() => {
								handleAddToCart(product);
							}}
							className='w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition-colors duration-200 text-sm flex items-center justify-center gap-1'>
							<FiShoppingCart className='w-4 h-4' /> Thêm vào giỏ
						</button>
						<div className='flex items-center text-xs text-gray-400 gap-1 mt-1 flex-wrap'>
							<span className='flex items-center max-w-[20px]'>
								{product.isBusiness ? (
									<FiBriefcase
										className='w-4 h-4'
										title='Bán chuyên'
									/>
								) : (
									<FiUser
										className='w-4 h-4'
										title='Cá nhân'
									/>
								)}
							</span>
							<span className='mx-1'>·</span>
							<span
								className='truncate max-w-[80px]'
								title={formatTimeSince(product.createdAt)}>
								{formatTimeSince(product.createdAt)}
							</span>
							<span className='ml-auto text-xs text-green-600'>
								Đã bán: {product.sold || 0}
							</span>
						</div>
						<div className='flex items-center gap-2 justify-between'>
							<div
								className='flex items-center text-gray-400 text-xs'
								title={product?.address?.provinceName}>
								<FiMapPin className='w-4 h-4 mr-1 min-w-[16px]' />
								<span className=''>
									{product?.address?.provinceName}
								</span>
							</div>
							<div>
								{/* Thêm icon wishlist */}
								<button
									onClick={handleWishlistToggle}
									className='bg-white  rounded-full w-6 h-6 flex items-center justify-center shadow-lg hover:bg-pink-50 transition-all duration-200'>
									{isInWishlist ? (
										<FaHeart className='w-4 h-4 text-pink-600' />
									) : (
										<FaRegHeart className='w-4 h-4 text-pink-600' />
									)}
								</button>
							</div>
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

ProductCard.propTypes = {
	product: PropTypes.shape({
		_id: PropTypes.string,
		title: PropTypes.string,
		price: PropTypes.number,
		originalPrice: PropTypes.number, // Thêm nếu có giá gốc
		discount: PropTypes.number, // Thêm nếu có giảm giá
		address: PropTypes.shape({
			provinceName: PropTypes.string,
		}),
		thumbnail: PropTypes.shape({
			url: PropTypes.string,
		}),
		description: PropTypes.string,
		isBusiness: PropTypes.bool,
		timeAgo: PropTypes.string,
		sold: PropTypes.number, // Thêm số lượng đã bán
	}).isRequired,
};
