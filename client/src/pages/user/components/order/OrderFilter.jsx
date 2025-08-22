/* eslint-disable react/prop-types */
import React from 'react';

export default function OrderFilter({
	keyword,
	onKeywordChange,
	date,
	onDateChange,
	sort,
	onSortChange,
}) {
	return (
		<div className='flex flex-wrap gap-2 items-center mb-4 text-gray-900'>
			<input
				type='text'
				placeholder='Nhập từ khóa ở đây'
				value={keyword}
				onChange={(e) => onKeywordChange(e.target.value)}
				className='border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-900'
				style={{ minWidth: 200 }}
			/>
			<input
				type='date'
				value={date}
				onChange={(e) => onDateChange(e.target.value)}
				className='border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
			/>
			<select
				value={sort}
				onChange={(e) => onSortChange(e.target.value)}
				className='border rounded px-3 py-2 w-[180px] text-sm focus:outline-none focus:ring-2 focus:ring-primary'>
				<option value='createdAt-desc'>Được tạo gần đây</option>
				<option value='createdAt-asc'>Cũ nhất</option>
				<option value='total-desc'>Tổng tiền cao nhất</option>
				<option value='total-asc'>Tổng tiền thấp nhất</option>
			</select>
		</div>
	);
}
