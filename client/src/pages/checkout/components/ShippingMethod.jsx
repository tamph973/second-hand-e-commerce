/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import Button from '@/components/common/Button';
import { FaPlus } from 'react-icons/fa';
import ShippingMethodItem from './ShippingMethodItem';

const shippingMethods = [
	{
		id: 'standard',
		name: 'Giao hàng tiêu chuẩn',
		price: 15000,
		time: '3-5 ngày',
	},
	{
		id: 'fast',
		name: 'Giao hàng nhanh',
		price: 25000,
		time: '1-2 ngày',
	},
	{
		id: 'sameDay',
		name: 'Giao hàng trong ngày',
		price: 45000,
		time: 'Trong ngày',
	},
];

const ShippingMethod = ({ onShippingFee }) => {
	const [selectedId, setSelectedId] = useState(
		shippingMethods[0]?.id || null,
	);

	useEffect(() => {
		onShippingFee(shippingMethods[0]?.price || 0);
	}, [onShippingFee]);

	const handleSelect = (id) => {
		setSelectedId(id);
		onShippingFee(
			shippingMethods.find((method) => method.id === id)?.price,
		);
	};

	return (
		<div className='bg-white rounded-2xl shadow-xl p-6'>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-900'>
					Phương thức giao hàng
				</h2>
			</div>

			<div className='space-y-4'>
				{shippingMethods.length === 0 ? (
					<div className='text-center py-8'>
						<p className='text-gray-500 mb-4'>
							Bạn chưa có phương thức nào
						</p>
						<Button className='bg-blue-600 hover:bg-blue-700 text-white'>
							Thêm phương thức mới
						</Button>
					</div>
				) : (
					<div className='space-y-4'>
						{shippingMethods.map((method) => (
							<ShippingMethodItem
								key={method.id}
								method={method}
								selectedId={selectedId}
								onSelect={handleSelect}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default ShippingMethod;
