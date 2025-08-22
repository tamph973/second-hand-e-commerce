import React from 'react';
import PropTypes from 'prop-types';
import { formatPriceVND } from '@/utils/helpers';

const ProductItemCheckout = ({ product, seller }) => {
	return (
		<div className='flex items-center bg-white rounded-2xl shadow p-4 mb-3 text-gray-900'>
			{/* Ảnh sản phẩm */}
			<img
				src={product.thumbnail}
				alt={product.title}
				className='w-20 h-20 object-cover rounded-xl mr-4 border'
			/>
			{/* Thông tin sản phẩm */}
			<div className='flex-1 min-w-0'>
				<div className='font-bold text-lg text-blue-900 mb-1 truncate'>
					{product.title}
				</div>
				<div className='text-gray-500 text-sm mb-1 truncate'>
					{product.description}
				</div>
				<div className='flex items-center gap-2 mt-1'>
					<span className='text-base text-gray-700'>
						{formatPriceVND(product.price)}
					</span>
					<span className='text-base text-gray-500'>x</span>
					<span className='text-base text-gray-700'>
						{product.quantity}
					</span>
					<span className='ml-4 font-bold text-orange-600 text-lg'>
						= {formatPriceVND(product.price * product.quantity)}
					</span>
				</div>
				<div className='text-xs text-gray-500 mt-1'>
					Người bán: {seller.fullName}
				</div>
			</div>
			{/* Số lượng */}
			<div className='ml-6 flex items-center min-w-[32px]'>
				<span>Số lượng:</span>
				<span className=' ml-1 text-lg font-semibold text-blue-900'>
					{product.quantity}
				</span>
			</div>
		</div>
	);
};

ProductItemCheckout.propTypes = {
	product: PropTypes.object.isRequired,
	seller: PropTypes.object.isRequired,
};

export default ProductItemCheckout;
