import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FiChevronRight } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { FaClock, FaMapMarkerAlt, FaRegHeart, FaHeart } from 'react-icons/fa';
import Modal from './Modal';
import { formatPriceVND, formatTimeSince } from '@/utils/helpers';
import ProductImageGallery from '@/components/common/ProductImageGallery';
import { checkLoginAndNavigate } from '@/utils/auth';
import { getAuthLocalStorage } from '@/utils/localStorageUtils';
import toast from 'react-hot-toast';
import { getCart } from '@/store/cart/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import CartService from '@/services/cart.service';
import { useAppMutation } from '@/hooks/useAppMutation';
import WishlistService from '@/services/wishlist.service';
import { useQueryClient } from '@tanstack/react-query';
import useAppQuery from '@/hooks/useAppQuery';

export default function ModalProductDetail({ product, isOpen, onClose }) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { items, counts } = useSelector((state) => state.wishlist);
	const [isInWishlist, setIsInWishlist] = useState(false);
	const [wishlistCount, setWishlistCount] = useState(counts[product._id] || 0);
	const queryClient = useQueryClient();
	const { userId } = getAuthLocalStorage();

	const time = formatTimeSince(product.createdAt);

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
		},
	);

	useEffect(() => {
		if (wishlistStatus) {
			setIsInWishlist(wishlistStatus.isInWishlist);
		}
	}, [wishlistStatus]);

	const checkLogin = () => {
		if (
			!checkLoginAndNavigate(
				navigate,
				userId,
				'/auth/login',
				'Bạn cần đăng nhập để thực hiện thao tác này',
			)
		) {
			return;
		}
		navigate('/');
	};

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
		if (!userId) {
			toast.error('Vui lòng đăng nhập để thực hiện thao tác này');
			navigate('/auth/login');
			return;
		}
		toggleWishlist();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size='5xl'
			showCloseButton={false}
			className='p-0 bg-white rounded-xl shadow-xl'>
			{/* Header */}
			<div className='flex items-center justify-between border-b border-gray-200 px-6 py-4'>
				<div className='flex items-center gap-2'>
					<Link
						to={`/products/${product.slug}-${product._id}`}
						className='text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate max-w-[500px]'
						title={product.title}>
						{product.title}
					</Link>
					<FiChevronRight className='text-blue-500 w-5 h-5' />
				</div>
				<button
					className='text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors'
					onClick={onClose}
					aria-label='Đóng'>
					×
				</button>
			</div>

			{/* Body */}
			<div className='flex flex-col md:flex-row p-6 gap-6'>
				{/* Image Gallery */}
				<div className='flex-1 flex items-center justify-center'>
					<ProductImageGallery
						images={product.images}
						alt={product.title}
						title={product.title}
					/>
				</div>

				{/* Product Info */}
				<div className='flex-1'>
					<h2 className='text-2xl font-bold text-gray-900 mb-2 line-clamp-2'>
						{product.title}
					</h2>
					{/* Địa chỉ người bán */}
					<div className='flex flex-col items-start gap-4 text-sm text-gray-600 mb-4'>
						<span className='flex items-center gap-1'>
							<FaMapMarkerAlt className='w-4 h-4' />
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
					<p className='text-xl text-red-600 font-semibold mb-2'>
						{formatPriceVND(product.price)}
					</p>
					{product.description && (
						<p
							className='text-sm text-gray-600 mb-4 line-clamp-2'
							title={product.description}>
							{product.description}
						</p>
					)}

					<div className='flex gap-3'>
						<button
							onClick={checkLogin}
							className='bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors'>
							Mua ngay
						</button>
						<button
							onClick={handleAddToCart}
							className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
							Thêm vào giỏ hàng
						</button>
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
		</Modal>
	);
}

ModalProductDetail.propTypes = {
	product: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		price: PropTypes.number.isRequired,
		images: PropTypes.array.isRequired,
		description: PropTypes.string,
		timeAgo: PropTypes.string,
		location: PropTypes.string,
		isBusiness: PropTypes.bool,
		wishlist: PropTypes.number,
		address: PropTypes.object,
		createdAt: PropTypes.string,
		slug: PropTypes.string,
	}).isRequired,
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
};
