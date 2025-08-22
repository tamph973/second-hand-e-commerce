import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Banner from './components/Banner';
import Category from './components/Category';
import CategoryProducts from './components/CategoryProducts';
import HistoryProduct from './components/HistoryProduct';
import { useDispatch } from 'react-redux';
import { getCart } from '@/store/cart/cartSlice';
import { getHistoryProducts } from '@/utils/localStorageUtils';
import ProductByUser from './components/ProductByUser';
import NewestProducts from './components/NewestProducts';

export default function Home() {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getCart());
	}, [dispatch]);

	const itemVariants = {
		hidden: { y: 50, opacity: 0 },
		visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
	};

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='max-w-[1410px] mx-auto px-4 sm:px-6 lg:px-8 py-6'>
				<motion.div
					className='rounded-2xl overflow-hidden shadow-xl'
					variants={itemVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true }}>
					<Banner />
				</motion.div>
				{getHistoryProducts().length > 0 && (
					<motion.div
						variants={itemVariants}
						initial='hidden'
						whileInView='visible'
						viewport={{ once: true }}>
						<HistoryProduct />
					</motion.div>
				)}
				<ProductByUser />
				<motion.div
					className='mt-8 bg-white rounded-2xl shadow-lg p-6'
					variants={itemVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true }}>
					<Category />
				</motion.div>
				<motion.div
					className='mt-8 bg-white rounded-2xl shadow-lg p-6'
					variants={itemVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true }}>
					<NewestProducts />
				</motion.div>
				<motion.div
					className='mt-8'
					variants={itemVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true }}>
					<CategoryProducts />
				</motion.div>
			</div>
		</div>
	);
}
