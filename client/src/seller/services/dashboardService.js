import axiosConfig from '@/configs/axiosConfig';

// Lấy thống kê tổng quan
export const getDashboardStats = async () => {
	try {
		const response = await axiosConfig.get(`/sellers/dashboard/stats`, {
			withCredentials: true,
		});
		return response.data.data;
	} catch (error) {
		console.error('Error fetching dashboard stats:', error);
		// Trả về dữ liệu mẫu nếu API chưa sẵn sàng
		return {
			totalRevenue: 71673736,
			totalOrders: 151,
			totalUsers: 43,
			lowStockProducts: 4,
		};
	}
};

// Lấy thống kê đơn hàng theo trạng thái
export const getOrderStats = async () => {
	try {
		const response = await axiosConfig.get(
			`/sellers/dashboard/order-stats`,
			{
				withCredentials: true,
			},
		);
		return response.data.data;
	} catch (error) {
		console.error('Error fetching order stats:', error);
		// Trả về dữ liệu mẫu
		return {
			pending: 3,
			confirmed: 4,
			packaging: 1,
			outForDelivery: 2,
			delivered: 10,
			canceled: 1,
			returned: 1,
			failedToDelivery: 2,
		};
	}
};

// Lấy dữ liệu biểu đồ doanh thu
export const getRevenueData = async (period = 'year') => {
	try {
		const response = await axiosConfig.get(`/sellers/dashboard/revenue`, {
			params: { period },
			withCredentials: true,
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching revenue data:', error);
		// Trả về dữ liệu mẫu
		return {
			labels: [
				'T1',
				'T2',
				'T3',
				'T4',
				'T5',
				'T6',
				'T7',
				'T8',
				'T9',
				'T10',
				'T11',
				'T12',
			],
			revenue: [
				12000000, 15000000, 18000000, 22000000, 25000000, 28000000,
				32000000, 35000000, 38000000, 42000000, 45000000, 48000000,
			],
			commission: [
				1200000, 1500000, 1800000, 2200000, 2500000, 2800000, 3200000,
				3500000, 3800000, 4200000, 4500000, 4800000,
			],
		};
	}
};

// Lấy danh sách đơn hàng gần đây
export const getRecentOrders = async (limit = 5) => {
	try {
		const response = await axiosConfig.get(
			`/sellers/dashboard/recent-orders`,
			{
				params: { limit },
				withCredentials: true,
			},
		);
		return response.data.data;
	} catch (error) {
		console.error('Error fetching recent orders:', error);
		// Trả về dữ liệu mẫu
		return [
			{
				id: 'ORD-001',
				customer: 'Nguyễn Văn A',
				amount: 2500000,
				status: 'delivered',
				date: '2024-01-15',
				items: 3,
			},
			{
				id: 'ORD-002',
				customer: 'Trần Thị B',
				amount: 1800000,
				status: 'processing',
				date: '2024-01-14',
				items: 2,
			},
			{
				id: 'ORD-003',
				customer: 'Lê Văn C',
				amount: 3200000,
				status: 'shipped',
				date: '2024-01-13',
				items: 4,
			},
			{
				id: 'ORD-004',
				customer: 'Phạm Thị D',
				amount: 1500000,
				status: 'pending',
				date: '2024-01-12',
				items: 1,
			},
			{
				id: 'ORD-005',
				customer: 'Hoàng Văn E',
				amount: 4200000,
				status: 'delivered',
				date: '2024-01-11',
				items: 5,
			},
		];
	}
};
