/* eslint-disable react/prop-types */
import LoadingThreeDot from '@/components/common/LoadingThreeDot';
import { formatTimeSince } from '@/utils/helpers';
import React from 'react';
import {
	FaStar,
	FaRegStar,
	FaUserFriends,
	FaBoxOpen,
	FaRegClock,
	FaRegCommentDots,
	FaPhoneAlt,
	FaRegEnvelope,
	FaMapMarkerAlt,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';

const shopSample = {
	avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
	name: 'Hoàng Hiệp Mobile',
	onlineStatus: 'Hoạt động 6 giờ trước',
	rating: 4.9,
	ratingCount: 91,
	address: 'Đường Số 85, Phường Tân Quy, Quận 7, Hồ Chí Minh, Việt Nam',
	products: 56,
	sold: 883,
	followers: 1942,
	chatResponse: '94% (trong 75 phút)',
	joinTime: '4 năm 7 tháng',
	phone: '0123456789',
	email: 'shop@email.com',
};

const ShopDetail = ({ shop = shopSample, shopStats }) => {
	console.log('shopStats :>> ', shopStats);
	const { seller } = useSelector((state) => state.seller);
	const address = seller?.address[0] || null;

	if (!seller) return null;
	return (
		<>
			<section className='bg-white rounded-xl p-6 shadow border border-gray-100 mb-4 flex flex-col md:flex-row md:items-center gap-6 text-textPrimary'>
				{/* Left: Avatar + Main Info */}
				<div className='flex items-center gap-4 flex-1 min-w-[250px]'>
					<img
						src={seller.avatar.url}
						alt={seller.fullName}
						className='w-20 h-20 rounded-full object-cover border-2 border-gray-200'
					/>
					<div>
						<div className='flex items-center gap-2'>
							<span className='text-xl font-bold'>
								{seller.fullName}
							</span>
							<span className='text-xs text-gray-500'>
								• {shop.onlineStatus}
							</span>
						</div>
						<div className='flex items-center gap-2 mt-1'>
							<span className='text-yellow-300 font-bold flex items-center gap-1'>
								{shopStats?.averageRating || 0}
								<FaStar size={18} />
							</span>
							<span className='text-gray-700 text-sm'>
								({shopStats?.totalReviews }{' '}
								đánh giá)
							</span>
						</div>
						<div className='text-gray-600 text-sm mt-1 flex items-center gap-2'>
							<FaRegEnvelope className='inline mr-1' />
							{seller.email}
						</div>
						<div className='text-gray-600 text-sm mt-1 flex items-center gap-2'>
							<FaPhoneAlt className='inline mr-1' />
							{seller.phoneNumber}
						</div>
						<div className='text-gray-600 text-sm mt-1 flex items-center gap-2'>
							<FaMapMarkerAlt className='inline mr-1' />
							{address
								? `${address.addressDetail}, ${address.wardName}, ${address.districtName}, ${address.provinceName}`
								: 'Chưa cập nhật địa chỉ'}
						</div>
					</div>
				</div>
				{/* Right: Stats + Actions */}
				<div className='flex-1 flex flex-col gap-2'>
					<div className='flex flex-wrap gap-6 text-sm text-gray-700 mb-2'>
						<div>
							<FaBoxOpen className='inline mr-1 text-blue-500' />
							Sản phẩm:{' '}
							<span className='font-bold'>
								{shopStats?.totalProducts ||
									seller.productCount}
							</span>
						</div>
						<div>
							Đã bán:{' '}
							<span className='font-bold'>{seller.sold}</span>
						</div>
						<div>
							<FaUserFriends className='inline mr-1 text-pink-500' />
							Người theo dõi:{' '}
							<span className='font-bold'>
								{shop.followers.toLocaleString()}
							</span>
						</div>
						<div>
							<FaRegCommentDots className='inline mr-1 text-green-500' />
							Phản hồi chat:{' '}
							<span className='font-bold'>
								{shop.chatResponse}
							</span>
						</div>
						<div>
							<FaRegClock className='inline mr-1 text-gray-500' />
							Tham gia:{' '}
							<span className='font-bold'>
								{formatTimeSince(seller.createdAt)}
							</span>
						</div>
					</div>
					<div className='flex gap-2 mt-2'>
						<button className='border border-gray-300 rounded-lg px-4 py-2 font-medium hover:bg-gray-50 flex items-center gap-2'>
							<FaUserFriends /> Theo dõi
						</button>
						<button className='border border-gray-300 rounded-lg px-4 py-2 font-medium hover:bg-gray-50 flex items-center gap-2'>
							<FaRegCommentDots /> Chat
						</button>
					</div>
				</div>
			</section>

			{/* Rating Distribution Section */}
			{shopStats && shopStats.totalReviews > 0 && (
				<section className='bg-white rounded-xl p-6 shadow border border-gray-100 mb-4'>
					<h3 className='text-lg font-semibold mb-4 text-gray-800'>
						Chi tiết đánh giá
					</h3>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						{/* Rating Summary */}
						<div className='flex items-center gap-4'>
							<div className='text-center'>
								<div className='text-3xl font-bold text-yellow-300'>
									{shopStats.averageRating}
								</div>
								<div className='flex items-center justify-center gap-1 mt-1'>
									{[1, 2, 3, 4, 5].map((star) => (
										<FaStar
											key={star}
											className={`w-4 h-4 ${
												star <=
												Math.round(
													shopStats.averageRating,
												)
													? 'text-yellow-300'
													: 'text-gray-300'
											}`}
										/>
									))}
								</div>
								<div className='text-sm text-gray-600 mt-1'>
									{shopStats.totalReviews} đánh giá
								</div>
							</div>
						</div>

						{/* Rating Distribution */}
						<div className='space-y-2'>
							{[5, 4, 3, 2, 1].map((rating) => {
								const count =
									shopStats.ratingDistribution[rating] || 0;
								const percentage =
									shopStats.totalReviews > 0
										? Math.round(
												(count /
													shopStats.totalReviews) *
													100,
										  )
										: 0;

								return (
									<div
										key={rating}
										className='flex items-center gap-2'>
										<div className='flex items-center gap-2 w-8'>
											<span className='text-sm font-medium text-textPrimary'>
												{rating}
											</span>
											<FaStar className='w-4 h-4 text-yellow-300' />
										</div>
										<div className='flex-1 bg-gray-200 rounded-full h-2'>
											<div
												className='bg-yellow-300 h-2 rounded-full'
												style={{
													width: `${percentage}%`,
												}}></div>
										</div>
										<div className='w-12 text-sm text-gray-600'>
											{count}
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</section>
			)}
		</>
	);
};

export default ShopDetail;
