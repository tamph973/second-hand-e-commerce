import React from 'react';
import PropTypes from 'prop-types';

const CategoryCard = ({ image, name, onClick }) => (
	<div
		onClick={onClick}
		className={`
				group relative flex flex-col items-center justify-start
				w-28 h-28 
				rounded-full
				transition-all duration-300 ease-in-out
				cursor-pointer transform hover:scale-105 active:scale-95
				
			`}
		>
		{/* Image container */}
		<div className=' relative w-16 h-16 mb-2 mt-2'>
			<img
				src={image}
				alt={name}
				className='w-full h-full object-contain transition-all duration-300 group-hover:scale-110'
				draggable={false}
				loading='lazy'
			/>
		</div>

		{/* Name */}
		<h3 className='text-center text-sm font-medium text-gray-800 leading-tight group-hover:text-gray-900 transition-colors duration-300 px-1  line-clamp-2 w-20 sm:w-24 md:w-28 lg:w-40'>
			{name}
		</h3>
	</div>
);

CategoryCard.propTypes = {
	image: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	onClick: PropTypes.func,
};

export default CategoryCard;
