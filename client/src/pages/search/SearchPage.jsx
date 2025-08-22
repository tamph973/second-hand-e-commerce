import useAppQuery from '@/hooks/useAppQuery';
import ProductService from '@/services/product.service';
import {
	useParams,
	useNavigate,
	useLocation,
	useSearchParams,
} from 'react-router-dom';
import { getUrlSearchParam } from '@/utils/helpers';
import { useEffect, useState } from 'react';
import SearchHeader from './components/SearchHeader';
import ProductCard from '@/components/cards/ProductCard';
import FilterPanel from './components/FilterPanel';

const SearchPage = () => {
	const q = getUrlSearchParam('q');
	const [search, setSearch] = useState(q || '');
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();

	const page = searchParams.get('page') || 1;
	const limit = searchParams.get('limit') || 20;
	const sortBy = searchParams.get('sortBy') || 'createdAtDesc';
	const filterBy = searchParams.get('filterBy') || '';
	const minPrice = searchParams.get('minPrice');
	const maxPrice = searchParams.get('maxPrice');
	const province = searchParams.get('province');
	const brand = searchParams.get('brand');
	const condition = searchParams.get('condition');

	const { data = [], isLoading } = useAppQuery(
		[
			'search',
			search,
			page,
			limit,
			sortBy,
			filterBy,
			minPrice,
			maxPrice,
			province,
			brand,
			condition,
		],
		() =>
			ProductService.searchProducts({
				q: search,
				page: parseInt(page),
				limit: parseInt(limit),
				sortBy: sortBy || 'createdAtDesc',
				filterBy: filterBy || '',
				minPrice: minPrice || '',
				maxPrice: maxPrice || '',
				province: province || '',
				brand: brand || '',
				condition: condition || '',
			}),
		{
			select: (res) => res.data,
			staleTime: 5 * 60 * 1000, // 5 minutes
			cacheTime: 10 * 60 * 1000, // 10 minutes
			retry: 3,
			retryDelay: 1000,
		},
	);
	console.log('data :>> ', data);
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [page]);

	// Cập nhật search state khi URL thay đổi
	useEffect(() => {
		setSearch(q);
	}, [q]);

	// Cập nhật URL khi search thay đổi
	const handleSearchChange = (newSearchTerm) => {
		setSearch(newSearchTerm);
		if (newSearchTerm) {
			navigate(`/search?q=${encodeURIComponent(newSearchTerm)}`, {
				replace: true,
			});
		} else {
			navigate('/search', { replace: true });
		}
	};

	const handlePageChange = (newPage) => {
		setSearchParams((prev) => {
			prev.set('page', newPage);
			return prev;
		});
	};

	const handleSortChange = (newSortBy) => {
		setSearchParams((prev) => {
			prev.set('sortBy', newSortBy);
			prev.set('page', 1); // Reset về trang 1 khi thay đổi sort
			return prev;
		});
	};

	const handleFilterChange = (newFilterBy) => {
		setSearchParams((prev) => {
			prev.set('filterBy', newFilterBy);
			prev.set('page', 1); // Reset về trang 1 khi thay đổi filter
			return prev;
		});
	};

	const handleSearch = (searchTerm) => {
		setSearchParams((prev) => {
			if (searchTerm.trim()) {
				prev.set('search', searchTerm.trim());
			} else {
				prev.delete('search');
			}
			prev.set('page', 1); // Reset về trang 1 khi thay đổi search
			return prev;
		});
	};

	// Clear search function
	const handleClearSearch = () => {
		setSearch('');
		setSearchParams((prev) => {
			prev.delete('q');
			prev.delete('search');
			return prev;
		});
	};

	const handlePriceChange = (minPrice, maxPrice) => {
		setSearchParams((prev) => {
			if (minPrice === '' && maxPrice === '') {
				prev.delete('minPrice');
				prev.delete('maxPrice');
			} else {
				// Nếu có giá trị, cập nhật params
				if (minPrice !== 'ALL') {
					prev.set('minPrice', minPrice);
				} else {
					prev.delete('minPrice');
				}
				if (maxPrice !== 'ALL') {
					prev.set('maxPrice', maxPrice);
				} else {
					prev.delete('maxPrice');
				}
			}
			prev.set('page', 1);
			return prev;
		});
	};

	const handleProvinceChange = (e) => {
		setSearchParams((prev) => {
			prev.set('province', e.target.value);
			prev.set('page', 1); // Reset về trang 1 khi thay đổi province
			return prev;
		});
	};

	const handleBrandChange = (e) => {
		setSearchParams((prev) => {
			if (e.target.value) {
				prev.set('brand', e.target.value);
			} else {
				prev.delete('brand');
			}
			prev.set('page', 1); // Reset về trang 1 khi thay đổi brand
			return prev;
		});
	};

	const handleConditionChange = (e) => {
		setSearchParams((prev) => {
			if (e.target.value) {
				prev.set('condition', e.target.value);
			} else {
				prev.delete('condition');
			}
			prev.set('page', 1); // Reset về trang 1 khi thay đổi condition
			return prev;
		});
	};

	const handleClearFilters = () => {
		setSearchParams((prev) => {
			prev.delete('minPrice');
			prev.delete('maxPrice');
			prev.delete('province');
			prev.delete('brand');
			prev.delete('condition');
			prev.set('page', 1);
			return prev;
		});
	};

	return (
		<div className='mx-auto max-w-7xl container px-4 py-8'>
			{/* Header */}
			<SearchHeader
				data={data}
				keyword={search}
				onSearch={handleSearchChange}
				onSort={handleSortChange}
				onFilter={handleFilterChange}
			/>
			{/* Chia layout thành 2 phần: left và right */}
			<div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
				{/* Left Side - Filter Panel */}
				<div className='lg:col-span-3 bg-white rounded-lg p-4'>
					<FilterPanel
						onPriceChange={handlePriceChange}
						currentMinPrice={minPrice}
						currentMaxPrice={maxPrice}
						onProvinceChange={handleProvinceChange}
						onClearFilters={handleClearFilters}
						onBrandChange={handleBrandChange}
						currentBrand={brand}
						onConditionChange={handleConditionChange}
						currentCondition={condition}
						currentProvince={province}
					/>
				</div>

				{/* Right Side - Products Gird*/}
				<div className='lg:col-span-9'>
					{isLoading && (
						<div className='text-center py-16'>
							<div className='w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
								<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
							</div>
						</div>
					)}
					{data?.products?.length > 0 ? (
						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6'>
							{data.products.map((product) => (
								<ProductCard
									key={product._id}
									product={product}
								/>
							))}
						</div>
					) : (
						<div className='text-center py-16'>
							<div className='w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
								<svg
									className='w-12 h-12 text-gray-400'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
									/>
								</svg>
							</div>

							<h3 className='text-xl font-semibold text-gray-800 mb-2'>
								{search
									? 'Không tìm thấy sản phẩm phù hợp'
									: 'Không có sản phẩm nào'}
							</h3>
							<p className='text-gray-600 mb-4'>
								{search
									? 'Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc tìm kiếm'
									: 'Chưa có sản phẩm nào trong danh mục này'}
							</p>
							{search && (
								<button
									onClick={handleClearSearch}
									className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200'>
									Xóa tìm kiếm
								</button>
							)}
						</div>
					)}

					{/* Pagination */}
					{data?.pagination?.totalPages > 1 && (
						<div className='mt-8 flex justify-center'>
							<div className='flex gap-2'>
								<button
									onClick={() =>
										handlePageChange(
											data.pagination.page - 1,
										)
									}
									disabled={data.pagination.page <= 1}
									className='px-4 py-2 border border-gray-300 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors duration-200'>
									Trước
								</button>

								{/* Page Numbers */}
								{Array.from(
									{ length: data.pagination.totalPages },
									(_, i) => i + 1,
								).map((pageNum) => (
									<button
										key={pageNum}
										onClick={() =>
											handlePageChange(pageNum)
										}
										className={`px-4 py-2 border rounded-lg transition-colors duration-200 ${
											pageNum === data.pagination.page
												? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
												: 'text-textPrimary border-gray-300 hover:bg-gray-50'
										}`}>
										{pageNum}
									</button>
								))}

								<button
									onClick={() =>
										handlePageChange(
											data.pagination.page + 1,
										)
									}
									disabled={
										data.pagination.page >=
										data.pagination.totalPages
									}
									className='px-4 py-2 border border-gray-300 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors duration-200'>
									Sau
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default SearchPage;
