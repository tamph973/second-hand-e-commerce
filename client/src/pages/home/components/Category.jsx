import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CategoryCard from '@/components/cards/CategoryCard';
import useAppQuery from '@/hooks/useAppQuery';
import CategoryService from '@/services/category.service';
import LoadingThreeDot from '@/components/common/LoadingThreeDot';

const Category = () => {
	const {
		data: categories = [],
		isLoading,
		error,
		refetch,
	} = useAppQuery(
		['categories', 'parent'],
		() => CategoryService.getAllCategory(),
		{
			select: (res) => res.data,
			refetchOnWindowFocus: false,
			staleTime: 5 * 60 * 1000, // 5 minutes
			cacheTime: 10 * 60 * 1000, // 10 minutes
			retry: 3,
			retryDelay: 1000,
		},
	);
	// Transform data only if categories exist
	const categoryData = React.useMemo(() => {
		if (!categories || categories.length === 0) return [];

		return categories.map((category, index) => ({
			key: category.id || category._id,
			path: `/${category.slug}`,
			name: category.name,
			image: category.image,
		}));
	}, [categories]);

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.1 },
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
	};

	// Loading state
	if (isLoading) {
		return (
			<div className='max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between mb-6 border-b pb-2'>
					<h2 className='text-2xl md:text-3xl font-bold text-gray-800'>
						Danh mục sản phẩm
					</h2>
					<Link
						to='/categories'
						className='text-red-500 hover:text-red-600 font-medium text-sm transition-colors'>
						Xem tất cả →
					</Link>
				</div>
				<div className='flex justify-center items-center py-12'>
					<LoadingThreeDot />
				</div>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className='max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between mb-6 border-b pb-2'>
					<h2 className='text-2xl md:text-3xl font-bold text-gray-800'>
						Danh mục sản phẩm
					</h2>
					<Link
						to='/categories'
						className='text-red-500 hover:text-red-600 font-medium text-sm transition-colors'>
						Xem tất cả →
					</Link>
				</div>
				<div className='text-center py-12'>
					<div className='w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center'>
						<svg
							className='w-8 h-8 text-red-500'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
							/>
						</svg>
					</div>
					<h3 className='text-lg font-semibold text-gray-800 mb-2'>
						Không thể tải danh mục
					</h3>
					<p className='text-gray-600 mb-4'>
						Đã xảy ra lỗi khi tải danh mục sản phẩm
					</p>
					<button
						onClick={() => refetch()}
						className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200'>
						Thử lại
					</button>
				</div>
			</div>
		);
	}

	// Empty state
	if (!categoryData || categoryData.length === 0) {
		return (
			<div className='max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between mb-6 border-b pb-2'>
					<h2 className='text-2xl md:text-3xl font-bold text-gray-800'>
						Danh mục sản phẩm
					</h2>
					<Link
						to='/categories'
						className='text-red-500 hover:text-red-600 font-medium text-sm transition-colors'>
						Xem tất cả →
					</Link>
				</div>
				<div className='text-center py-12'>
					<div className='w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
						<svg
							className='w-8 h-8 text-gray-400'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
							/>
						</svg>
					</div>
					<h3 className='text-lg font-semibold text-gray-800 mb-2'>
						Chưa có danh mục nào
					</h3>
					<p className='text-gray-600'>
						Hiện tại chưa có danh mục sản phẩm nào được tạo
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className='max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8'>
			<div className='flex items-center justify-between mb-6 border-b pb-2'>
				<h2 className='text-2xl md:text-3xl font-bold text-gray-800'>
					Danh mục sản phẩm
				</h2>
				<Link
					to='/categories'
					className='text-red-500 hover:text-red-600 font-medium text-sm transition-colors'>
					Xem tất cả →
				</Link>
			</div>

			<motion.div
				variants={containerVariants}
				initial='hidden'
				whileInView='visible'
				viewport={{ once: true }}
				className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3  mx-auto'>
				{categoryData.map((category) => (
					<motion.div variants={itemVariants} key={category.key}>
						<Link
							state={{
								parentId: category.key,
							}}
							to={category.path}
							className='hover:scale-105 transition-transform duration-200 flex justify-center items-center'>
							<CategoryCard
								name={category.name}
								image={category.image}
							/>
						</Link>
					</motion.div>
				))}
			</motion.div>
		</div>
	);
};

export default Category;
