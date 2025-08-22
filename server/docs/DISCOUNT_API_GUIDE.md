# Discount API Guide

## Tổng quan

API quản lý mã giảm giá (discount) cho hệ thống e-commerce.

## Các endpoint

### 1. Lấy danh sách mã giảm giá đang hoạt động

```
GET /api/v1/discounts/active
```

**Mô tả:** Lấy danh sách các mã giảm giá đang có hiệu lực
**Authentication:** Không cần
**Response:**

```json
{
	"message": "Lấy danh sách mã giảm giá đang hoạt động thành công",
	"data": [
		{
			"_id": "...",
			"title": "Giảm giá 20%",
			"code": "SALE20",
			"discountType": "PERCENT",
			"amount": 20,
			"minimumPurchase": 100000,
			"maximumDiscount": 50000,
			"startDate": "2024-01-01T00:00:00.000Z",
			"endDate": "2024-12-31T23:59:59.000Z"
		}
	]
}
```

### 2. Xác thực mã giảm giá

```
POST /api/v1/discounts/validate
```

**Mô tả:** Kiểm tra tính hợp lệ của mã giảm giá
**Authentication:** Cần token
**Body:**

```json
{
	"code": "SALE20",
	"totalAmount": 150000
}
```

**Response:**

```json
{
	"message": "Mã giảm giá hợp lệ",
	"data": {
		"discount": {
			"_id": "...",
			"title": "Giảm giá 20%",
			"code": "SALE20",
			"discountType": "PERCENT",
			"amount": 20
		},
		"discountAmount": 30000,
		"finalAmount": 120000
	}
}
```

### 3. Lấy danh sách tất cả mã giảm giá (Admin)

```
GET /api/v1/discounts?page=1&limit=10&status=ACTIVE&search=sale
```

**Mô tả:** Lấy danh sách mã giảm giá với phân trang và filter
**Authentication:** Cần token + quyền admin
**Query params:**

-   `page`: Trang hiện tại (default: 1)
-   `limit`: Số item mỗi trang (default: 10)
-   `status`: Lọc theo trạng thái (ACTIVE/INACTIVE)
-   `search`: Tìm kiếm theo title hoặc code

### 4. Lấy thông tin mã giảm giá theo ID (Admin)

```
GET /api/v1/discounts/:discountId
```

**Mô tả:** Lấy chi tiết một mã giảm giá
**Authentication:** Cần token + quyền admin

### 5. Tạo mã giảm giá mới (Admin)

```
POST /api/v1/discounts
```

**Mô tả:** Tạo mã giảm giá mới
**Authentication:** Cần token + quyền admin
**Body:**

```json
{
	"title": "Giảm giá 20%",
	"code": "SALE20",
	"couponType": "DISCOUNT_ON_PURCHASE",
	"discountType": "PERCENT",
	"amount": 20,
	"minimumPurchase": 100000,
	"maximumDiscount": 50000,
	"limitUsage": 100,
	"status": "ACTIVE",
	"startDate": "2024-01-01T00:00:00.000Z",
	"endDate": "2024-12-31T23:59:59.000Z"
}
```

### 6. Cập nhật mã giảm giá (Admin)

```
PUT /api/v1/discounts/:discountId
```

**Mô tả:** Cập nhật thông tin mã giảm giá
**Authentication:** Cần token + quyền admin

### 7. Xóa mã giảm giá (Admin)

```
DELETE /api/v1/discounts/:discountId
```

**Mô tả:** Xóa mã giảm giá
**Authentication:** Cần token + quyền admin

### 8. Lấy thống kê sử dụng mã giảm giá (Admin)

```
GET /api/v1/discounts/:discountId/stats
```

**Mô tả:** Lấy thống kê số lần sử dụng và tổng tiền giảm
**Authentication:** Cần token + quyền admin
**Response:**

```json
{
	"message": "Lấy thống kê sử dụng mã giảm giá thành công",
	"data": {
		"totalUsage": 25,
		"totalDiscountAmount": 750000
	}
}
```

### 9. Lấy lịch sử sử dụng mã giảm giá (Admin)

```
GET /api/v1/discounts/:discountId/usage
```

**Mô tả:** Lấy lịch sử sử dụng mã giảm giá của user hiện tại
**Authentication:** Cần token + quyền admin

## Các loại mã giảm giá

### 1. Discount on Purchase

-   `couponType`: "DISCOUNT_ON_PURCHASE"
-   Giảm giá trên tổng giá trị đơn hàng

### 2. Discount on Shipping

-   `couponType`: "DISCOUNT_ON_SHIPPING"
-   Giảm giá phí vận chuyển

## Các loại giảm giá

### 1. Percentage Discount

-   `discountType`: "PERCENT"
-   `amount`: Phần trăm giảm giá (ví dụ: 20 = 20%)

### 2. Fixed Amount Discount

-   `discountType`: "FIXED"
-   `amount`: Số tiền giảm cố định (VNĐ)

## Validation Rules

1. **Code uniqueness:** Mã giảm giá phải là duy nhất
2. **Date validation:** Ngày bắt đầu phải nhỏ hơn ngày kết thúc
3. **Active period:** Chỉ áp dụng trong khoảng thời gian có hiệu lực
4. **Minimum purchase:** Đơn hàng phải đạt giá trị tối thiểu
5. **Usage limit:** Kiểm tra số lần sử dụng của user
6. **Maximum discount:** Giới hạn số tiền giảm tối đa

## Error Messages

-   `Mã giảm giá đã tồn tại`
-   `Ngày bắt đầu phải nhỏ hơn ngày kết thúc`
-   `Không tìm thấy mã giảm giá`
-   `Mã giảm giá không hợp lệ`
-   `Mã giảm giá đã hết hạn hoặc chưa có hiệu lực`
-   `Đơn hàng tối thiểu phải là X VNĐ`
-   `Bạn đã sử dụng hết số lần cho phép của mã giảm giá này`
