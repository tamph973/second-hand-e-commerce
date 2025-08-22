import useSocket from '@/hooks/useSocket';
import React, { useState } from 'react';
import {
	FaBell,
	FaRegCommentDots,
	FaRegHeart,
	FaShoppingBasket,
	FaThLarge,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import NotificationCenter from '@/components/common/NotificationCenter';
import {
	getAuthLocalStorage,
	setLocalStorage,
} from '@/utils/localStorageUtils';
import useAppQuery from '@/hooks/useAppQuery';
import WishlistService from '@/services/wishlist.service';
import { toast } from 'react-hot-toast';

export default function QuickActions() {
	const { totalQuantity } = useSelector((state) => state.cart);
	const navigate = useNavigate();
	const [showNotifications, setShowNotifications] = useState(false);

	const handleBellClick = () => {
		setShowNotifications(!showNotifications);
	};

	const { data: wishlistCount = 0 } = useAppQuery(
		['wishlist', 'wishlistCount'],
		() => WishlistService.getWishlistCount(),
		{
			select: (res) => res.data.count,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			staleTime: 1000 * 60 * 5,
			cacheTime: 1000 * 60 * 5,
		},
	);
	const { userId } = getAuthLocalStorage();

	const handleProtectedAction = (e, action) => {
		if (!userId) {
			e.preventDefault();
			toast.error('Vui lòng đăng nhập để sử dụng chức năng này');
			return false;
		}
		return true;
	};

	const handleWishlistClick = (e) => {
		if (!handleProtectedAction(e, 'wishlist')) {
			return;
		}
		// Nếu đã đăng nhập, cho phép chuyển hướng bình thường
	};

	const handleCartClick = (e) => {
		if (!handleProtectedAction(e, 'cart')) {
			return;
		}
		// Nếu đã đăng nhập, cho phép chuyển hướng bình thường
	};

	return (
		<div className='flex items-center gap-4 text-gray-700'>
			<div className='relative'>
				<FaBell
					className='text-xl cursor-pointer hover:text-primaryBg'
					title='Thông báo'
					onClick={handleBellClick}
				/>
				{/* {showNotifications && notifications.length > 0 && (
					<div className='absolute top-6 right-0 bg-white border border-gray-200 rounded shadow-lg p-2 w-64 z-10'>
						{notifications.slice(-5).map((notif) => (
							<div
								key={notif.id}
								className='p-2 border-b last:border-b-0'>
								{notif.message}
							</div>
						))}
					</div>
				)} */}
			</div>
			{/* <FaRegCommentDots
				className='text-xl cursor-pointer hover:text-primaryBg'
				title='Tin nhắn'
			/> */}

			{/* Yêu thích */}
			<Link
				to='/wishlist'
				className='relative'
				onClick={handleWishlistClick}>
				<FaRegHeart className='text-xl cursor-pointer hover:text-primaryBg' />
				{
					<span className='absolute -top-2.5 left-3 bg-red-500 text-white text-[11px] rounded-full w-4 h-4 flex items-center justify-center'>
						{wishlistCount}
					</span>
				}
			</Link>

			<Link to='/cart' className='relative' onClick={handleCartClick}>
				<FaShoppingBasket
					className={`text-xl cursor-pointer hover:text-primaryBg transition-transform duration-150`}
					title='Giỏ hàng'
				/>
				{
					<span className='absolute -top-2.5 left-0.5 bg-red-500 text-white text-[11px] rounded-full w-4 h-4 flex items-center justify-center'>
						{totalQuantity}
					</span>
				}
			</Link>

			{/* <FaThLarge
				className='text-xl cursor-pointer hover:text-primaryBg'
				title='Quản lý đăng bán'
			/> */}
		</div>
	);
}
