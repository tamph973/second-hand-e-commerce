/* eslint-disable react/prop-types */
import React from 'react';
import { motion } from 'framer-motion';

const CategoryChildren = ({ categories = [], onCategoryClick }) => {
	const cardVariants = {
		hover: { scale: 1.05, transition: { duration: 0.3 } },
		tap: { scale: 0.95 },
	};
	return (
		<div className='container mx-auto px-5 py-6 bg-white rounded-lg shadow-md mb-6'>
			<div className='flex justify-between items-center mb-4'>
				<h2 className='text-xl font-bold text-black'>
					Danh mục liên quan
				</h2>
			</div>
			<div className='flex overflow-x-autospace-x-4  gap-4 pb-4 scrollbar-hide'>
				{categories.map((category, index) => (
					<motion.div
						key={index}
						className='w-[120px] flex-shrink-0 shadow-sm border border-gray-200 rounded-lg cursor-pointer'
						variants={cardVariants}
						whileHover='hover'
						whileTap='tap'>
						<div
							onClick={() => {
								onCategoryClick(category.slug);
							}}
							className='bg-white rounded-lg shadow-md p-2 flex flex-col items-center'>
							<img
								src={category.image}
								alt={category.name}
								title={category.name}
								className='w-16 h-16 object-cover rounded-md lazy mb-2'
								loading='lazy'
							/>
							<p className='text-sm text-gray-700 text-center overflow-hidden overflow-ellipsis whitespace-nowrap w-full'>
								{category.name}
							</p>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	);
};

export default CategoryChildren;
