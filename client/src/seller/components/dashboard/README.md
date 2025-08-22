# Dashboard Components

Thư mục này chứa các component cho dashboard của seller.

## Components

### 1. StatsCards

-   **File**: `StatsCards.jsx`
-   **Mô tả**: Hiển thị 4 card thống kê chính (Tổng doanh thu, Đơn hàng, Người dùng, Sản phẩm sắp hết hàng)
-   **Props**: `stats` - object chứa dữ liệu thống kê

### 2. RevenueChart

-   **File**: `RevenueChart.jsx`
-   **Mô tả**: Biểu đồ doanh thu sử dụng ChartJS với filter theo thời gian
-   **Props**: `data` - object chứa dữ liệu biểu đồ
-   **Features**:
    -   Line chart với 2 datasets (Doanh thu và Hoa hồng)
    -   Filter: Năm nay, Tháng này, Tuần này
    -   Responsive design

### 3. OrderAnalytics

-   **File**: `OrderAnalytics.jsx`
-   **Mô tả**: Thống kê đơn hàng theo trạng thái
-   **Props**: `orderStats` - object chứa số lượng đơn hàng theo từng trạng thái
-   **Features**:
    -   8 trạng thái: Chờ xác nhận, Đã xác nhận, Đang đóng gói, Đang giao hàng, Đã giao hàng, Đã hủy, Đã hoàn trả, Giao hàng thất bại
    -   Grid layout responsive

### 4. RecentOrders

-   **File**: `RecentOrders.jsx`
-   **Mô tả**: Danh sách đơn hàng gần đây
-   **Props**: `orders` - array chứa danh sách đơn hàng
-   **Features**:
    -   Hiển thị thông tin: ID, Khách hàng, Số tiền, Trạng thái, Ngày tạo
    -   Status badges với màu sắc khác nhau
    -   Button xem chi tiết

## Services

### dashboardService.js

Chứa các function để gọi API:

-   `getDashboardStats()` - Lấy thống kê tổng quan
-   `getOrderStats()` - Lấy thống kê đơn hàng
-   `getRevenueData(period)` - Lấy dữ liệu doanh thu
-   `getRecentOrders(limit)` - Lấy đơn hàng gần đây

## API Endpoints

### Backend Routes (seller.route.js)

-   `GET /api/v1/seller/dashboard/stats`
-   `GET /api/v1/seller/dashboard/order-stats`
-   `GET /api/v1/seller/dashboard/revenue?period=year`
-   `GET /api/v1/seller/dashboard/recent-orders?limit=5`

### Backend Services (seller.service.js)

-   `getDashboardStats(userId)`
-   `getOrderStats(userId)`
-   `getRevenueData(userId, period)`
-   `getRecentOrders(userId, limit)`

## Sử dụng

```jsx
import {
  StatsCards,
  RevenueChart,
  OrderAnalytics,
  RecentOrders
} from '@/seller/components/dashboard';

// Trong component
<StatsCards stats={statsData} />
<RevenueChart data={revenueData} />
<OrderAnalytics orderStats={orderStats} />
<RecentOrders orders={recentOrders} />
```

## Dependencies

-   `chart.js` - Thư viện biểu đồ
-   `react-chartjs-2` - React wrapper cho ChartJS
-   `@heroicons/react` - Icons
-   `axios` - HTTP client

## Features

-   ✅ UI hiện đại với Tailwind CSS
-   ✅ Responsive design
-   ✅ ChartJS biểu đồ doanh thu
-   ✅ Thống kê đơn hàng theo trạng thái
-   ✅ Dữ liệu mẫu khi API chưa sẵn sàng
-   ✅ Loading states
-   ✅ Error handling
-   ✅ Hover effects và animations
