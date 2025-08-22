import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaSearch, FaSort, FaFilter, FaChevronDown } from 'react-icons/fa';
import { useDebounce } from '@/hooks/useDebounce';
const SearchPageHeader = ({ data, onSearch, onSort, onFilter }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const debouncedSearchTerm = useDebounce(searchTerm, 500);
	const handleSearch = (event) => {
		event.preventDefault();
		onSearch?.(searchTerm);
	};

	const handleSortChange = (e) => {
		onSort?.(e.target.value);
	};

	const handleFilterChange = (e) => {
		onFilter?.(e.target.value);
	};

	return (
		<div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6'>
			<div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
				{/* Left Side - Title and Count */}
				<div className='flex-1'>
					<h1 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-2 drop-shadow-sm'>
						{data?.categoryName || 'Danh mục sản phẩm'}
					</h1>
					<div className='flex items-center gap-3'>
						<span className='text-sm font-medium text-gray-600'>
							{data?.pagination?.total || 0} sản phẩm
						</span>
						{data?.pagination?.total > 0 && (
							<span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700'>
								{data.pagination.total} items
							</span>
						)}
					</div>
				</div>

				{/* Right Side - Controls */}
				<div className='flex flex-col sm:flex-row gap-4 w-full lg:w-auto'>
					{/* Search Bar */}
					<form className='max-w-md mx-auto' onSubmit={handleSearch}>
						<div className='relative w-full'>
							<input
								type='search'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								id='search-dropdown'
								className='block p-3 pr-20 pl-4 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 '
								placeholder='Tìm kiếm sản phẩm...'
							/>
							<button
								type='button'
								onClick={handleSearch}
								className='absolute top-0 end-0 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 px-5 py-3'>
								<FaSearch />
								<span className='sr-only'>Search</span>
							</button>
						</div>
					</form>

					{/* Sort Dropdown */}
					<div className='relative'>
						<select
							onChange={handleSortChange}
							className={`
								w-full sm:w-40 px-4 py-3 pr-10
								border border-gray-200 rounded-xl
								focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent
								bg-gray-50 text-gray-900 cursor-pointer
								appearance-none transition-all duration-300 shadow-sm hover:shadow-md
							`}>
							<option value=''>Sắp xếp mặc định</option>
							<option value='createdAtDesc'>Mới nhất</option>
							<option value='createdAtAsc'>Cũ nhất</option>
							<option value='priceAsc'>Giá tăng dần</option>
							<option value='priceDesc'>Giá giảm dần</option>
							<option value='nameAsc'>Tên A-Z</option>
							<option value='nameDesc'>Tên Z-A</option>
							<option value='ratingDesc'>
								Đánh giá cao nhất
							</option>
							<option value='ratingAsc'>
								Đánh giá thấp nhất
							</option>
						</select>
					</div>

					{/* Filter Dropdown */}
					<div className='relative'>
						<select
							onChange={handleFilterChange}
							className={`
								w-[200px] sm:w-40 px-4 py-3 pr-4
								border border-gray-200 rounded-xl
								focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent
								bg-gray-50 text-gray-900 cursor-pointer
								appearance-none transition-all duration-300 shadow-sm hover:shadow-md
							`}>
							<option value=''>Lọc mặc định</option>
							<option value='bestSelling'>Bán chạy nhất</option>
							<option value='topRated'>Đánh giá cao nhất</option>
							<option value='mostFavorite'>Yêu thích nhất</option>
							<option value='mostViewed'>Xem nhiều nhất</option>
							<option value='mostSold'>Bán nhiều nhất</option>
							<option value='mostCommented'>
								Bình luận nhiều nhất
							</option>
							<option value='mostShared'>
								Chia sẻ nhiều nhất
							</option>
						</select>
					</div>
				</div>
			</div>

			{/* Quick Stats */}
			{data?.pagination?.total > 0 && (
				<div className='mt-6 pt-4 border-t border-gray-200'>
					<div className='flex flex-wrap gap-4 text-sm font-medium text-gray-600'>
						<span>
							Trang {data.pagination.page} /{' '}
							{data.pagination.totalPages}
						</span>
						<span>•</span>
						<span>
							Hiển thị{' '}
							{Math.min(
								data.pagination.limit,
								data.pagination.total,
							)}{' '}
							/ {data.pagination.total} sản phẩm
						</span>
					</div>
				</div>
			)}
		</div>
	);
};

SearchPageHeader.propTypes = {
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

SearchPageHeader.defaultProps = {
	data: null,
	onSearch: null,
	onSort: null,
	onFilter: null,
};

export default SearchPageHeader;
