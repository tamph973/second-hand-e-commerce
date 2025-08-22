import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/cards/ProductCard';
import useAppQuery from '@/hooks/useAppQuery';
import ProductService from '@/services/product.service';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { getAuthLocalStorage } from '@/utils/localStorageUtils';

const ProductByUser = () => {
	const { userId } = getAuthLocalStorage();
	const { data: products = [] } = useAppQuery(
		['products-by-user', userId],
		() => ProductService.getProductRecommendByUser(userId),
		{
			select: (res) => res.recommendations,
			staleTime: 5 * 60 * 1000, // 5 phút
			cacheTime: 10 * 60 * 1000, // 10 phút
			refetchOnWindowFocus: false,
		},
	);
	const productData = products.map((product) => product.product_info);
	console.log('productData :>> ', productData);
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.2 },
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
	};

	// Giới hạn số sản phẩm hiển thị
	const MAX_PRODUCTS = 10;

	return (
		<section className='w-full mt-8'>
			<motion.div
				variants={containerVariants}
				whileInView='visible'
				viewport={{ once: true }}
				className='p-6 mb-8 transition-all bg-white shadow-lg rounded-2xl hover:shadow-xl'>
				<div className='flex items-center justify-between pb-2 mb-6 border-b'>
					<h2 className='text-xl font-bold text-gray-800 md:text-2xl'>
						Bạn có thể thích
					</h2>
					{/* <Link
								to={`/${product.slug}`}
								className='text-sm font-medium text-blue-500 transition-colors hover:text-blue-600'>
								Xem tất cả
							</Link> */}
				</div>
				<div className='relative group'>
					<Swiper
						modules={[Navigation, Autoplay]}
						slidesPerView={5}
						spaceBetween={24}
						navigation
						autoplay={{
							delay: 2000,
							disableOnInteraction: false,
						}}
						loop={productData.length > 5}
						className='w-full'
						style={{ padding: '8px 0' }}>
						{productData.slice(0, MAX_PRODUCTS).map((product) => (
							<SwiperSlide key={product._id}>
								<motion.div
									variants={itemVariants}
									className='min-w-[220px] max-w-[250px] flex-shrink-0 h-full'>
									<ProductCard product={product} />
								</motion.div>
							</SwiperSlide>
						))}
						{/* Inline style cho hiệu ứng mũi tên Swiper */}
						<style>{`
								.swiper-button-next, .swiper-button-prev {
									opacity: 0;
									transition: opacity 0.3s;
								}
								.group:hover .swiper-button-next,
								.group:hover .swiper-button-prev {
									opacity: 1;
								}
							`}</style>
					</Swiper>
				</div>
			</motion.div>
		</section>
	);
};

export default ProductByUser;
