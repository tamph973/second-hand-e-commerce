import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { productCategories } from '@/seller/constants/menuItems';
import useAppQuery from '@/hooks/useAppQuery';
import { getAuthLocalStorage } from '@/utils/localStorageUtils';
import ProductService from '@/services/product.service';
import { formatDate, formatPriceVND } from '@/utils/helpers';
import { Tooltip } from 'flowbite-react';
import {
	FaSearch,
	FaFilter,
	FaSort,
	FaEdit,
	FaTrash,
	FaPlus,
} from 'react-icons/fa';
import Table from '@/components/common/Table';
import { TableCell, TableRow } from 'flowbite-react';
import { useDebounce } from '@/hooks/useDebounce';

const headers = [
	{
		label: 'Sản phẩm',
		key: 'product',
	},
	{
		label: 'Giá',
		key: 'price',
	},
	{
		label: 'Tồn kho',
		key: 'stock',
	},
	{
		label: 'Trạng thái hoạt động',
		key: 'activeStatus',
	},
	{
		label: 'Trạng thái duyệt',
		key: 'verifyStatus',
	},
	{
		label: 'Ngày tạo',
		key: 'createdAt',
	},
	{
		label: 'Thao tác',
		key: 'actions',
	},
];

// Hàm chuẩn hóa text để tìm kiếm
const normalizeText = (text) => {
	if (!text) return '';
	return text
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[đĐ]/g, 'd')
		.replace(/[^a-z0-9\s]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
};

// Hàm kiểm tra text có chứa keyword hay không
const containsKeyword = (text, keyword) => {
	if (!text || !keyword) return false;

	const normalizedText = normalizeText(text);
	const normalizedKeyword = normalizeText(keyword);

	if (normalizedText.includes(normalizedKeyword)) return true;

	const keywordWords = normalizedKeyword
		.split(' ')
		.filter((word) => word.length > 0);
	return keywordWords.every((word) => normalizedText.includes(word));
};

const Products = () => {
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [sortBy, setSortBy] = useState('createdAt-desc');

	const { userId: shopId } = getAuthLocalStorage();
	const {
		data: products,
		isLoading,
		error,
		refetch,
	} = useAppQuery(
		['products', shopId],
		() =>
			ProductService.getProductsBySeller(shopId, {
				page: 1,
				limit: 10,
			}),
		{
			select: (res) => res.data,
			enabled: !!shopId,
			staleTime: 5 * 60 * 1000, // 5 phút
			cacheTime: 10 * 60 * 1000, // 10 phút
		},
	);

	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	const getStatusColor = (status) => {
		const colors = {
			ACTIVE: 'bg-green-100 text-green-800 border-green-200',
			INACTIVE: 'bg-gray-100 text-gray-800 border-gray-200',
			PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
			REJECTED: 'bg-red-100 text-red-800 border-red-200',
			APPROVED: 'bg-blue-100 text-blue-800 border-blue-200',
		};
		return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
	};

	const getStatusLabel = (status) => {
		const labels = {
			APPROVED: 'Đã duyệt',
			REJECTED: 'Từ chối',
			INACTIVE: 'Tạm ngưng',
			ACTIVE: 'Đang bán',
			PENDING: 'Đang chờ duyệt',
		};
		return labels[status] || 'Không xác định';
	};

	const getStockColor = (stock) => {
		if (stock === 0) return 'text-red-600 font-semibold';
		if (stock <= 10) return 'text-yellow-600 font-semibold';
		return 'text-green-600 font-semibold';
	};

	// Đếm số lượng sản phẩm theo danh mục
	const categoryCounts = useMemo(() => {
		if (!products?.products) return {};

		const counts = { all: products.products.length };
		products.products.forEach((product) => {
			const category = product.categoryId?.name || 'other';
			counts[category] = (counts[category] || 0) + 1;
		});
		return counts;
	}, [products]);

	// Lọc và sắp xếp sản phẩm
	const filteredProducts = useMemo(() => {
		if (!products?.products) return [];

		let result = [...products.products];

		// Lọc theo danh mục
		if (selectedCategory !== 'all') {
			result = result.filter(
				(product) => product.categoryId?.name === selectedCategory,
			);
		}

		// Lọc theo trạng thái
		if (statusFilter !== 'all') {
			result = result.filter(
				(product) =>
					product.activeStatus === statusFilter ||
					product.verifyStatus === statusFilter,
			);
		}

		// Lọc theo keyword
		if (debouncedSearchTerm) {
			result = result.filter((product) => {
				// Tìm trong tên sản phẩm
				const titleMatch = containsKeyword(
					product.title,
					debouncedSearchTerm,
				);

				// Tìm trong danh mục
				const categoryMatch = containsKeyword(
					product.categoryId?.name,
					debouncedSearchTerm,
				);

				// Tìm trong ID sản phẩm
				const idMatch = containsKeyword(
					product._id,
					debouncedSearchTerm,
				);

				return titleMatch || categoryMatch || idMatch;
			});
		}

		// Sắp xếp
		if (sortBy === 'createdAt-desc') {
			result.sort(
				(a, b) => new Date(b.createdAt) - new Date(a.createdAt),
			);
		} else if (sortBy === 'createdAt-asc') {
			result.sort(
				(a, b) => new Date(a.createdAt) - new Date(b.createdAt),
			);
		} else if (sortBy === 'price-desc') {
			result.sort((a, b) => (b.price || 0) - (a.price || 0));
		} else if (sortBy === 'price-asc') {
			result.sort((a, b) => (a.price || 0) - (b.price || 0));
		} else if (sortBy === 'stock-desc') {
			result.sort((a, b) => (b.stock || 0) - (a.stock || 0));
		} else if (sortBy === 'stock-asc') {
			result.sort((a, b) => (a.stock || 0) - (b.stock || 0));
		}

		return result;
	}, [products, selectedCategory, statusFilter, debouncedSearchTerm, sortBy]);

	return (
		<div className='space-y-6'>
			{/* Page Header */}
			<div className='flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl shadow-sm border border-green-100'>
				<div>
					<h1 className='text-2xl font-bold text-gray-900 mb-1'>
						Quản lý sản phẩm
					</h1>
					<p className='text-gray-600 text-base'>
						Quản lý danh sách sản phẩm của bạn
					</p>
				</div>
				<div className='flex items-center space-x-4'>
					<div className='bg-white rounded-lg p-3 shadow-sm border border-gray-200'>
						<div className='text-xl font-bold text-green-600'>
							{products?.products?.length || 0}
						</div>
						<div className='text-xs text-gray-500'>
							Tổng sản phẩm
						</div>
					</div>
					<Link
						to='/seller/products/create'
						className='bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md'>
						<FaPlus className='w-4 h-4' />
						Thêm sản phẩm
					</Link>
				</div>
			</div>

			{/* Search and Filter Section */}
			<div className='bg-white rounded-xl shadow-sm border border-gray-200 p-5'>
				<div className='flex flex-col lg:flex-row gap-4 items-center justify-between'>
					{/* Search Bar */}
					<div className='flex-1 relative max-w-md'>
						<input
							type='text'
							placeholder='Tìm kiếm sản phẩm...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className='w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 text-gray-700 placeholder-gray-500'
						/>
						<FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm pointer-events-none' />
					</div>

					{/* Filters */}
					<div className='flex items-center gap-3'>
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							className='px-3 py-2 w-40 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 text-gray-700 bg-white'>
							<option value='all'>Tất cả trạng thái</option>
							<option value='ACTIVE'>Đang bán</option>
							<option value='INACTIVE'>Tạm ngưng</option>
							<option value='PENDING'>Đang chờ duyệt</option>
							<option value='APPROVED'>Đã duyệt</option>
							<option value='REJECTED'>Từ chối</option>
						</select>

						<FaSort className='text-gray-400 text-sm' />
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							className='px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 text-gray-700 bg-white'>
							<option value='createdAt-desc'>Mới nhất</option>
							<option value='createdAt-asc'>Cũ nhất</option>
							<option value='price-desc'>Giá cao nhất</option>
							<option value='price-asc'>Giá thấp nhất</option>
							<option value='stock-desc'>Tồn kho cao nhất</option>
							<option value='stock-asc'>Tồn kho thấp nhất</option>
						</select>
					</div>
				</div>
			</div>

			{/* Category Stats */}
			<div className='bg-white rounded-xl shadow-sm border border-gray-200 p-5'>
				<h2 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
					<FaFilter className='mr-2 text-green-500 text-sm' />
					Thống kê theo danh mục
				</h2>
				<div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3'>
					{productCategories.map((category) => (
						<button
							key={category.key}
							onClick={() => setSelectedCategory(category.key)}
							className={`group relative p-3 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-md ${
								selectedCategory === category.key
									? 'border-green-500 bg-green-50 shadow-md scale-105'
									: 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-25'
							}`}>
							{/* Hover effect overlay */}
							<div className='absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

							<div className='relative text-center'>
								<p className='text-xl font-bold text-gray-800 mb-1 group-hover:text-green-600 transition-colors duration-200'>
									{categoryCounts[category.key] || 0}
								</p>
								<p className='text-xs text-gray-600 group-hover:text-gray-800 transition-colors duration-200 leading-tight'>
									{category.label}
								</p>
							</div>

							{/* Active indicator */}
							{selectedCategory === category.key && (
								<div className='absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center'>
									<div className='w-1.5 h-1.5 bg-white rounded-full' />
								</div>
							)}
						</button>
					))}
				</div>
			</div>

			{/* Products Table */}
			<div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
				<div className='p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100'>
					<h2 className='text-lg font-semibold text-gray-800 flex items-center'>
						Danh sách sản phẩm
						<span className='ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full'>
							{filteredProducts.length} sản phẩm
						</span>
					</h2>
				</div>

				{filteredProducts.length === 0 ? (
					<div className='p-8 text-center'>
						<div className='text-gray-400 text-4xl mb-3'>📦</div>
						<h3 className='text-lg font-medium text-gray-600 mb-2'>
							Không có sản phẩm nào
						</h3>
						<p className='text-sm text-gray-500'>
							{searchTerm ||
							selectedCategory !== 'all' ||
							statusFilter !== 'all'
								? 'Thử thay đổi bộ lọc để xem thêm sản phẩm'
								: 'Chưa có sản phẩm nào được tạo'}
						</p>
					</div>
				) : (
					<div className='overflow-x-auto'>
						<div className='min-w-[1000px] w-full'>
							<Table
								emptyText='Không có dữ liệu sản phẩm'
								headers={headers}
								data={filteredProducts}
								loading={isLoading}
								renderRow={(product) => (
									<TableRow
										key={product._id}
										className='hover:!bg-green-50 transition-all duration-200 border-b border-gray-100 group cursor-pointer'>
										<TableCell className='font-medium text-gray-900 group-hover:text-green-600 transition-colors duration-200 w-[300px]'>
											<div className='flex items-center'>
												<img
													className='h-10 w-10 rounded-lg object-cover border border-gray-200'
													src={
														product.thumbnail
															?.url ||
														'https://via.placeholder.com/80x80'
													}
													alt={product.title}
												/>
												<div className='ml-3'>
													<div className='text-sm font-medium line-clamp-1 max-w-[200px]'>
														<Tooltip content={product.title}>
															{product.title}
														</Tooltip>
													</div>
													<div className='text-xs text-gray-500'>
														ID:{' '}
														{product._id.slice(-6)}
													</div>
												</div>
											</div>
										</TableCell>
										{/* <TableCell className='text-gray-600 text-sm'>
											{product.categoryId?.name ||
												'Không xác định'}
										</TableCell> */}
										<TableCell className='font-semibold text-green-600 text-sm'>
											{formatPriceVND(product.price)}
										</TableCell>
										<TableCell>
											<span
												className={`text-sm ${getStockColor(
													product.stock,
												)}`}>
												{product.stock}
											</span>
										</TableCell>
										<TableCell>
											<span
												className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
													product.activeStatus,
												)}`}>
												{getStatusLabel(
													product.activeStatus,
												)}
											</span>
										</TableCell>
										<TableCell>
											<span
												className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
													product.verifyStatus,
												)}`}>
												{getStatusLabel(
													product.verifyStatus,
												)}
											</span>
										</TableCell>
										<TableCell className='text-gray-600 text-sm'>
											{formatDate(product.createdAt)}
										</TableCell>
										<TableCell>
											<div className='flex items-center gap-2'>
												<button
													title='Chỉnh sửa sản phẩm'
													className='text-blue-600 hover:text-blue-800 p-1 rounded transition-colors duration-200'>
													<FaEdit className='w-4 h-4' />
												</button>
												<button
													title='Xóa sản phẩm'
													className='text-red-600 hover:text-red-800 p-1 rounded transition-colors duration-200'>
													<FaTrash className='w-4 h-4' />
												</button>
											</div>
										</TableCell>
									</TableRow>
								)}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Products;
