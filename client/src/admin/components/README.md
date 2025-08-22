# Admin Components

## ProductList

Component chính để quản lý danh sách sản phẩm từ người bán yêu cầu đăng bán để duyệt.

### Tính năng:

1. **Section 1: Header và Filter**

    - Header với icon và tiêu đề "Danh sách sản phẩm người bán"
    - Thống kê tổng quan (ProductStats)
    - Component FilterProducts với các dropdown filter

2. **Section 2: Bảng sản phẩm**
    - Tìm kiếm theo tên sản phẩm
    - Nút Export
    - Bảng hiển thị danh sách sản phẩm với các cột:
        - SL (Serial Number)
        - Product Name (với hình ảnh thumbnail)
        - Seller (người bán)
        - Product Type
        - Unit Price
        - Status (trạng thái duyệt)
        - Show As Featured (toggle)
        - Active Status (toggle)
        - Action (QR Code, View, Edit, Delete)
    - Phân trang

### Cách sử dụng:

```jsx
import ProductList from '../admin/page/product/vendor/ProductList';

function App() {
	return (
		<div>
			<ProductList />
		</div>
	);
}
```

## Components con:

### FilterProducts

Component filter với 4 dropdown:

-   Brand
-   Category
-   Sub Category
-   Sub Sub Category

### ProductStats

Component hiển thị thống kê:

-   Total Products
-   Pending Review
-   Approved
-   Rejected

### ProductStatusBadge

Component hiển thị trạng thái sản phẩm với màu sắc và icon phù hợp.

## Styling:

-   Sử dụng Tailwind CSS
-   Flowbite React components
-   Responsive design
-   Hover effects và transitions
-   Tooltips cho các action buttons

## Mock Data:

Hiện tại sử dụng mock data, trong thực tế cần thay thế bằng API calls.

## Cải tiến có thể thêm:

-   Bulk actions (select multiple products)
-   Advanced filters
-   Export to Excel/CSV
-   Real-time updates
-   Notifications
-   Modal confirmations
