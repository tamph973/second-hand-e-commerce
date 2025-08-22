import { useEffect, useMemo, useState } from 'react';
import { orderStatuses } from '@/seller/constants/menuItems';
import Table from '@/components/common/Table';
import { TableCell, TableRow } from 'flowbite-react';
import { getAllOrders } from '@/store/order/orderSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ORDER_STATUS_OPTIONS } from '@/constants/productOptions';
import { formatPriceVND, getOrderStatusLabel } from '@/utils/helpers';
import { FaEye, FaSearch, FaFilter, FaSort } from 'react-icons/fa';
import Button from '@/components/common/Button';
import { Link, useNavigate } from 'react-router-dom';
import convertDate from '@/utils/convertDate';
import { useDebounce } from '@/hooks/useDebounce';

const headers = [
	{
		label: 'Mã đơn hàng',
		key: 'id',
	},
	{
		label: 'Ngày đặt hàng',
		key: 'date',
	},
	{
		label: 'Khách hàng',
		key: 'customer',
	},
	{
		label: 'Tổng tiền',
		key: 'total',
	},
	{
		label: 'Trạng thái',
		key: 'status',
	},
	{
		label: 'Hành động',
		key: 'action',
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

const Orders = () => {
	const [selectedStatus, setSelectedStatus] = useState('ALL');
	const [keyword, setKeyword] = useState('');
	const [sortBy, setSortBy] = useState('createdAt-desc');
	const { orders } = useSelector((state) => state.order);
	const navigate = useNavigate();

	const debouncedKeyword = useDebounce(keyword, 500);

	const shortOrderId = (id) => (id ? `#${id.slice(0, 8)}` : '');

	const getStatusColor = (status) => {
		const colors = {
			PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
			CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
			PROCESSING: 'bg-purple-100 text-purple-800 border-purple-200',
			SHIPPING: 'bg-orange-100 text-orange-800 border-orange-200',
			REVIEW: 'bg-indigo-100 text-indigo-800 border-indigo-200',
			COMPLAINT: 'bg-red-100 text-red-800 border-red-200',
			CANCELLED: 'bg-gray-100 text-gray-800 border-gray-200',
			DELIVERED: 'bg-green-100 text-green-800 border-green-200',
			COMPLETED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
		};
		return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
	};

	// Đếm số lượng đơn hàng theo trạng thái
	const counters = useMemo(() => {
		const count = { ALL: orders.length };
		orders.forEach((o) => {
			count[o.status] = (count[o.status] || 0) + 1;
		});
		return count;
	}, [orders]);

	// Lọc và sắp xếp đơn hàng
	const filteredOrders = useMemo(() => {
		let result = [...orders];

		// Lọc theo trạng thái
		if (selectedStatus !== 'ALL') {
			result = result.filter((o) => o.status === selectedStatus);
		}

		// Lọc theo keyword
		if (debouncedKeyword) {
			result = result.filter((o) => {
				// Tìm trong mã đơn hàng
				const orderCodeMatch = containsKeyword(
					o.orderId || o.code,
					debouncedKeyword,
				);

				// Tìm trong tên khách hàng
				const customerMatch = containsKeyword(
					o.buyerInfo?.fullName,
					debouncedKeyword,
				);

				// Tìm trong tên sản phẩm
				const productMatch = o.items?.some((p) =>
					containsKeyword(p.title, debouncedKeyword),
				);

				return orderCodeMatch || customerMatch || productMatch;
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
		} else if (sortBy === 'total-desc') {
			result.sort((a, b) => (b.subTotal || 0) - (a.subTotal || 0));
		} else if (sortBy === 'total-asc') {
			result.sort((a, b) => (a.subTotal || 0) - (b.subTotal || 0));
		}

		return result;
	}, [orders, selectedStatus, debouncedKeyword, sortBy]);

	return (
		<div className='space-y-6'>
			{/* Page Header */}
			<div className='flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl shadow-sm border border-blue-100'>
				<div>
					<h1 className='text-2xl font-bold text-gray-900 mb-1'>
						Quản lý đơn hàng
					</h1>
					<p className='text-gray-600 text-base'>
						Theo dõi và quản lý tất cả đơn hàng của bạn
					</p>
				</div>
				<div className='flex items-center space-x-4'>
					<div className='bg-white rounded-lg p-3 shadow-sm border border-gray-200'>
						<div className='text-xl font-bold text-blue-600'>
							{orders.length}
						</div>
						<div className='text-xs text-gray-500'>
							Tổng đơn hàng
						</div>
					</div>
				</div>
			</div>

			{/* Search and Filter Section */}
			<div className='bg-white rounded-xl shadow-sm border border-gray-200 p-5'>
				<div className='flex flex-col lg:flex-row gap-4 items-center justify-between'>
					{/* Search Bar */}
					<div className='flex-1 relative max-w-md'>
						<input
							type='text'
							placeholder='Tìm kiếm theo mã đơn hàng, khách hàng...'
							value={keyword}
							onChange={(e) => setKeyword(e.target.value)}
							className='w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 text-gray-700 placeholder-gray-500'
						/>
						<FaSearch className='absolute left-3 top-[28px] transform -translate-y-1/2 text-gray-400 text-sm pointer-events-none' />
					</div>

					{/* Sort Options */}
					<div className='flex items-center gap-3'>
						<FaSort className='text-gray-400 text-sm' />
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							className='px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 text-gray-700 bg-white pr-10'>
							<option value='createdAt-desc'>Mới nhất</option>
							<option value='createdAt-asc'>Cũ nhất</option>
							<option value='total-desc'>Giá cao nhất</option>
							<option value='total-asc'>Giá thấp nhất</option>
						</select>
					</div>
				</div>
			</div>

			{/* Status Filters */}
			<div className='bg-white rounded-xl shadow-sm border border-gray-200 p-5'>
				<h2 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
					<FaFilter className='mr-2 text-blue-500 text-sm' />
					Trạng thái đơn hàng
				</h2>
				<div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-3'>
					{ORDER_STATUS_OPTIONS.map((status) => (
						<button
							key={status.value}
							onClick={() => setSelectedStatus(status.value)}
							className={`group relative p-3 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-md ${
								selectedStatus === status.value
									? 'border-blue-500 bg-blue-50 shadow-md scale-105'
									: 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-25'
							}`}>
							{/* Hover effect overlay */}
							<div className='absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

							<div className='relative text-center'>
								<p className='text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors duration-200'>
									{counters[status.value] || 0}
								</p>
								<p className='text-xs text-gray-600 group-hover:text-gray-800 transition-colors duration-200 leading-tight'>
									{status.label}
								</p>
							</div>

							{/* Active indicator */}
							{selectedStatus === status.value && (
								<div className='absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center'>
									<div className='w-1.5 h-1.5 bg-white rounded-full' />
								</div>
							)}
						</button>
					))}
				</div>
			</div>

			{/* Orders Table */}
			<div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
				<div className='p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100'>
					<h2 className='text-lg font-semibold text-gray-800 flex items-center'>
						Danh sách đơn hàng
						<span className='ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full'>
							{filteredOrders.length} đơn hàng
						</span>
					</h2>
				</div>

				{filteredOrders.length === 0 ? (
					<div className='p-8 text-center'>
						<div className='text-gray-400 text-4xl mb-3'>📦</div>
						<h3 className='text-lg font-medium text-gray-600 mb-2'>
							Không có đơn hàng nào
						</h3>
						<p className='text-sm text-gray-500'>
							{keyword || selectedStatus !== 'ALL'
								? 'Thử thay đổi bộ lọc để xem thêm đơn hàng'
								: 'Chưa có đơn hàng nào được tạo'}
						</p>
					</div>
				) : (
					<div className='overflow-x-auto'>
						<Table
							emptyText='Không có dữ liệu đơn hàng'
							headers={headers}
							data={filteredOrders}
							renderRow={(item) => (
								<TableRow
									key={item.id}
									className='hover:!bg-blue-50 transition-all duration-200 border-b border-gray-100 group cursor-pointer'>
									<TableCell
										className='font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 text-sm'
										onClick={() =>
											navigate(
												`/seller/orders/${item.orderId}`,
											)
										}>
										{shortOrderId(item.orderId)}
									</TableCell>
									<TableCell className='text-gray-600 text-sm'>
										{convertDate(item.createdAt)}
									</TableCell>
									<TableCell className='font-medium text-gray-800 text-sm'>
										{item.buyerInfo.fullName}
									</TableCell>
									<TableCell className='font-semibold text-green-600 text-sm'>
										{formatPriceVND(item.totalAmount) ||
											formatPriceVND(
												item.subTotal +
													item.shippingFee,
											)}
									</TableCell>
									<TableCell>
										<span
											className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
												item.status,
											)}`}>
											{getOrderStatusLabel(item.status)}
										</span>
									</TableCell>
									<TableCell>
										<div className='flex items-center gap-2'>
											<Button
												title='Xem chi tiết đơn hàng'
												className='bg-blue-500 hover:bg-blue-600 text-white transform hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md p-2'
												onClick={() =>
													navigate(
														`/seller/orders/${item.orderId}`,
													)
												}>
												<FaEye className='w-3 h-3' />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							)}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default Orders;
