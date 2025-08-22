/* eslint-disable react/prop-types */
import { formatPriceVND } from '@/utils/helpers';
import React from 'react';

const ShippingMethodItem = ({ method, selectedId, onSelect }) => {
	return (
		<label
			key={method.id}
			className='relative flex items-center rounded-xl cursor-pointer select-none border-2 border-gray-200'>
			<input
				type='radio'
				name='shipping'
				checked={selectedId === method.id}
				onChange={() => onSelect(method.id)}
				className='ml-4 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 border-2'
			/>
			<div className='flex-1 p-4'>
				<span>{method.name}</span>
				<span className='ml-2 text-gray-600'>
					{formatPriceVND(method.price)}
				</span>
				<span className='ml-4 text-gray-400'>{method.time}</span>
			</div>
		</label>
	);
};

export default React.memo(ShippingMethodItem);
