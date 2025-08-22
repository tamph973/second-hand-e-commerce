/* eslint-disable react/prop-types */
import React from 'react';
import { FaStar } from 'react-icons/fa';
import ReviewModal from './ReviewModal';
import { useModal } from '@/hooks/useModal';
import { useAppMutation } from '@/hooks/useAppMutation';
import ReviewService from '@/services/review.service';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { formatTimeSince } from '@/utils/helpers';
import { SlLike } from 'react-icons/sl';
import avatarDefault from '@/assets/images/avatar-default.avif';
import { getAuthLocalStorage } from '@/utils/localStorageUtils';

const ProductReview = ({ product, data = {}, isLoading }) => {
	const reviews = data?.reviews || [];
	const stats = data?.stats;
	const {userId} = getAuthLocalStorage();
	const { isOpen, open, close } = useModal();
	const queryClient = useQueryClient();
	const { mutateAsync: createReview, isPending } = useAppMutation({
		mutationFn: (data) => ReviewService.createReview(data),
		onSuccess: () => {
			toast.success('Đã đánh giá sản phẩm');
			close();
			queryClient.invalidateQueries({ queryKey: ['reviews'] });
		},
		onError: (error) => {
			toast.error(error);
		},
	});

	const ratingStats = [
		{ star: 5, count: stats?.ratingDistribution?.['5'] || 0 },
		{ star: 4, count: stats?.ratingDistribution?.['4'] || 0 },
		{ star: 3, count: stats?.ratingDistribution?.['3'] || 0 },
		{ star: 2, count: stats?.ratingDistribution?.['2'] || 0 },
		{ star: 1, count: stats?.ratingDistribution?.['1'] || 0 },
	];

	const hanldeReview = () => {
		if(!userId) {	
			toast.error('Vui lòng đăng nhập để đánh giá');
			return;
		}
		open();
	};

	return (
		<>
			<section className='p-6 text-textPrimary' id='rating'>
				<h2 className='font-bold text-lg mb-4 border-b'>Đánh giá</h2>
				{reviews.length === 0 && (
					<div className='text-center text-gray-500 text-sm bg-gray-100 p-4 rounded-lg'>
						Sản phẩm này chưa có đánh giá nào
					</div>
				)}
				<div className='flex flex-col md:flex-row md:items-center gap-8 mb-6'>
					{/* Left: Average */}
					{stats?.totalReviews > 0 && (
						<div className='flex flex-col items-center w-1/3'>
							<span className='flex items-center text-3xl font-bold text-yellow-300'>
								<FaStar className='mr-1' />{' '}
								{stats?.averageRating || 0}
								<span className='text-gray-400 text-lg font-normal ml-1'>
									/5
								</span>
							</span>
							<span className='text-gray-500 text-sm mt-1'>
								10,6k khách hài lòng
							</span>
							<span className='text-blue-600 text-sm underline cursor-pointer'>
								{stats?.totalReviews || 0} đánh giá
							</span>
						</div>
					)}
					{/* Right: Stats */}
					{stats?.totalReviews > 0 && (
						<div className='w-2/3 '>
							{ratingStats.map((item) => {
								const count =
									stats.ratingDistribution[item.star] || 0;
								const percentage =
									stats.totalReviews > 0
										? Math.round(
												(count / stats.totalReviews) *
													100,
										  )
										: 0;
								return (
									<div
										key={item.star}
										className='flex items-center gap-2 mb-1'>
										<div className='flex items-center gap-2 w-8'>
											<span className='text-sm font-medium text-textPrimary'>
													{item.star}
											</span>
											<FaStar className='w-4 h-4 text-yellow-300' />
										</div>
										<div className='w-[200px] h-2 bg-gray-200 rounded'>
											<div
												className='h-2 bg-yellow-300 rounded'
												style={{
													width: `${percentage}%`,
												}}
											/>
										</div>
										<span className='w-12 text-sm text-gray-500'>
											{count}
										</span>
									</div>
								);
							})}
						</div>
					)}
				</div>
				{/* Reviews */}
				<div className='divide-y'>
					{reviews?.map((r) => (
						<div key={r.id} className='py-4 flex items-start gap-2'>
							<div className='w-12 h-12 rounded-full overflow-hidden border  border-gray-200'>
								<img
									src={r.avatar || avatarDefault}
									alt={r.fullName}
									className='w-full h-full object-cover '
								/>
							</div>

							<div className='flex flex-col'>
								{/* Review Header */}
								<div className='flex items-start gap-4 mb-2'>
									{/* Avatar and User Info */}
									<div className='flex items-center gap-3 flex-shrink-0'>
										<div className='flex flex-col'>
											<span className='font-semibold text-sm'>
												{r.fullName}
											</span>

											<span className='text-gray-500 text-xs'>
												Đã tham gia{' '}
												{formatTimeSince(r.joinedAt)}
											</span>
										</div>
									</div>
								</div>
								{/* Star Rating */}
								<div className='flex items-center gap-2'>
									{Array(5)
										.fill(0)
										.map((_, i) => (
											<FaStar
												key={i}
												className={
													i < r.rating
														? 'text-yellow-300'
														: 'text-gray-300'
												}
												size={16}
											/>
										))}
								</div>
								{/* Review Content with Images */}
								<div className='flex flex-col gap-2 mt-1'>
									{/*  Review Text Content */}
									<div className='flex-1 min-w-0'>
										{/* Review Text */}
										<div className='text-gray-800 mb-1'>
											{r.comment}
										</div>

										{/* Review Details */}
										{/* {r.usageExperience && (
										<div className='text-sm text-gray-600 mb-1'>
											<span className='font-medium'>
												Kinh nghiệm sử dụng:
											</span>{' '}
											{r.usageExperience}
										</div>
									)} */}

										{/* Recommendation */}
										{/* {r.recommend && (
										<div className='text-red-500 text-sm mb-3'>
											❤️ Sẽ giới thiệu cho bạn bè, người
											thân
										</div>
									)} */}
									</div>
									{/*  Images */}
									{r.images && r.images.length > 0 && (
										<div className='flex-shrink-0'>
											<div className='flex gap-2 overflow-x-auto'>
												{r.images
													.slice(0, 6)
													.map((image, index) => (
														<div
															key={index}
															className='w-20 h-20 rounded-lg overflow-hidden flex-shrink-0'>
															<img
																src={image.url}
																alt={`Review image ${
																	index + 1
																}`}
																className='w-full h-full object-cover'
															/>
														</div>
													))}
											</div>
										</div>
									)}
									{/* Review Time */}
									<div className='text-gray-500 text-xs'>
										{formatTimeSince(r.createdAt) ===
										'Vừa xong' ? (
											<span className='text-green-500'>
												Vừa xong
											</span>
										) : (
											<span>
												Đã đánh giá{' '}
												{formatTimeSince(r.createdAt)}
											</span>
										)}
									</div>
								</div>

								{/* Helpful Count */}
								{/* <div className='flex items-center gap-4 text-xs text-gray-500 mt-4'>
									<button className='flex items-center gap-2 hover:text-blue-600'>
										<SlLike size={14} />
										<span className='text-xs'>
											Hữu ích ({r?.helpful || 0})
										</span>
									</button>
								</div> */}
							</div>
						</div>
					))}
				</div>

				{/* Actions */}
				<div className='flex gap-4 mt-6'>
					<button className='flex-1 bg-gray-200 text-gray-500 rounded-lg py-2 font-medium hover:bg-gray-300'>
						Xem tất cả đánh giá
					</button>
					<button
						onClick={hanldeReview}
						className='flex-1 bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700'>
						Viết đánh giá
					</button>
				</div>

				{/* Review Modal */}
				<ReviewModal
					isOpen={isOpen}
					onClose={close}
					product={product}
					onSubmit={createReview}
					loading={isPending}
				/>
			</section>
		</>
	);
};

export default ProductReview;
