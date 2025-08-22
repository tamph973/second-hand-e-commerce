import React from 'react';
import { FaLocationDot } from 'react-icons/fa6';
import { FaChevronDown } from 'react-icons/fa6';

export default function LocationSearch() {
	return (
		<div className='flex items-center gap-1 px-3 py-2 bg-white rounded-l-lg border-r cursor-pointer'>
			<FaLocationDot className='text-primary' />
			<span className='font-medium'>Hà Nội</span>
			<FaChevronDown className='text-xs ml-1' />
		</div>
	);
}
