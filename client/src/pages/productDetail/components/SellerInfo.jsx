import React from 'react';
import PropTypes from 'prop-types';
import {
	FiMessageSquare,
	FiHeart,
	FiCheckCircle,
	FiMail,
	FiMapPin,
	FiUserPlus,
	FiUserCheck,
} from 'react-icons/fi';
import {
	FaStore,
	FaStar,
	FaBoxOpen,
	FaRegClock,
	FaUserFriends,
	FaCalendarAlt,
	FaShieldAlt,
	FaCircle,
	FaCheckCircle,
} from 'react-icons/fa';
import { formatTimeSince } from '@/utils/helpers';
import shopDefault from '@/assets/images/shop-default.jpg';
import emailVerified from '@/assets/images/email-verified.png';
import phoneVerified from '@/assets/images/phone-verified.png';

const SellerInfo = ({
	seller,
	avatar,
	name,
	isOnline,
	lastActive,
	shopUrl,
	onChat,
	onViewShop,
	isVerified,
	isFollowing,
	onFollow,
	onUnfollow,
	stats = {},
	email,
	location,
}) => {
	return (
		<div className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>
			{/* Header - Basic Info */}
			<div className='p-4 md:p-6 flex flex-col md:flex-row gap-4 items-start md:items-center border-b border-gray-200'>
				{/* Avatar & Name */}
				<div className='flex items-center gap-4 w-full md:w-auto'>
					<div className='relative flex-shrink-0'>
						<img
							src={avatar || shopDefault}
							alt={name}
							className='w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-white shadow-md'
						/>
						{isOnline && (
							<span className='absolute bottom-0 right-0 w-4 h-4 bg-white rounded-full flex items-center justify-center'>
								<FaCircle
									className='text-green-500 w-3 h-3'
									title='Đang hoạt động'
								/>
							</span>
						)}
					</div>

					<div className='min-w-0'>
						<div className='flex items-center gap-2'>
							<h3 className='text-lg font-semibold text-gray-900 truncate max-w-[180px] md:max-w-none'>
								{name}
							</h3>
							{isVerified && (
								<FaCheckCircle
									className='text-blue-500 ml-1 flex-shrink-0'
									title='Đã xác minh'
								/>
							)}
						</div>

						<div className='flex items-center gap-2 text-xs text-gray-500 mt-1 flex-wrap'>
							{location && (
								<span className='flex items-center'>
									<FiMapPin className='mr-1' />
									{location}
								</span>
							)}
							{email && (
								<span className='flex items-center'>
									<FiMail className='mr-1' />
									{email}
								</span>
							)}
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				<div className='flex flex-wrap gap-2 w-full md:w-auto md:ml-auto'>
					<button
						onClick={onChat}
						className='flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium flex items-center justify-center gap-2 text-sm shadow-sm transition-colors'>
						<FiMessageSquare className='w-4 h-4' />
						<span className='hidden sm:inline'>Chat ngay</span>
					</button>

					<button
						onClick={onViewShop}
						className='flex-1 md:flex-none border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg font-medium flex items-center justify-center gap-2 text-sm shadow-sm transition-colors'>
						<FaStore className='w-4 h-4' />
						<span className='hidden sm:inline'>Xem shop</span>
					</button>

					{isFollowing ? (
						<button
							onClick={onUnfollow}
							className='flex-1 md:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-medium flex items-center justify-center gap-2 text-sm shadow-sm transition-colors'>
							<FiUserCheck className='w-4 h-4' />
							<span className='hidden sm:inline'>
								Bỏ theo dõi
							</span>
						</button>
					) : (
						<button
							onClick={onFollow}
							className='flex-1 md:flex-none bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg font-medium flex items-center justify-center gap-2 text-sm shadow-sm transition-colors'>
							<FiUserPlus className='w-4 h-4' />
							<span className='hidden sm:inline'>Theo dõi</span>
						</button>
					)}
				</div>
			</div>

			{/* Stats Section */}
			<div className='p-4 md:p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4'>
				<div className='flex flex-col items-center'>
					<div className='flex items-center gap-1 text-gray-500 text-sm mb-1'>
						<FaStar className='text-yellow-400' />
						<span>Đánh giá</span>
					</div>
					<span className='text-gray-900 font-bold text-lg'>
						{stats.rating || '-'}
					</span>
				</div>

				<div className='flex flex-col items-center'>
					<div className='flex items-center gap-1 text-gray-500 text-sm mb-1'>
						<FaBoxOpen className='text-blue-400' />
						<span>Sản phẩm</span>
					</div>
					<span className='text-gray-900 font-bold text-lg'>
						{stats.products || '-'}
					</span>
				</div>

				<div className='flex flex-col items-center'>
					<div className='flex items-center gap-1 text-gray-500 text-sm mb-1'>
						<FaRegClock className='text-green-500' />
						<span>Phản hồi</span>
					</div>
					<span className='text-gray-900 font-bold text-lg'>
						{stats.replyRate || '-'}%
					</span>
				</div>

				<div className='flex flex-col items-center'>
					<div className='flex items-center gap-1 text-gray-500 text-sm mb-1'>
						<FaUserFriends className='text-purple-400' />
						<span>Theo dõi</span>
					</div>
					<span className='text-gray-900 font-bold text-lg'>
						{stats.followers || '-'}
					</span>
				</div>

				<div className='flex flex-col items-center'>
					<div className='flex items-center gap-1 text-gray-500 text-sm mb-1'>
						<FaCalendarAlt className='text-pink-400' />
						<span>Tham gia</span>
					</div>
					<span className='text-gray-900 font-bold text-lg'>
						{stats.joined ? formatTimeSince(stats.joined) : '-'}
					</span>
				</div>

				{isVerified && (
					<div className='flex flex-col items-center'>
						<div className='flex items-center gap-1 text-gray-500 text-sm mb-1'>
							<FaShieldAlt className='text-blue-500' />
							<span>Xác minh</span>
						</div>
						<div className='flex items-center gap-1'>
							{/* Xác minh email */}
							{seller.isEmailVerified && (
								<img
									src={emailVerified}
									alt='Email verified'
									title='Email đã xác minh'
									className='w-6 h-6'
								/>
							)}

							{/* Xác minh số điện thoại */}
							{seller.isPhoneVerified && (
								<img
									src={phoneVerified}
									alt='Phone verified'
									title='Số điện thoại đã xác minh'
									className='w-6 h-6'
								/>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

SellerInfo.propTypes = {
	seller: PropTypes.object,
	avatar: PropTypes.string,
	name: PropTypes.string.isRequired,
	isOnline: PropTypes.bool,
	lastActive: PropTypes.string,
	shopUrl: PropTypes.string,
	onChat: PropTypes.func,
	onViewShop: PropTypes.func,
	isVerified: PropTypes.bool,
	isFollowing: PropTypes.bool,
	onFollow: PropTypes.func,
	onUnfollow: PropTypes.func,
	stats: PropTypes.shape({
		rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		replyRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		products: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		followers: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		joined: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	}),
	email: PropTypes.string,
	location: PropTypes.string,
};

export default SellerInfo;
