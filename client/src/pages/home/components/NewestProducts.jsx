import React from 'react';
import ProductCard from '@/components/cards/ProductCard';

const mockProducts = [
	{
		id: 6,
		name: 'Sách Kỷ luật bàn ăn',
		price: 65000,
		location: 'Hà Nội',
		img: '/images/products/apple-watch.png',
	},
	{
		id: 7,
		name: 'ĐẮC NHÂN TÂM',
		price: 30000,
		location: 'Hà Nội',
		img: '/images/products/apple-watch.png',
	},
	{
		id: 8,
		name: 'Beast Quest 6',
		price: 39000,
		location: 'Hà Nội',
		img: '/images/products/apple-watch.png',
	},
	{
		id: 9,
		name: 'Tiếng NHẬT cho mọi người',
		price: 35000,
		location: 'Hà Nội',
		img: '/images/products/apple-watch.png',
	},
	{
		id: 10,
		name: 'TRÚC CHI - vị giám đốc "hát rong"',
		price: 65000,
		location: 'Hà Nội',
		img: '/images/products/apple-watch.png',
	},
];

const NewestProducts = () => {
	return (
		<section className='w-full py-6'>
			<div className='max-w-7xl mx-auto'>
				<div className='flex items-center justify-between mb-4'>
					<h2 className='text-xl md:text-2xl font-bold text-gray-800'>
						Sản phẩm mới đăng bán
					</h2>
					<a
						href='/products/newest'
						className='text-blue-500 hover:underline text-sm font-medium'>
						Xem tất cả
					</a>
				</div>
				<div className='flex gap-4 overflow-x-auto pb-2'>
					{mockProducts.map((product) => (
						<div
							key={product.id}
							className='min-w-[220px] max-w-[240px]'>
							<ProductCard product={product} />
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default NewestProducts;
