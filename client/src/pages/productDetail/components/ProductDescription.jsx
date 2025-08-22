import React from 'react';
import PropTypes from 'prop-types';

const ProductDescription = ({ description }) => {
	return (
		<section className='p-6 text-textPrimary'>
			<h2 className='font-bold text-lg mb-4 border-b border-gray-200 pb-2'>
				Mô tả sản phẩm
			</h2>
			<p className='text-gray-700 whitespace-pre-line text-sm'>
				{description}
			</p>
		</section>
	);
};

ProductDescription.propTypes = {
	description: PropTypes.string,
};

export default ProductDescription;
