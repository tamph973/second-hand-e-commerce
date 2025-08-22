import { useEffect, useMemo, useState } from 'react';
import {
	useLocation,
	useParams,
	useSearchParams,
	useNavigate,
} from 'react-router-dom';
import ProductService from '@/services/product.service';
import ProductCard from '@/components/cards/ProductCard';
import ProductListCard from '@/components/cards/ProductListCard';
import LoadingThreeDot from '@/components/common/LoadingThreeDot';
import useAppQuery from '@/hooks/useAppQuery';
import SearchPageHeader from './components/SearchPageHeader';
import ProductGridHeader from './components/ProductGridHeader';
import CategoryService from '@/services/category.service';
import CategoryChildren from './components/CategoryChildren';
import { getLocalStorage, setLocalStorage } from '@/utils/localStorageUtils';
import FilterPanel from '../search/components/FilterPanel';

const Products = () => {
	const { categorySlug } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();
	const location = useLocation();
	const navigate = useNavigate();

	// State for view mode (grid or list)
	const [viewMode, setViewMode] = useState('grid');

	useEffect(() => {
		if (location.state?.parentId) {
			setLocalStorage('parentId', location.state.parentId);
		}
	}, [location.state?.parentId]);

	const parentId = getLocalStorage('parentId') || null;

	// Lấy query parameters
	const page = searchParams.get('page') || 1;
	const limit = searchParams.get('limit') || 15;
	const sortBy = searchParams.get('sortBy') || 'createdAtDesc';
	const filterBy = searchParams.get('filterBy') || '';
	const minPrice = searchParams.get('minPrice') || '';
	const maxPrice = searchParams.get('maxPrice') || '';
	const province = searchParams.get('province');
	const search = searchParams.get('search') || '';

	const { data, isLoading, error } = useAppQuery(
		['category', categorySlug, search, sortBy, filterBy, page, minPrice, maxPrice, province],
		() =>
			ProductService.getProductsByCategorySlug(categorySlug, {
				page: parseInt(page),
				limit: parseInt(limit),
				sortBy,
				filterBy,
				minPrice,
				maxPrice,
				province,
				search,
			}),
		{
			select: (res) => res.data,
			refetchOnWindowFocus: false,
			staleTime: 5 * 60 * 1000, // 5 minutes
			cacheTime: 10 * 60 * 1000, // 10 minutes
			retry: 3,
			retryDelay: 1000,
		},
	);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [page]);

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
		setSearchParams((prev) => {
			prev.delete('search');
			prev.set('page', 1);
			return prev;
		});
	};

	const {
		data: categories = [],
		isLoading: isLoadingCategories,
		error: errorCategories,
		refetch,
	} = useAppQuery(
		['categories', 'children', data?.id],
		() =>
			CategoryService.getCategoryChildren(data?.id, {
				page: parseInt(page),
				limit: parseInt(limit),
				sortBy,
				filterBy,
			}),
		{
			select: (res) => res.data,
			refetchOnWindowFocus: false,
			staleTime: 5 * 60 * 1000, // 5 minutes
			cacheTime: 10 * 60 * 1000, // 10 minutes
			retry: 3,
			retryDelay: 1000,
		},
	);

	const handleCategoryClick = (categorySlug) => {
		// Navigate to the new category URL
		navigate(`/${categorySlug}`);
	};

	const handleViewModeChange = (newViewMode) => {
		setViewMode(newViewMode);
	};

	const handleSellerType = (sellerType) => {
		setSearchParams((prev) => {
			prev.set('sellerType', sellerType);
			prev.set('page', 1);
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
			return prev;
		});
	};

	const handleClearFilters = () => {
		setSearchParams((prev) => {
			prev.delete('minPrice');
			prev.delete('maxPrice');
			prev.delete('province');
			prev.set('page', 1);
			return prev;
		});
	};

	return (
		<div className='container mx-auto px-4 py-8'>
			{/* Header */}
			<SearchPageHeader
				data={data}
				onSearch={handleSearch}
				onSort={handleSortChange}
				onFilter={handleFilterChange}
			/>

			{/* Category Children */}
			{categories.length > 0 && (
				<CategoryChildren
					categories={categories}
					isLoading={isLoadingCategories}
					error={errorCategories}
					refetch={refetch}
					onCategoryClick={handleCategoryClick}
				/>
			)}
			{/* Search Results Info */}
			{search && (
				<div className='mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<span className='text-sm text-blue-700'>
								Kết quả tìm kiếm cho:
							</span>
							<span className='font-semibold text-blue-800'>
								&ldquo;{search}&rdquo;
							</span>
							<span className='text-sm text-blue-600'>
								({data?.pagination?.total || 0} kết quả)
							</span>
						</div>
						<button
							onClick={handleClearSearch}
							className='text-sm text-blue-600 hover:text-blue-800 font-medium underline'>
							Xóa tìm kiếm
						</button>
					</div>
				</div>
			)}
			{isLoading && <LoadingThreeDot />}
			{error && <div className='text-red-500 text-lg'>{error}</div>}

			{/* Product Grid Header */}
			{data?.products?.length > 0 && (
				<ProductGridHeader
					data={data}
					viewMode={viewMode}
					onViewModeChange={handleViewModeChange}
					onSort={handleSortChange}
					sortBy={sortBy}
					onSellerType={handleSellerType}
				/>
			)}
			<div className='w-full grid grid-cols-12 gap-4'>
				<div className='lg:col-span-3 bg-white rounded-lg p-4'>
					<FilterPanel
						onPriceChange={handlePriceChange}
						currentMinPrice={minPrice}
						currentMaxPrice={maxPrice}
						onProvinceChange={handleProvinceChange}
						onClearFilters={handleClearFilters}
					/>
				</div>

				{/* Products Display */}
				<div className='lg:col-span-9'>
					{data?.products?.length > 0 ? (
						viewMode === 'grid' ? (
							<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6'>
								{data.products.map((product) => (
									<ProductCard
										key={product._id}
										product={product}
									/>
								))}
							</div>
						) : (
							<div className='space-y-4 w-full'>
								{data.products.map((product) => (
									<ProductListCard
										key={product._id}
										product={product}
									/>
								))}
							</div>
						)
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
				</div>
			</div>

			{/* Pagination */}
			{data?.pagination?.totalPages > 1 && (
				<div className='mt-8 flex justify-center'>
					<div className='flex gap-2'>
						<button
							onClick={() =>
								handlePageChange(data.pagination.page - 1)
							}
							disabled={data.pagination.page <= 1}
							className='px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200'>
							Trước
						</button>

						{/* Page Numbers */}
						{Array.from(
							{ length: data.pagination.totalPages },
							(_, i) => i + 1,
						).map((pageNum) => (
							<button
								key={pageNum}
								onClick={() => handlePageChange(pageNum)}
								className={`px-4 py-2 border rounded-lg transition-colors duration-200 ${
									pageNum === data.pagination.page
										? 'bg-blue-600 text-white border-blue-600'
										: 'border-gray-300 hover:bg-gray-50'
								}`}>
								{pageNum}
							</button>
						))}

						<button
							onClick={() =>
								handlePageChange(data.pagination.page + 1)
							}
							disabled={
								data.pagination.page >=
								data.pagination.totalPages
							}
							className='px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200'>
							Sau
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Products;
