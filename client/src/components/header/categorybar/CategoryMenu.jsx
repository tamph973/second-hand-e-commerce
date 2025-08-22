import React from 'react';
import { FaBars } from 'react-icons/fa';
import { FaChevronDown } from 'react-icons/fa6';

export default function CategoryMenu() {
	return (
		<div className='flex items-center gap-2 cursor-pointer hover:opacity-80'>
			<FaBars className='text-xl' />
			<span className='font-medium'>Danh mục</span>
			<FaChevronDown className='text-xs' />
		</div>
	);
}
