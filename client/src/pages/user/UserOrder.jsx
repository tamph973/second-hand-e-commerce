import { useEffect, useState, useMemo } from 'react';
import LoadingThreeDot from '@/components/common/LoadingThreeDot';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders } from '@/store/order/orderSlice';
import OrderStatusTabs from './components/order/OrderStatusTabs';
import OrderFilter from './components/order/OrderFilter';
import OrderCard from './components/order/OrderCard';
import { useDebounce } from '@/hooks/useDebounce';
import { useNavigate } from 'react-router-dom';

// Hàm chuẩn hóa text để tìm kiếm (loại bỏ dấu, chuyển về chữ thường)
const normalizeText = (text) => {
	if (!text) return '';
	return text
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
		.replace(/[đĐ]/g, 'd') // Thay đ/Đ thành d
		.replace(/[^a-z0-9\s]/g, ' ') // Chỉ giữ chữ cái, số và khoảng trắng
		.replace(/\s+/g, ' ') // Gộp nhiều khoảng trắng thành 1
		.trim();
};

// Hàm kiểm tra text có chứa keyword hay không (hỗ trợ nhiều dạng)
const containsKeyword = (text, keyword) => {
	if (!text || !keyword) return false;

	const normalizedText = normalizeText(text);
	const normalizedKeyword = normalizeText(keyword);

	// Tìm kiếm chính xác
	if (normalizedText.includes(normalizedKeyword)) return true;

	// Tìm kiếm từng từ trong keyword
	const keywordWords = normalizedKeyword
		.split(' ')
		.filter((word) => word.length > 0);
	return keywordWords.every((word) => normalizedText.includes(word));
};

export default function UserOrder() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const {
		orders = [],
		isLoading,
		isError,
	} = useSelector((state) => state.order);

	// UI state
	const [tab, setTab] = useState('ALL');
	const [keyword, setKeyword] = useState('');
	const [date, setDate] = useState('');
	const [sort, setSort] = useState('createdAt-desc');
	const debouncedKeyword = useDebounce(keyword, 500);

	useEffect(() => {
		dispatch(getAllOrders());
		window.scrollTo(0, 0);
	}, [dispatch]);

	// Đếm số lượng đơn theo trạng thái
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

		// Lọc theo tab
		if (tab !== 'ALL') result = result.filter((o) => o.status === tab);

		// Lọc theo keyword (cải thiện)
		if (debouncedKeyword) {
			result = result.filter((o) => {
				// Tìm trong title của sản phẩm
				const productMatch = o.items?.some((p) =>
					containsKeyword(p.title, debouncedKeyword),
				);

				// Tìm trong mã đơn hàng
				const orderCodeMatch = containsKeyword(
					o.code || o.orderId,
					keyword,
				);

				// Tìm trong tên người bán
				const sellerMatch = containsKeyword(
					o.sellerInfo?.fullName,
					keyword,
				);

				return productMatch || orderCodeMatch || sellerMatch;
			});
		}

		// Lọc theo ngày
		if (date) {
			result = result.filter((o) => {
				const orderDate = new Date(o.createdAt);
				const orderDateString = orderDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
				return orderDateString === date;
			});
		}

		// Sắp xếp
		if (sort === 'createdAt-desc') {
			result.sort(
				(a, b) => new Date(b.createdAt) - new Date(a.createdAt),
			);
		} else if (sort === 'createdAt-asc') {
			result.sort(
				(a, b) => new Date(a.createdAt) - new Date(b.createdAt),
			);
		} else if (sort === 'total-desc') {
			result.sort((a, b) => (b.subTotal || 0) - (a.subTotal || 0));
		} else if (sort === 'total-asc') {
			result.sort((a, b) => (a.subTotal || 0) - (b.subTotal || 0));
		}

		return result;
	}, [orders, tab, keyword, debouncedKeyword, date, sort]);

	const handleDetail = (order) => {
		navigate(`/user/purchases/${order.orderId}`);
	};

	return (
		<div className='bg-gray-50 min-h-screen rounded-2xl shadow-lg p-4 md:p-8'>
			<div className='max-w-6xl mx-auto'>
				<h2 className='text-3xl text-primary font-bold mb-6'>
					Đơn mua của tôi
				</h2>
				<OrderStatusTabs
					value={tab}
					onChange={setTab}
					counters={counters}
				/>
				<OrderFilter
					keyword={keyword}
					onKeywordChange={setKeyword}
					date={date}
					onDateChange={setDate}
					sort={sort}
					onSortChange={setSort}
				/>
				<div className='min-h-[200px]'>
					{isLoading ? (
						<LoadingThreeDot className='my-10' />
					) : isError ? (
						<div className='text-red-500 text-center py-8'>
							Không thể tải đơn hàng.
						</div>
					) : filteredOrders.length === 0 ? (
						<div className='text-gray-400 text-center py-8'>
							Không có đơn hàng nào phù hợp.
						</div>
					) : (
						// Render mỗi đơn hàng là 1 card
						filteredOrders.map((order) => (
							<OrderCard
								key={order.orderId}
								order={order}
								onDetail={handleDetail}
							/>
						))
					)}
				</div>
			</div>
		</div>
	);
}
