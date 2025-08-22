/* eslint-disable react/prop-types */
import ProductCard from '@/components/cards/ProductCard';
import LoadingThreeDot from '@/components/common/LoadingThreeDot';

const ShopProduct = ({ products = [], loading, error, refetch }) => {
	if (error) {
		return (
			<div className='bg-white rounded-xl p-6 shadow border border-gray-100 mb-4'>
				<p className='text-red-500'>{error.message}</p>
			</div>
		);
	}
	if (loading) {
		return (
			<div className='bg-white rounded-xl p-6 shadow border border-gray-100 mb-4'>
				<LoadingThreeDot />
			</div>
		);
	}
	return (
		<div className='bg-white rounded-xl p-6 shadow border border-gray-100 mb-4'>
			<h1 className='text-xl uppercase font-semibold text-gray-800 mb-6 flex items-center gap-2'>
				Sản phẩm của shop
				<span className='text-sm text-white w-5 h-5 bg-red-500 rounded-full flex items-center justify-center'>
					{products.length}
				</span>
			</h1>
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
				{!loading && products.length > 0 ? (
					products.map((product) => (
						<ProductCard key={product._id} product={product} />
					))
				) : (
					<div className='col-span-full text-center text-gray-500 text-lg'>
						Không có sản phẩm
					</div>
				)}
			</div>
			{products.length > 0 && (
				<div className='mt-6 text-center'>
					<button
						onClick={refetch}
						className='bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition-colors duration-200 text-sm'
					>
						Xem tất cả
					</button>
				</div>
			)}
		</div>
	);
};

export default ShopProduct;
