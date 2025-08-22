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

const CategoryProducts = () => {
	const { data: products = [] } = useAppQuery(
		['products-grouped-by-category'],
		() => ProductService.getProductsGroupedByCategory(),
		{
			select: (res) => res.data,
			staleTime: 5 * 60 * 1000, // 5 phút
			cacheTime: 10 * 60 * 1000, // 10 phút
			refetchOnWindowFocus: false,
		},
	);
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
			{products.map((category) => (
				<motion.div
					variants={containerVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true }}
					key={category._id}
					className='mb-8 bg-white rounded-2xl shadow-lg p-6 transition-all hover:shadow-xl'>
					<div className='flex items-center justify-between mb-6 border-b pb-2'>
						<h2 className='text-xl md:text-2xl font-bold text-gray-800'>
							Sản phẩm nổi bật: {category.name}
						</h2>
						<Link
							to={`/${category.slug}`}
							className='text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors'>
							Xem tất cả
						</Link>
					</div>
					<div className='relative group'>
						<Swiper
							modules={[Navigation, Autoplay]}
							slidesPerView={5}
							spaceBetween={24}
							navigation
							autoplay={{
								delay: 5000,
								disableOnInteraction: false,
							}}
							loop={category.products.length > 5}
							className='w-full'
							style={{ padding: '8px 0' }}>
							{category.products
								.slice(0, MAX_PRODUCTS)
								.map((product) => (
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
			))}
		</section>
	);
};

export default CategoryProducts;
