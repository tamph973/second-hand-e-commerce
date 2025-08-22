/* eslint-disable react/prop-types */
import ProductCard from '@/components/cards/ProductCard';
import useAppQuery from '@/hooks/useAppQuery';
import ProductService from '@/services/product.service';
import React from 'react';

const ProductRecommend = ({ productId }) => {
	const {
		data: productRecommend = [],
		isLoading,
		error,
	} = useAppQuery(
		['productRecommend', productId],
		() => ProductService.getProductRecommend(productId),
		{
			select: (data) => data.recommended_products,
			enabled: !!productId,
		},
	);

	console.log('productRecommend :>> ', productRecommend);

	return (
		<div className='bg-white rounded-xl p-6 shadow-md border-gray-200 text-textPrimary'>
			{/* Header */}
			<h2 className='font-semibold text-xl text-gray-800 mb-4 border-b border-gray-200 pb-2'>
				Sản phẩm tương tự
			</h2>

			{/* Grid product */}
			{productRecommend?.length > 0 && (
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
					{productRecommend.map((product) => (
						<ProductCard key={product._id} product={product} />
					))}
				</div>
			)}
		</div>
	);
};

export default ProductRecommend;
