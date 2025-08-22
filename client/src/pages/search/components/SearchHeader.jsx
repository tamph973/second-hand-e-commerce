/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
	FaSearch,
	FaSort,
	FaFilter,
	FaChevronDown,
	FaTimes,
} from 'react-icons/fa';
import { HiOutlineAdjustments, HiOutlineSortAscending } from 'react-icons/hi';
import { useDebounce } from '@/hooks/useDebounce';

const SearchHeader = ({ data, onSort, onFilter, onSearch, keyword }) => {
	const [searchTerm, setSearchTerm] = useState(keyword);
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	// Đồng bộ searchTerm với keyword prop khi keyword thay đổi
	useEffect(() => {
		setSearchTerm(keyword);
	}, [keyword]);

	const handleSearch = (event) => {
		event.preventDefault();
		onSearch?.(searchTerm);
	};

	const handleClearSearch = () => {
		setSearchTerm('');
		onSearch?.('');
	};

	const handleSortChange = (e) => {
		if (e.target.value === '') {
			onSort?.('createdAtDesc');
		} else {
			onSort?.(e.target.value);
		}
	};

	const handleFilterChange = (e) => {
		onFilter?.(e.target.value);
	};
	return (
		<div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6'>
			{/* Header Section */}
			<div className='bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100'>
				<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
					{/* Title and Count */}
					<div className='flex-1'>
						<h1 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-1'>
							{searchTerm && keyword ? (
								<>
									Kết quả cho:{' '}
									<span className='text-blue-600 bg-blue-100 px-2 py-1 rounded-lg text-lg sm:text-2xl'>
										{keyword}
									</span>
								</>
							) : (
								'Tất cả sản phẩm'
							)}
						</h1>
						<div className='flex items-center gap-3 flex-wrap'>
							<span className='text-sm font-medium text-gray-600'>
								{data?.pagination?.total || 0} sản phẩm được tìm
								thấy
							</span>
							{/* {data?.pagination?.total > 0 && (
								<div className='flex items-center gap-2'>
									<div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
									<span className='text-xs font-medium text-green-700'>
										Đang hiển thị
									</span>
								</div>
							)} */}
						</div>
					</div>
				</div>
			</div>

			{/* Controls Section */}
			<div className='p-6'>
				<div className='flex flex-col lg:flex-row gap-6'>
					{/* Search Bar - Full width on mobile */}
					<div className='flex-1 max-w-2xl'>
						<form onSubmit={handleSearch} className='relative'>
							<div className='group'>
								<div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
									<FaSearch
										className={`w-4 h-4 transition-colors duration-200 ${
											isSearchFocused
												? 'text-blue-500'
												: 'text-gray-400'
										}`}
									/>
								</div>
								<input
									type='text'
									value={searchTerm}
									onChange={(e) =>
										setSearchTerm(e.target.value)
									}
									onFocus={() => setIsSearchFocused(true)}
									onBlur={() => setIsSearchFocused(false)}
									className={`
										w-full pl-12 pr-12 py-3.5 text-sm
										bg-gray-50 border-2 rounded-xl
										transition-all duration-200 ease-in-out
										placeholder-gray-400 text-textPrimary
										${
											isSearchFocused
												? 'border-blue-500 bg-white shadow-lg ring-4 ring-blue-100'
												: 'border-gray-200 hover:border-gray-300'
										}
										focus:outline-none focus:border-blue-500 focus:bg-white
									`}
									placeholder='Tìm kiếm sản phẩm, danh mục, thương hiệu...'
								/>
								{searchTerm && (
									<button
										type='button'
										onClick={handleClearSearch}
										className='absolute inset-y-0 right-0 pr-4 flex items-center text-red-400 hover:text-red-600 transition-colors duration-200'>
										<FaTimes className='w-4 h-4' />
									</button>
								)}
							</div>
						</form>
					</div>

					{/* Controls Group */}
					<div className='flex flex-col sm:flex-row gap-3 sm:items-center min-w-0'>
						{/* Sort Dropdown */}
						<div className='relative group'>
							<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
								<HiOutlineSortAscending className='w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200' />
							</div>
							<select
								onChange={handleSortChange}
								className='
									w-full sm:w-56 lg:w-60 pl-10 pr-10 py-3
									bg-white border-2 border-gray-200 rounded-xl
									text-sm text-gray-700 font-medium
									cursor-pointer appearance-none
									transition-all duration-200 ease-in-out
									hover:border-gray-300 hover:shadow-md
									focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100
									group-hover:bg-gray-50
								'>
								<option value=''>Sắp xếp mặc định</option>
								<option value='createdAtDesc'>
									🆕 Mới nhất
								</option>
								<option value='createdAtAsc'>📅 Cũ nhất</option>
								<option value='priceAsc'>
									💰 Giá tăng dần
								</option>
								<option value='priceDesc'>
									💸 Giá giảm dần
								</option>
								<option value='nameAsc'>🔤 Tên A-Z</option>
								<option value='nameDesc'>🔤 Tên Z-A</option>
								<option value='ratingDesc'>
									⭐ Đánh giá cao nhất
								</option>
								<option value='ratingAsc'>
									⭐ Đánh giá thấp nhất
								</option>
							</select>
							<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
								<FaChevronDown className='w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors duration-200' />
							</div>
						</div>

						{/* Filter Dropdown */}
						<div className='relative group'>
							<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
								<HiOutlineAdjustments className='w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200' />
							</div>
							<select
								onChange={handleFilterChange}
								className='
									w-full sm:w-56 lg:w-60 pl-10 pr-10 py-3
									bg-white border-2 border-gray-200 rounded-xl
									text-sm text-gray-700 font-medium
									cursor-pointer appearance-none
									transition-all duration-200 ease-in-out
									hover:border-gray-300 hover:shadow-md
									focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100
									group-hover:bg-gray-50
								'>
								<option value=''>Lọc mặc định</option>
								<option value='bestSelling'>
									🔥 Bán chạy nhất
								</option>
								<option value='topRated'>
									⭐ Đánh giá cao nhất
								</option>
								<option value='mostFavorite'>
									❤️ Yêu thích nhất
								</option>
								<option value='mostViewed'>
									👁️ Xem nhiều nhất
								</option>
								<option value='mostSold'>
									📈 Bán nhiều nhất
								</option>
								<option value='mostCommented'>
									💬 Bình luận nhiều nhất
								</option>
								<option value='mostShared'>
									📤 Chia sẻ nhiều nhất
								</option>
							</select>
							<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
								<FaChevronDown className='w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors duration-200' />
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Quick Stats */}
			{data?.pagination?.total > 0 && (
				<div className='bg-gray-50 px-6 py-4 border-t border-gray-100'>
					<div className='flex flex-wrap items-center justify-between gap-4'>
						<div className='flex flex-wrap items-center gap-4 text-sm'>
							<div className='flex items-center gap-2'>
								<div className='w-2 h-2 bg-blue-500 rounded-full'></div>
								<span className='font-medium text-gray-700'>
									Trang {data.pagination.page} /{' '}
									{data.pagination.totalPages}
								</span>
							</div>
							<div className='hidden sm:block w-px h-4 bg-gray-300'></div>
							<span className='text-gray-600'>
								Hiển thị{' '}
								{(() => {
									const currentPage = data.pagination.page;
									const limit = data.pagination.limit;
									const total = data.pagination.total;
									const startItem =
										(currentPage - 1) * limit + 1;
									const endItem = Math.min(
										currentPage * limit,
										total,
									);
									const currentPageItems =
										endItem - startItem + 1;
									return currentPageItems;
								})()}{' '}
								/ {data.pagination.total} sản phẩm
							</span>
						</div>

						{/* Quick Action Buttons */}
						{/* <div className='flex items-center gap-2'>
							<button className='px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200'>
								Làm mới
							</button>
							<button className='px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200'>
								Xuất Excel
							</button>
						</div> */}
					</div>
				</div>
			)}
		</div>
	);
};

SearchHeader.propTypes = {
	data: PropTypes.shape({
		categoryName: PropTypes.string,
		pagination: PropTypes.shape({
			total: PropTypes.number,
			page: PropTypes.number,
			totalPages: PropTypes.number,
			limit: PropTypes.number,
		}),
	}),
	onSearch: PropTypes.func,
	onSort: PropTypes.func,
	onFilter: PropTypes.func,
};

SearchHeader.defaultProps = {
	data: null,
	onSearch: null,
	onSort: null,
	onFilter: null,
};

export default SearchHeader;
