/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Button, Select } from 'flowbite-react';
import { HiFilter, HiRefresh, HiSearch } from 'react-icons/hi';
import useAppQuery from '@/hooks/useAppQuery';
import CategoryService from '@/services/category.service';
import CustomInput from '@/components/form/CustomInput';
import {
	PRODUCT_STATUS_OPTIONS,
	SORT_BY_OPTIONS,
} from '@/constants/productOptions';

const FilterProducts = ({ onFilter, onReset, loading = false }) => {
	const [filters, setFilters] = useState({
		search: '',
		category: 'ALL',
		brand: 'ALL',
		status: 'ALL',
		sortBy: 'createdAtDesc',
	});

	// Fetch categories from API
	const { data: categories = [] } = useAppQuery(
		['categories-all'],
		() => CategoryService.getAllCategory(),
		{
			select: (res) => res.data,
			refetchOnWindowFocus: false,
		},
	);

	const handleFilterChange = (key, value) => {
		setFilters((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const handleShowData = () => {
		onFilter(filters);
	};

	const handleReset = () => {
		setFilters({
			search: '',
			category: 'ALL',
			brand: 'ALL',
			status: 'ALL',
			sortBy: 'createdAtDesc',
		});
		onReset();
	};

	return (
		<div className='bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6 transition-all duration-300 hover:shadow-md'>
			<div className='flex items-center gap-2 mb-4'>
				<HiFilter className='w-5 h-5 text-blue-600' />
				<h3 className='text-lg font-semibold text-gray-800'>
					Bộ lọc tìm kiếm
				</h3>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6'>
				{/* Search */}
				<div className='space-y-2'>
					<CustomInput
						id='search'
						name='search'
						type='text'
						label='Tìm kiếm'
						placeholder='Tìm kiếm...'
						value={filters.search}
						onChange={(e) =>
							handleFilterChange('search', e.target.value)
						}
						className='transition-all duration-200 focus:ring-2 focus:ring-blue-500'
					/>
				</div>

				{/* Category */}
				<div className='space-y-2'>
					<CustomInput
						type='select'
						id='category'
						label='Danh mục'
						name='category'
						options={categories.map((category) => ({
							label: category.name,
							value: category.id,
						}))}
						value={filters.category}
						onChange={(e) =>
							handleFilterChange('category', e.target.value)
						}
						className='transition-all duration-200 focus:ring-2 focus:ring-blue-500'></CustomInput>
				</div>

				{/* Status */}
				<div className='space-y-2'>
					<CustomInput
						type='select'
						label='Trạng thái'
						name='status'
						options={PRODUCT_STATUS_OPTIONS}
						value={filters.status}
						onChange={(e) =>
							handleFilterChange('status', e.target.value)
						}
						className='transition-all duration-200 focus:ring-2 focus:ring-blue-500'></CustomInput>
				</div>

				{/* Sort */}
				<div className='space-y-2'>
					<CustomInput
						type='select'
						label='Sắp xếp'
						name='sortBy'
						options={SORT_BY_OPTIONS}
						value={filters.sortBy}
						onChange={(e) =>
							handleFilterChange('sortBy', e.target.value)
						}
						className='transition-all duration-200 focus:ring-2 focus:ring-blue-500'></CustomInput>
				</div>

				{/* Reset Button */}
				<div className='space-y-2'>
					<label className='block text-sm font-medium text-gray-700'>
						&nbsp;
					</label>
					<Button
						color='gray'
						onClick={handleReset}
						disabled={loading}
						className='w-full transition-all duration-200 hover:bg-gray-100 hover:scale-105'>
						<HiRefresh className='w-4 h-4 mr-2' />
						Đặt lại
					</Button>
				</div>
			</div>

			<div className='flex justify-end gap-3'>
				<Button
					color='blue'
					onClick={handleShowData}
					disabled={loading}
					className='transition-all duration-200 hover:scale-105'>
					Áp dụng bộ lọc
				</Button>
			</div>
		</div>
	);
};

export default FilterProducts;
