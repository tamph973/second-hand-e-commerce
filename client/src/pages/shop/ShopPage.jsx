import React, { useEffect, useState } from 'react';
import ShopDetail from './components/ShopDetail';
import { useLocation, useParams } from 'react-router-dom';
import { getSellerInfo } from '@/store/seller/sellerSlice';
import { useDispatch } from 'react-redux';
import ShopCategory from './components/ShopCategory';
import ShopProduct from './components/ShopProduct';
import useAppQuery from '@/hooks/useAppQuery';
import ProductService from '@/services/product.service';
import { getUrlSearchParam } from '@/utils/helpers';

const ShopPage = () => {
	const { shopId } = useParams();
	const dispatch = useDispatch();
	const [category, setCategory] = useState('ALL');
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 10,
	});

	useEffect(() => {
		const categoryId = getUrlSearchParam('category_id');
		const newCategory = categoryId ? categoryId : 'ALL';
		setCategory(newCategory);
	}, [category]);

	const {
		data: products,
		isLoading,
		error,
		refetch,
	} = useAppQuery(
		['products', shopId, category],
		() =>
			ProductService.getProductsBySeller(shopId, {
				category_id: category,
				page: pagination.page,
				limit: pagination.limit,
			}),
		{
			select: (res) => res.data,
			enabled: !!shopId && !!category,
			staleTime: 5 * 60 * 1000, // 5 phút
			cacheTime: 10 * 60 * 1000, // 10 phút
		},
	);
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	useEffect(() => {
		if (shopId) {
			dispatch(getSellerInfo(shopId));
		}
	}, [shopId, dispatch]);

	// Tính toán thống kê đánh giá của shop
	const calculateShopStats = (products) => {
		if (!products || products.length === 0) {
			return {
				averageRating: 0,
				totalProducts: 0,
				totalReviews: 0,
				ratingDistribution: {
					1: 0,
					2: 0,
					3: 0,
					4: 0,
					5: 0,
				},
			};
		}

		let totalRating = 0;
		let totalReviews = 0;
		const ratingDistribution = {
			1: 0,
			2: 0,
			3: 0,
			4: 0,
			5: 0,
		};

		products.forEach((product) => {
			const reviews = product.reviews;
			if (reviews && reviews.totalReviews > 0) {
				totalRating += reviews.averageRating * reviews.totalReviews; // Tổng điểm đánh giá: Ex: 4.5 * 10 = 45
				totalReviews += reviews.totalReviews; // Tổng số đánh giá: Ex: 10

				// Cộng dồn phân phối rating: Ex: {1: 1, 2: 2, 3: 3, 4: 4, 5: 5}
				Object.keys(reviews.ratingDistribution).forEach((rating) => {
					ratingDistribution[rating] +=
						reviews.ratingDistribution[rating] || 0;
				});
			}
		});

		const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0; // Tổng điểm đánh giá / Tổng số đánh giá: Ex: 45 / 10 = 4.5

		return {
			averageRating: Math.round(averageRating * 10) / 10, // Làm tròn 1 chữ số thập phân
			totalReviews,
			ratingDistribution,
		};
	};

	const shopStats = calculateShopStats(products?.products);
	return (
		<div className='min-h-screen bg-gray-50 py-8'>
			<div className='container mx-auto px-4'>
				{/* Shop Detail */}
				<ShopDetail shopStats={shopStats} />
				{/* Shop Category */}
				<ShopCategory
					shopId={shopId}
					category={category}
					setCategory={setCategory}
				/>
				{/* Shop Product */}
				<ShopProduct
					products={products?.products}
					loading={isLoading || !products}
					error={error}
					refetch={refetch}
				/>
			</div>
		</div>
	);
};

export default ShopPage;
