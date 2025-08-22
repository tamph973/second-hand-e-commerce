import React from 'react';
import { useNavigate } from 'react-router-dom';

const suggestionBadgesData = [
	{
		label: 'Bạn có sản phẩm tương tự?',
		action: 'Đăng bán',
		to: '/seller/create-product',
	},
	{
		label: 'Bạn có ship hàng không?',
	},
	{
		label: 'Sản phẩm còn bảo hành không?',
	},
	{
		label: 'Sản phẩm đã qua sửa chữa chưa?',
	},
];

const ProductSuggestionBadges = () => {
	const navigate = useNavigate();
	return (
		<div className='flex flex-wrap gap-3 my-4 items-center justify-center'>
			{suggestionBadgesData.map((badge, idx) =>
				badge.action ? (
					<span
						key={idx}
						className='inline-flex items-center px-4 py-2 rounded-full bg-gray-50 text-gray-700 text-base font-normal border border-gray-200 hover:bg-orange-50 cursor-pointer transition'
						onClick={() => badge.to && navigate(badge.to)}>
						{badge.label}{' '}
						<span className='ml-1 text-orange-600 font-semibold'>
							{badge.action}
						</span>
					</span>
				) : (
					<span
						key={idx}
						className='inline-flex items-center px-4 py-2 rounded-full bg-gray-50 text-gray-700 text-base font-normal border border-gray-200 hover:bg-gray-100 cursor-pointer transition'>
						{badge.label}
					</span>
				),
			)}
		</div>
	);
};

export default ProductSuggestionBadges;
