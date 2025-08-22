/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from 'react';
import { Button, Tooltip } from 'flowbite-react';
import {
	HiClipboardList,
	HiEye,
	HiPencil,
	HiTrash,
	HiDocumentDownload,
	HiChevronLeft,
	HiChevronRight,
	HiRefresh,
	HiClock,
	HiCheckCircle,
	HiXCircle,
	HiEyeOff,
} from 'react-icons/hi';
import Table from '@/components/common/Table';
import FilterProducts from '@/admin/components/FilterProducts';
import ProductStatusBadge from '@/admin/components/ProductStatusBadge';
import ProductDetailModal from '@/admin/components/ProductDetailModal';
import ProductActionModal from '@/admin/components/ProductActionModal';
import useAppQuery from '@/hooks/useAppQuery';
import ProductService from '@/services/product.service';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';
import { formatPriceVND } from '@/utils/helpers';
import toast from 'react-hot-toast';

const ProductListApproved = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	// State cho filter và pagination
	const [keyword, setKeyword] = useState(searchParams.get('search') || '');
	const [status, setStatus] = useState(
		searchParams.get('status') || 'APPROVED',
	);
	const [category, setCategory] = useState(
		searchParams.get('category_id') || 'ALL',
	);
	const [sortBy, setSortBy] = useState(
		searchParams.get('sortBy') || 'createdAtDesc',
	);
	const [currentPage, setCurrentPage] = useState(
		parseInt(searchParams.get('page')) || 1,
	);
	const [itemsPerPage] = useState(10);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
	const [isActionModalOpen, setIsActionModalOpen] = useState(false);
	const [actionType, setActionType] = useState('approve');

	const debouncedKeyword = useDebounce(keyword, 500);

	// Tạo query params cho API
	const queryParams = useMemo(() => {
		const params = {
			page: currentPage,
			limit: itemsPerPage,
		};

		// Thêm các filter params nếu có
		if (debouncedKeyword) params.search = debouncedKeyword;
		if (status) params.status = status;
		if (category !== 'ALL') params.category_id = category;
		if (sortBy) params.sortBy = sortBy;

		return params;
	}, [currentPage, itemsPerPage, debouncedKeyword, status, category, sortBy]);

	// Fetch sản phẩm từ API với params
	const {
		data: productsData,
		isLoading,
		error,
		refetch,
	} = useAppQuery(
		['products-admin', queryParams], // Query key bao gồm params để refetch khi thay đổi
		() => ProductService.getAllProducts(queryParams),
		{
			select: (res) => res.data,
			refetchOnWindowFocus: false,
		},
	);

	const allProducts = productsData?.products || [];
	const pagination = productsData?.pagination || {};

	// Cập nhật URL params khi filter thay đổi
	useEffect(() => {
		const params = new URLSearchParams();
		if (keyword) params.set('search', keyword);
		if (status) params.set('status', status);
		if (category !== 'ALL') params.set('category_id', category);
		if (sortBy !== 'createdAtDesc') params.set('sortBy', sortBy);
		if (currentPage > 1) params.set('page', currentPage.toString());

		setSearchParams(params);
	}, [keyword, status, category, sortBy, currentPage, setSearchParams]);

	// Reset về trang 1 khi filter thay đổi (trừ khi thay đổi page)
	useEffect(() => {
		if (currentPage !== 1) {
			setCurrentPage(1);
		}
	}, [keyword, status, category, sortBy]);

	// Handle filter từ FilterProducts component
	const handleFilter = (filters) => {
		setKeyword(filters.search || '');
		setStatus(filters.status || 'APPROVED');
		setCategory(filters.category || 'ALL');
		setSortBy(filters.sortBy || 'createdAtDesc');
	};

	const handleReset = () => {
		setKeyword('');
		setStatus('APPROVED');
		setCategory('ALL');
		setSortBy('createdAtDesc');
		setCurrentPage(1);
	};

	// Handle pagination
	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
	};

	// Handle product actions
	const handleViewProduct = (product) => {
		setSelectedProduct(product);
		setIsDetailModalOpen(true);
	};

	const handleCloseDetailModal = () => {
		setIsDetailModalOpen(false);
		setSelectedProduct(null);
	};

	const handleActionModal = (product, type) => {
		setSelectedProduct(product);
		setActionType(type);
		setIsActionModalOpen(true);
	};

	const handleCloseActionModal = () => {
		setIsActionModalOpen(false);
		setSelectedProduct(null);
	};

	const handleProductAction = async (productId, actionType, reason = '') => {
		try {
			// Implement API call based on action type
			switch (actionType) {
				case 'APPROVED':
					await ProductService.updateProductVerifyStatus(
						productId,
						'APPROVED',
					);
					toast.success('Phê duyệt sản phẩm thành công');
					break;
				case 'REJECTED':
					await ProductService.updateProductVerifyStatus(
						productId,
						'REJECTED',
					);
					toast.error('Từ chối sản phẩm thành công');
					break;
				case 'ACTIVE': {
					const product = allProducts.find(
						(p) => p._id === productId,
					);
					const newStatus =
						product?.activeStatus === 'ACTIVE'
							? 'INACTIVE'
							: 'ACTIVE';
					await ProductService.updateProductStatus(
						productId,
						newStatus,
					);
					toast.success('Cập nhật trạng thái sản phẩm thành công');
					break;
				}
				default:
					break;
			}

			// Refetch data
			refetch();
		} catch (error) {
			console.error('Action failed:', error);
			throw error;
		}
	};

	const handleEditProduct = (product) => {
		console.log('Edit product:', product);
		// Implement edit logic
	};

	const handleDeleteProduct = (product) => {
		if (
			window.confirm(`Bạn có chắc muốn xóa sản phẩm "${product.title}"?`)
		) {
			console.log('Delete product:', product);
			// Implement delete logic
		}
	};

	const handleExport = () => {
		console.log('Export products');
		// Implement export logic
	};

	// Table headers
	const headers = [
		{ label: 'SL', key: 'sl' },
		{ label: 'TÊN SẢN PHẨM', key: 'name' },
		{ label: 'NGƯỜI BÁN', key: 'seller' },
		{ label: 'GIÁ', key: 'price' },
		{ label: 'TRẠNG THÁI DUYỆT', key: 'verifyStatus' },
		{ label: 'PHÊ DUYỆT', key: 'verifyAction' },
		{ label: 'HÀNH ĐỘNG', key: 'action' },
	];

	// Custom row renderer
	const renderRow = (product, index) => {
		const actualIndex = (currentPage - 1) * itemsPerPage + index + 1;
		const productStatus =
			product.verifyStatus || product.status || 'PENDING';

		return (
			<tr
				key={product._id || product.id}
				className='hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 border-b border-gray-100 group'>
				{/* Serial Number */}
				<td className='px-4 py-4 text-center'>
					<div className='flex items-center justify-center'>
						<span className='inline-flex items-center justify-center w-8 h-8  text-sm font-bold rounded-full shadow-sm text-textPrimary'>
							{actualIndex}
						</span>
					</div>
				</td>

				{/* Product Name */}
				<td className=''>
					<div className='flex items-start gap-2'>
						<div className='relative flex-shrink-0'>
							<img
								src={
									product.thumbnail?.url ||
									product.image ||
									'https://via.placeholder.com/60x60'
								}
								alt={product.title || product.name}
								className='w-10 h-10 rounded-xl object-cover border-2 border-gray-200 shadow-sm group-hover:border-blue-300 transition-all duration-300'
								onError={(e) => {
									e.target.src =
										'https://via.placeholder.com/60x60';
								}}
							/>
						</div>
						<div className='flex flex-col justify-center gap-1'>
							<Tooltip content={product.title || product.name}>
								<h4 className='text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-200 w-[150px]'>
									{product.title || product.name}
								</h4>
							</Tooltip>
							{product.type === 'MULTIPLE' && (
								<span className='bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium w-fit'>
									MULTIPLE
								</span>
							)}
						</div>
					</div>
				</td>

				{/* Seller */}
				<td>
					<div className='flex items-center space-x-3'>
						<div className=''>
							<div className='text-sm font-medium text-gray-900 truncate'>
								{product.userId?.fullName || 'N/A'}
							</div>
						</div>
					</div>
				</td>

				{/* Price */}
				<td className='px-4 py-4 '>
					<div className='space-y-1'>
						<div className='text-sm font-bold text-green-600'>
							{formatPriceVND(product.price)}
						</div>
					</div>
				</td>

				{/* Status */}
				<td className='px-4 py-4 text-center'>
					<div className='flex items-center justify-center'>
						<ProductStatusBadge status={productStatus} />
					</div>
				</td>

				{/* Verify Action */}
				<td className='px-4 py-4 '>
					<div className='flex items-center justify-center gap-2'>
						{productStatus === 'PENDING' && (
							<>
								<Tooltip content='Phê duyệt'>
									<Button
										size='sm'
										color='green'
										onClick={() =>
											handleActionModal(
												product,
												'APPROVED',
											)
										}
										className='p-2 border-0 shadow-sm transition-all duration-200 hover:scale-110 hover:shadow-md'>
										<HiCheckCircle className='w-4 h-4' />
									</Button>
								</Tooltip>
								<Tooltip content='Từ chối'>
									<Button
										size='sm'
										color='red'
										onClick={() =>
											handleActionModal(
												product,
												'REJECTED',
											)
										}
										className='p-2 border-0 shadow-sm transition-all duration-200 hover:scale-110 hover:shadow-md'>
										<HiXCircle className='w-4 h-4' />
									</Button>
								</Tooltip>
							</>
						)}
						{productStatus === 'REJECTED' && (
							<>
								<Tooltip content='Phê duyệt'>
									<Button
										size='sm'
										color='green'
										onClick={() =>
											handleActionModal(
												product,
												'APPROVED',
											)
										}>
										<HiCheckCircle className='w-4 h-4' />
									</Button>
								</Tooltip>
							</>
						)}
						{productStatus === 'APPROVED' && (
							<>
								<Tooltip content='Từ chối'>
									<Button
										size='sm'
										color='red'
										onClick={() =>
											handleActionModal(
												product,
												'REJECTED',
											)
										}>
										<HiXCircle className='w-4 h-4' />
									</Button>
								</Tooltip>
							</>
						)}
					</div>
				</td>

				{/* Actions */}
				<td className='px-4 py-4 text-center'>
					<div className='flex items-center justify-center space-x-1'>
						{/* View Details */}
						<Tooltip content='Xem chi tiết'>
							<Button
								size='sm'
								color='blue'
								onClick={() => handleViewProduct(product)}
								className='p-2 border-0 shadow-sm transition-all duration-200 hover:scale-110 hover:shadow-md'>
								<HiEye className='w-4 h-4' />
							</Button>
						</Tooltip>

						{/* Action buttons based on status */}

						{/* {productStatus === 'APPROVED' && (
							<Tooltip
								content={
									product.activeStatus === 'ACTIVE'
										? 'Tạm ngưng'
										: 'Kích hoạt'
								}>
								<Button
									size='sm'
									color={
										product.activeStatus === 'ACTIVE'
											? 'yellow'
											: 'green'
									}
									onClick={() =>
										handleActionModal(product, 'ACTIVE')
									}
									className='p-2 border-0 shadow-sm transition-all duration-200 hover:scale-110 hover:shadow-md'>
									{product.activeStatus === 'ACTIVE' ? (
										<HiEyeOff className='w-4 h-4' />
									) : (
										<HiEye className='w-4 h-4' />
									)}
								</Button>
							</Tooltip>
						)} */}

						{/* Edit */}
						<Tooltip content='Chỉnh sửa'>
							<Button
								size='sm'
								color='blue'
								onClick={() => handleEditProduct(product)}
								className='p-2 border-0 shadow-sm transition-all duration-200 hover:scale-110 hover:shadow-md'>
								<HiPencil className='w-4 h-4' />
							</Button>
						</Tooltip>

						{/* Delete */}
						<Tooltip content='Xóa sản phẩm'>
							<Button
								size='sm'
								color='red'
								onClick={() => handleDeleteProduct(product)}
								className='p-2 border-0 shadow-sm transition-all duration-200 hover:scale-110 hover:shadow-md'>
								<HiTrash className='w-4 h-4' />
							</Button>
						</Tooltip>
					</div>
				</td>
			</tr>
		);
	};

	// Status tabs data
	const statusTabs = [
		{ value: 'ALL', label: 'Tất cả', icon: HiClipboardList },
		{ value: 'PENDING', label: 'Chờ duyệt', icon: HiClock },
		{ value: 'APPROVED', label: 'Đã duyệt', icon: HiCheckCircle },
		{ value: 'REJECTED', label: 'Từ chối', icon: HiXCircle },
	];

	return (
		<div className='min-h-screen bg-gray-50 p-6'>
			{/* Section 1: Header and Stats */}
			<div className='mb-8'>
				{/* Header */}
				<div className='flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0'>
					<div className='flex items-center space-x-3'>
						<div className='flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm'>
							<HiClipboardList className='w-6 h-6 text-blue-600' />
							<h1 className='text-2xl font-bold text-gray-800'>
								Quản lý sản phẩm
							</h1>
						</div>
						<div className='flex items-center space-x-2'>
							<span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800'>
								{pagination.total} sản phẩm
							</span>
						</div>
					</div>
					<div className='flex items-center space-x-3'>
						<Button
							color='gray'
							onClick={handleReset}
							className='transition-all duration-200 hover:scale-105'>
							<HiRefresh className='w-4 h-4 mr-2' />
							Làm mới
						</Button>
						{/* <Button
							color='blue'
							onClick={handleExport}
							className='transition-all duration-200 hover:scale-105'>
							<HiDocumentDownload className='w-4 h-4 mr-2' />
							Xuất dữ liệu
						</Button> */}
					</div>
				</div>

				{/* Status Tabs */}

				{/* <div className='bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6'>
					<div className='flex flex-wrap gap-2'>
						{statusTabs.map((tab) => {
							const IconComponent = tab.icon;
							const isActive = status === tab.value;
							return (
								<button
									key={tab.value}
									onClick={() => setStatus(tab.value)}
									style={{
										background: isActive
											? 'linear-gradient(to right, #007bff, #00bfff)'
											: 'linear-gradient(to right, #e0e0e0, #f0f0f0)',
									}}
									className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
										isActive
											? 'text-white shadow-md transform scale-105'
											: 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
									}`}>
									<IconComponent
										className={`w-4 h-4 ${
											isActive
												? 'text-white'
												: 'text-gray-500'
										}`}
									/>
									<span>{tab.label}</span>
								</button>
							);
						})}
					</div>
				</div> */}
			</div>

			{/* Section 2: Filter Component */}
			<FilterProducts
				onFilter={handleFilter}
				onReset={handleReset}
				loading={isLoading}
			/>

			{/* Section 3: Product Table */}
			<div className='bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden'>
				{/* Table Header */}
				<div className='bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center space-x-3'>
							<div
								className='w-8 h-8  rounded-lg flex items-center justify-center'
								style={{
									background:
										'linear-gradient(to right, #007bff, #00bfff)',
								}}>
								<HiClipboardList className='w-5 h-5 text-white' />
							</div>
							<div>
								<h3 className='text-lg font-semibold text-gray-900'>
									Danh sách sản phẩm
								</h3>
								<p className='text-sm text-gray-600'>
									Quản lý và kiểm duyệt sản phẩm từ người bán
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Table */}
				<div className='overflow-x-auto max-w-6xl'>
					<Table
						headers={headers}
						data={allProducts}
						renderRow={renderRow}
						loading={isLoading}
						emptyText={
							<div className='text-center py-12'>
								<div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
									<HiClipboardList className='w-8 h-8 text-gray-400' />
								</div>
								<h3 className='text-lg font-medium text-gray-900 mb-2'>
									Không có sản phẩm nào
								</h3>
								<p className='text-gray-500'>
									Không tìm thấy sản phẩm phù hợp với bộ lọc
									hiện tại
								</p>
							</div>
						}
					/>
				</div>

				{/* Pagination */}
				{pagination.totalPages > 1 && (
					<div className='bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200'>
						<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0'>
							<div className='text-sm text-gray-700'>
								Hiển thị {(currentPage - 1) * itemsPerPage + 1}{' '}
								đến{' '}
								{Math.min(
									currentPage * itemsPerPage,
									pagination.total || 0,
								)}{' '}
								của{' '}
								<span className='font-semibold text-gray-900'>
									{pagination.total || 0}
								</span>{' '}
								kết quả
							</div>
							<div className='flex items-center justify-center sm:justify-end space-x-2'>
								<Button
									size='sm'
									color='gray'
									onClick={() =>
										handlePageChange(currentPage - 1)
									}
									disabled={currentPage === 1}
									className='px-3 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'>
									<HiChevronLeft className='w-4 h-4 mr-1' />
									<span className='hidden sm:inline'>
										Trước
									</span>
								</Button>

								<div className='flex items-center space-x-1'>
									{/* Logic hiển thị số trang thông minh */}
									{(() => {
										const pages = [];
										const maxVisiblePages = 5;
										const totalPages =
											pagination.totalPages || 1;

										if (totalPages <= maxVisiblePages) {
											// Hiển thị tất cả trang nếu ít hơn hoặc bằng 5
											for (
												let i = 1;
												i <= totalPages;
												i++
											) {
												pages.push(i);
											}
										} else {
											// Logic hiển thị trang thông minh
											if (currentPage <= 3) {
												// Trang đầu: hiển thị 1, 2, 3, 4, 5, ..., totalPages
												for (let i = 1; i <= 5; i++) {
													pages.push(i);
												}
												if (totalPages > 5) {
													pages.push('...');
													pages.push(totalPages);
												}
											} else if (
												currentPage >=
												totalPages - 2
											) {
												// Trang cuối: hiển thị 1, ..., totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages
												pages.push(1);
												pages.push('...');
												for (
													let i = totalPages - 4;
													i <= totalPages;
													i++
												) {
													pages.push(i);
												}
											} else {
												// Trang giữa: hiển thị 1, ..., currentPage-1, currentPage, currentPage+1, ..., totalPages
												pages.push(1);
												pages.push('...');
												for (
													let i = currentPage - 1;
													i <= currentPage + 1;
													i++
												) {
													pages.push(i);
												}
												pages.push('...');
												pages.push(totalPages);
											}
										}

										return pages.map((page, index) =>
											page === '...' ? (
												<span
													key={`ellipsis-${index}`}
													className='px-2 text-gray-500'>
													...
												</span>
											) : (
												<Button
													key={page}
													size='sm'
													color={
														currentPage === page
															? 'blue'
															: 'gray'
													}
													onClick={() =>
														handlePageChange(page)
													}
													className={`px-3 py-2 transition-all duration-200 ${
														currentPage === page
															? 'bg-blue-600 text-white hover:bg-blue-700'
															: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
													}`}>
													{page}
												</Button>
											),
										);
									})()}
								</div>

								<Button
									size='sm'
									color='gray'
									onClick={() =>
										handlePageChange(currentPage + 1)
									}
									disabled={
										currentPage ===
										(pagination.totalPages || 1)
									}
									className='px-3 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'>
									<span className='hidden sm:inline'>
										Sau
									</span>
									<HiChevronRight className='w-4 h-4 ml-1' />
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Product Detail Modal */}
			<ProductDetailModal
				product={selectedProduct}
				isOpen={isDetailModalOpen}
				onClose={handleCloseDetailModal}
			/>

			{/* Product Action Modal */}
			<ProductActionModal
				product={selectedProduct}
				isOpen={isActionModalOpen}
				onClose={handleCloseActionModal}
				onAction={handleProductAction}
				actionType={actionType}
			/>
		</div>
	);
};

export default ProductListApproved;
