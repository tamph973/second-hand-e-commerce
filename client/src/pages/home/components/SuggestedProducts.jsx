import React from 'react';
import ProductCard from '@/components/cards/ProductCard';

const mockProducts = [
	{
		id: 1,
		name: 'Bán nubia z60 ultra 12/256',
		price: 9600000,
		location: 'Hồ Chí Minh',
		img: 'https://cdn.chotot.com/GJ70jTWOLVHaOSOTa58nMVYtR1N-9tviMcybP1PEgBY/preset:listing/plain/0d495435c60fec14591f44cbbad48e80-2934998885223255591.jpg',
		description:
			'Nubia Z60 Ultra, RAM 12GB, bộ nhớ 256GB, máy đẹp, đủ phụ kiện',
		isBusiness: false,
		timeAgo: '2 ngày trước',
	},
	{
		id: 2,
		name: 'máy in 2 mặt tốc độ cao ; siêu bền Canon 6680X !',
		price: 2300000,
		location: 'Hà Nội',
		img: 'https://cdn.chotot.com/8bavS9eok-NDbHSKaXLUrkuYmikh4092TzDWvGQHWZw/preset:listing/plain/52ea38b608cb3aa8898a1ca32e05e1f5-2937765420321855216.jpg',
		description: 'Canon 6680X, in 2 mặt, tốc độ cao, bảo hành 6 tháng',
		isBusiness: true,
		timeAgo: '5 ngày trước',
	},
	{
		id: 3,
		name: 'Acer Gaming Nitro5 I5-11th/16G/512G/GTX 1650/144Hz',
		price: 9990000,
		location: 'Thành phố Thủ Đức',
		img: 'https://cdn.chotot.com/Dv95Kxi8iDjWTHiLKS1mzAaX87bLdZhcd_fHAqLuPCU/preset:listing/plain/24b994cc45a7a99401be9e813f5cf12c-2933652026952872824.jpg',
		description:
			'Acer Nitro5, i5-11th, RAM 16GB, SSD 512GB, GTX 1650, màn 144Hz',
		isBusiness: false,
		timeAgo: '7 ngày trước',
	},
	{
		id: 4,
		name: 'Bán Iphone 14 ProMax 256Gb còn tốt',
		price: 16800000,
		location: 'Hà Nội',
		img: 'https://static.oreka.vn/800-800_34683dea-03d0-46e5-af18-e32ec58b5ef6',
		description: 'Iphone 14 ProMax, 256GB, pin 90%, máy đẹp, đủ hộp',
		isBusiness: true,
		timeAgo: '1 ngày trước',
	},
	{
		id: 5,
		name: 'IPHONE 11 PRO MAX pin zin mới thay 100%, full chức năng',
		price: 7000000,
		location: 'Bình Phước',
		img: 'https://static.oreka.vn/800-800_6b510571-6e78-446a-a6f9-2a3702bee6a2',
		description: 'Iphone 11 Pro Max, pin mới thay, full chức năng, giá tốt',
		isBusiness: false,
		timeAgo: '3 ngày trước',
	},
];

const SuggestedProducts = () => {
	return (
		<section className='w-full py-6'>
			<div className='max-w-7xl mx-auto'>
				<div className='flex items-center justify-between mb-4'>
					<h2 className='text-xl md:text-2xl font-bold text-gray-800'>
						Gợi ý cho bạn hôm nay
					</h2>
					<a
						href='/products/suggested'
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

export default SuggestedProducts;
