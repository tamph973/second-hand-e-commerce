import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryCard from '@/components/cards/CategoryCard';
import LoadingThreeDot from '@/components/common/LoadingThreeDot';
import useAppQuery from '@/hooks/useAppQuery';
import { FaSearch } from 'react-icons/fa';
import { useDebounce } from '@/hooks/useDebounce';
import CategoryService from '@/services/category.service';

const CategoryPage = () => {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState('');
	const [isFocused, setIsFocused] = useState(false);
	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	// Fetch all categories
	const {
		data: categoriesData,
		isLoading,
		error,
	} = useAppQuery(
		['categories', debouncedSearchTerm],
		() => CategoryService.getAllCategory({ search: debouncedSearchTerm }),
		{
			select: (res) => res.data,
			refetchOnWindowFocus: false,
		},
	);

	// Filter categories based on search term
	const filteredCategories = useMemo(() => {
		if (!categoriesData) return [];
		return categoriesData.filter((category) =>
			category.name
				.toLowerCase()
				.includes(debouncedSearchTerm.toLowerCase()),
		);
	}, [categoriesData, debouncedSearchTerm]);

	const handleCategoryClick = (category) => {
		navigate(`/${category.slug}`);
	};

	const clearSearch = () => {
		setSearchTerm('');
	};

	if (isLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<LoadingThreeDot />
			</div>
		);
	}

	if (error) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='text-center py-12'>
					<p className='text-red-500 text-lg'>
						Có lỗi xảy ra: {error.message}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-100'>
			<div className='container mx-auto px-4 py-8'>
				{/* Header Section */}
				<div className='text-center mb-12'>
					<h1 className='text-4xl md:text-5xl font-bold text-gray-800 mb-2'>
						Danh Mục Sản Phẩm
					</h1>
					<p className='text-lg text-gray-600 max-w-2xl mx-auto'>
						Khám phá đa dạng danh mục sản phẩm chất lượng với giá
						tốt nhất
					</p>
				</div>

				{/* Search Section */}
				<div className='max-w-md mx-auto mb-12'>
					<div
						className={`relative ${
							isFocused ? 'ring-2 ring-blue-500' : ''
						} rounded-lg`}>
						<FaSearch className='absolute left-3 top-[35px] transform -translate-y-1/2 text-gray-400 w-5 h-5 flex items-center justify-center' />
						<input
							type='text'
							placeholder='Tìm kiếm danh mục...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}
							className='w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-transparent shadow-sm text-gray-800'
						/>
					</div>
				</div>

				{/* Categories Grid */}
				<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6'>
					{filteredCategories.length > 0 ? (
						filteredCategories.map((category, index) => (
							<CategoryCard
								key={category.id}
								image={category.image}
								name={category.name}
								onClick={() => handleCategoryClick(category)}
							/>
						))
					) : (
						<div className='text-center py-16 col-span-full'>
							<div className='w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center'>
								<FaSearch className='w-12 h-12 text-gray-400' />
							</div>
							<h3 className='text-xl font-semibold text-gray-800 mb-2'>
								{searchTerm
									? 'Không tìm thấy danh mục phù hợp'
									: 'Không có danh mục nào'}
							</h3>
							<p className='text-gray-600'>
								{searchTerm
									? 'Thử tìm kiếm với từ khóa khác'
									: 'Vui lòng thử lại sau'}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default CategoryPage;
