import ProductCard from '@/components/cards/ProductCard';
import ProductService from '@/services/product.service';
import useAppQuery from '@/hooks/useAppQuery';
import { motion } from 'framer-motion';

const NewestProducts = () => {
	const { data: products, isLoading } = useAppQuery(
		['newest-products'],
		() => ProductService.getNewestProducts(),
		{
			select: (res) => res.data,
			staleTime: 1000 * 60 * 5,
			gcTime: 1000 * 60 * 5,
			refetchOnWindowFocus: false,
		},
	);

	const sectionVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1, transition: { duration: 0.5 } },
	};

	const headingVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5, delay: 0.1 },
		},
	};

	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: (i) => ({
			opacity: 1,
			y: 0,
			transition: { duration: 0.4, delay: 0.1 + i * 0.08 },
		}),
	};

	return (
		<motion.section
			className='w-full py-6'
			variants={sectionVariants}
			initial='hidden'
			whileInView='visible'
			viewport={{ once: true, amount: 0.2 }}>
			<div className='max-w-7xl mx-auto'>
				<motion.div
					className='flex items-center justify-between mb-4'
					variants={headingVariants}>
					<h2 className='text-xl md:text-2xl font-bold text-gray-800'>
						Sản phẩm mới đăng bán
					</h2>
					<motion.a
						href='/products/newest'
						className='text-blue-500 hover:underline text-sm font-medium'
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.98 }}>
						Xem tất cả
					</motion.a>
				</motion.div>
				<div className='flex gap-4 overflow-x-auto pb-2'>
					{products?.map((product, index) => (
						<motion.div
							key={product.id}
							className='min-w-[220px] max-w-[240px]'
							variants={cardVariants}
							initial='hidden'
							whileInView='visible'
							viewport={{ once: true, amount: 0.2 }}
							custom={index}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}>
							<ProductCard product={product} />
						</motion.div>
					))}
				</div>
			</div>
		</motion.section>
	);
};

export default NewestProducts;
