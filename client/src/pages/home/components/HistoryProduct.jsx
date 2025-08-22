import React, { useState } from 'react';
import { formatPriceVND } from '@/utils/helpers';
import { FiX } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useProductHistory } from '@/hooks/useProductHistory';

const HistoryProduct = () => {
	const navigate = useNavigate();
	const [displayCount, setDisplayCount] = useState(5);
	const {
		historyProducts,
		removeProductFromHistory,
		clearAllHistory,
		getDisplayProducts,
		hasMoreProducts,
		getRemainingCount,
	} = useProductHistory();

	const handleRemoveProduct = (productId, e) => {
		e.stopPropagation(); // Ngăn chặn event bubble
		removeProductFromHistory(productId);
	};

	const handleProductClick = (product) => {
		navigate(`/products/${product.slug}-${product._id}`);
	};

	// Nếu không có sản phẩm nào trong lịch sử, không hiển thị component
	if (historyProducts.length === 0) {
		return null;
	}

	const handleMoreProduct = () => {
		setDisplayCount(
			(prev) => prev + (historyProducts.length - displayCount),
		);
	};

	const handleShowLess = () => {
		setDisplayCount(5);
	};

	// Lấy sản phẩm để hiển thị
	const getProductsToShow = () => {
		return historyProducts.slice(0, displayCount);
	};

	return (
		<div className='max-w-full mx-auto mt-8 bg-white rounded-2xl shadow-lg p-6'>
			<div className='rounded-lg'>
				{/* Header */}
				<div className='flex items-center justify-between mb-4 border-b'>
					<h2 className='text-xl md:text-2xl font-bold text-blue-600'>
						Bạn đã xem
					</h2>
					<button
						onClick={clearAllHistory}
						className='text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors'>
						Xóa lịch sử
					</button>
				</div>

				{/* Products - Horizontal layout */}
				<div className='flex gap-4 flex-wrap pb-2'>
					{getProductsToShow().map((product) => (
						<div
							key={product._id}
							className='bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col cursor-pointer w-[240px]'
							onClick={() => handleProductClick(product)}>
							{/* Product Image */}
							<div className='relative w-full aspect-[4/3] bg-gray-200 overflow-hidden rounded-t-lg'>
								<img
									src={product.images?.[0]?.url}
									alt={product.title}
									className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
								/>
							</div>
							{/* Remove button */}
							{/* <button
								onClick={(e) =>
									handleRemoveProduct(product._id, e)
								}
								className='absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 z-10'>
								<FiX className='w-3 h-3 text-red-600' />
							</button> */}
							{/* Product Info */}
							<Link
								to={`/products/${product.slug}-${product._id}`}
								className='p-3'>
								<h3 className='font-medium text-gray-900 text-sm line-clamp-2 mb-2 min-h-[2.5rem]'>
									{product.title}
								</h3>
								<p className='text-red-600 font-bold text-lg'>
									{formatPriceVND(product.price)}
								</p>
							</Link>
						</div>
					))}
				</div>

				{/* Show more/less buttons */}
				{displayCount < historyProducts.length && (
					<div className='text-center mt-4'>
						{displayCount === 5 ? (
							<button
								onClick={handleMoreProduct}
								className='text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors'>
								Xem thêm (
								{historyProducts.length - displayCount} sản
								phẩm)
							</button>
						) : (
							<button
								onClick={handleShowLess}
								className='text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors'>
								Thu gọn
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default HistoryProduct;
