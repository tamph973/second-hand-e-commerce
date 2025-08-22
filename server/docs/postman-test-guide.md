# Hướng dẫn Test API với Postman

## 1. Setup Postman Collection

### Base URL

```
http://localhost:5000/api/v1
```

### Headers cần thiết

```
Content-Type: application/json
Authorization: Bearer <token>
```

## 2. Các API Endpoints

### 2.1. Đăng nhập để lấy token

```
POST /auth/login
Content-Type: application/json

{
  "email": "seller@example.com",
  "password": "password123"
}
```

### 2.2. Upload ảnh sản phẩm (riêng biệt)

```
POST /seller/products/upload-images
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body (form-data):
- images: [file1.jpg, file2.jpg, ...] (tối đa 10 ảnh)
```

**Response thành công:**

```json
{
	"success": true,
	"message": "Upload ảnh thành công",
	"data": {
		"images": [
			{
				"url": "https://res.cloudinary.com/.../image.jpg",
				"public_id": "e-technology/product/1234567890-123456789"
			}
		],
		"count": 1
	}
}
```

### 2.3. Đăng bán sản phẩm (có upload ảnh)

```
POST /seller/products
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body (form-data):
- title: "Điện Thoại Xiaomi 12S Pro máy cũ 99%"
- description: "📱📱📱Điện Thoại Xiaomi 12S Pro máy cũ hàng về nhiều..."
- price: 4700000
- categoryId: "507f1f77bcf86cd799439011"
- brandId: "507f1f77bcf86cd799439012"
- images: [file1.jpg, file2.jpg, ...] (tối đa 10 ảnh)
- attributes: '{"brand": "Xiaomi", "model": "12S Pro", "condition": "99%"}'
```

**Lưu ý quan trọng:** Khi sử dụng `multipart/form-data`, trường `attributes` phải được gửi dưới dạng **JSON string**:

```
attributes: '{"brand": "Xiaomi", "model": "12S Pro", "condition": "99%"}'
```

**Response thành công:**

```json
{
	"success": true,
	"message": "Tạo sản phẩm thành công",
	"data": {
		"_id": "507f1f77bcf86cd799439011",
		"title": "Điện Thoại Xiaomi 12S Pro máy cũ 99%",
		"price": 4700000,
		"priceRange": {
			"min": 4700000,
			"max": 4700000
		},
		"images": [
			{
				"url": "https://res.cloudinary.com/.../image.jpg",
				"thumbnail": "https://res.cloudinary.com/.../image.jpg",
				"public_id": "e-technology/product/1234567890-123456789"
			}
		],
		"thumbnail": {
			"url": "https://res.cloudinary.com/.../image.jpg",
			"public_id": "e-technology/product/1234567890-123456789"
		},
		"status": "PENDING",
		"userId": "507f1f77bcf86cd799439011",
		"createdAt": "2024-01-01T00:00:00.000Z"
	}
}
```

### 2.4. Đăng bán sản phẩm (không upload ảnh)

```
POST /seller/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Tủ lạnh Samsung Inverter 208L",
  "description": "🏠 Tủ lạnh Samsung Inverter 208L máy cũ 95%...",
  "price": 2800000,
  "categoryId": "507f1f77bcf86cd799439013",
  "brandId": "507f1f77bcf86cd799439014",
  "attributes": {
    "brand": "Samsung",
    "model": "Inverter 208L",
    "condition": "95%"
  },
  "images": [
    {
      "url": "https://example.com/fridge1.jpg",
      "thumbnail": "https://example.com/fridge1_thumb.jpg",
      "public_id": "fridge_samsung_208l_1"
    }
  ]
}
```

### 2.5. Lấy danh sách sản phẩm của seller

```
GET /seller/products?page=1&limit=10
Authorization: Bearer <token>
```

### 2.6. Cập nhật sản phẩm

```
PUT /seller/products/:productId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Điện Thoại Xiaomi 12S Pro máy cũ 99% - Cập nhật",
  "price": 4500000
}
```

### 2.7. Xóa sản phẩm

```
DELETE /seller/products/:productId
Authorization: Bearer <token>
```

### 2.8. Xóa ảnh sản phẩm

```
DELETE /seller/products/delete-images
Authorization: Bearer <token>
Content-Type: application/json

{
  "publicIds": [
    "e-technology/product/1234567890-123456789",
    "e-technology/product/1234567890-123456790"
  ]
}
```

### 2.9. Quản lý biến thể sản phẩm

#### 2.9.1. Lấy danh sách biến thể của sản phẩm

```
GET /seller/products/:productId/variants
Authorization: Bearer <token>
```

#### 2.9.2. Thêm biến thể cho sản phẩm

```
POST /seller/products/:productId/variants
Authorization: Bearer <token>
Content-Type: application/json

[
  {
    "title": "Bản 8/128",
    "price": 4700000,
    "stock": 5,
    "sku": "XIAOMI-12S-8-128",
    "attributes": {
      "capacity": "128GB",
      "ram": "8GB"
    }
  },
  {
    "title": "Bản 12/256",
    "price": 4990000,
    "stock": 3,
    "sku": "XIAOMI-12S-12-256",
    "attributes": {
      "capacity": "256GB",
      "ram": "12GB"
    }
  }
]
```

#### 2.9.3. Cập nhật biến thể

```
PUT /seller/variants/:variantId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Bản 8/128 - Cập nhật",
  "price": 4500000,
  "stock": 10,
  "sku": "XIAOMI-12S-8-128-UPDATED",
  "attributes": {
    "capacity": "128GB",
    "ram": "8GB",
    "color": "Đen"
  }
}
```

#### 2.9.4. Xóa biến thể

```
DELETE /seller/variants/:variantId
Authorization: Bearer <token>
```

## 3. Test Cases

### Test Case 1: Đăng bán sản phẩm đơn giản (không có variants)

1. Chọn method POST
2. URL: `{{base_url}}/seller/products`
3. Headers: `Authorization: Bearer {{token}}`
4. Body: form-data
    - Key: `title`, Type: Text, Value: "Test Product"
    - Key: `price`, Type: Text, Value: "1000000"
    - Key: `categoryId`, Type: Text, Value: "507f1f77bcf86cd799439011"
    - Key: `images`, Type: File, Value: chọn file ảnh

### Test Case 2: Đăng bán sản phẩm và thêm variants riêng biệt

1. **Tạo sản phẩm trước:**

    - Chọn method POST
    - URL: `{{base_url}}/seller/products`
    - Headers: `Authorization: Bearer {{token}}`
    - Body: form-data
        - Key: `title`, Type: Text, Value: "Test Product with Variants"
        - Key: `price`, Type: Text, Value: "1000000"
        - Key: `categoryId`, Type: Text, Value: "507f1f77bcf86cd799439011"
        - Key: `images`, Type: File, Value: chọn file ảnh
        - Key: `attributes`, Type: Text, Value: `{"brand": "Test Brand", "model": "Test Model"}`

2. **Thêm variants cho sản phẩm:**
    - Chọn method POST
    - URL: `{{base_url}}/seller/products/{{product_id}}/variants`
    - Headers: `Authorization: Bearer {{token}}`
    - Body: raw (JSON)
    ```json
    [
    	{
    		"title": "Variant 1",
    		"price": 1000000,
    		"stock": 5,
    		"sku": "TEST-VAR-1",
    		"attributes": {
    			"color": "Red",
    			"size": "M"
    		}
    	},
    	{
    		"title": "Variant 2",
    		"price": 1200000,
    		"stock": 3,
    		"sku": "TEST-VAR-2",
    		"attributes": {
    			"color": "Blue",
    			"size": "L"
    		}
    	}
    ]
    ```

### Test Case 3: Đăng bán sản phẩm không có ảnh (JSON)

1. Chọn method POST
2. URL: `{{base_url}}/seller/products`
3. Headers: `Authorization: Bearer {{token}}`
4. Body: raw (JSON)

```json
{
	"title": "Test Product No Image",
	"description": "Test description",
	"price": 1000000,
	"categoryId": "507f1f77bcf86cd799439011",
	"attributes": {
		"brand": "Test Brand",
		"model": "Test Model"
	}
}
```

### Test Case 4: Quản lý biến thể

1. **Tạo sản phẩm trước** (không có variants)
2. **Thêm biến thể cho sản phẩm:**
    - POST `/seller/products/:productId/variants`
    - Body: JSON array với variants
3. **Lấy danh sách biến thể:**
    - GET `/seller/products/:productId/variants`
4. **Cập nhật biến thể:**
    - PUT `/seller/variants/:variantId`
5. **Xóa biến thể:**
    - DELETE `/seller/variants/:variantId`
6. **Cập nhật priceRange của sản phẩm** (nếu cần):
    - PUT `/seller/products/:productId`
    - Body: `{"priceRange": {"min": 1000000, "max": 1200000}}`

### Test Case 5: Validation lỗi

1. Gửi request không có title
2. Gửi request không có price
3. Gửi request không có categoryId
4. Gửi request với price <= 0
5. Gửi request với attributes không phải JSON string
6. Gửi request tạo variant không có productId
7. Gửi request tạo variant với price <= 0

## 4. Environment Variables

Tạo environment trong Postman:

```
base_url: http://localhost:5000/api/v1
token: <token từ login>
```

## 5. Lưu ý quan trọng

1. **Token**: Phải đăng nhập trước để lấy token
2. **Quyền**: User phải được xác minh (verified seller)
3. **Giới hạn**:
    - BASIC: 5 sản phẩm/ngày, giá tối đa 500K
    - ADVANCED: 10 sản phẩm/ngày, giá tối đa 2M
    - PREMIUM: 20 sản phẩm/ngày, giá tối đa 10M
4. **Ảnh**: Tối đa 10 ảnh mỗi lần upload
5. **Status**: Sản phẩm mới tạo có status "PENDING" (cần duyệt)
6. **Form-data**: Khi sử dụng multipart/form-data, attributes phải là JSON string
7. **JSON**: Khi sử dụng application/json, attributes có thể là object
8. **Variants**: Được tạo riêng biệt sau khi tạo sản phẩm, liên kết với Product qua productId
9. **PriceRange**: Cần cập nhật thủ công sau khi thêm/sửa/xóa variants
10. **Workflow**: Tạo sản phẩm trước → Tạo variants riêng → Cập nhật priceRange nếu cần

## 6. Ví dụ dữ liệu mẫu

### Attributes JSON string cho form-data:

```
{"brand": "Xiaomi", "model": "12S Pro", "condition": "99%", "color": "Deep Purple", "storage": "128GB"}
```

**Lưu ý:** Attributes có thể chứa bất kỳ key-value pairs nào phù hợp với sản phẩm:

-   Electronics: `{"brand": "Apple", "model": "iPhone 14", "color": "Black", "storage": "128GB"}`
-   Clothing: `{"brand": "Levi's", "material": "Cotton", "color": "Blue", "size": "M"}`
-   Home Appliances: `{"brand": "Samsung", "capacity": "8kg", "type": "Front Load", "energy_rating": "A+++"}`

### Variants JSON array cho API:

```json
[
	{
		"title": "Bản 8/128",
		"price": 4700000,
		"stock": 5,
		"sku": "XIAOMI-12S-8-128",
		"attributes": {
			"capacity": "128GB",
			"ram": "8GB"
		}
	},
	{
		"title": "Bản 12/256",
		"price": 4990000,
		"stock": 3,
		"sku": "XIAOMI-12S-12-256",
		"attributes": {
			"capacity": "256GB",
			"ram": "12GB"
		}
	}
]
```

## 7. Cấu trúc dữ liệu mới

### Product Model:

```json
{
	"_id": "507f1f77bcf86cd799439011",
	"title": "Điện Thoại Xiaomi 12S Pro",
	"price": 4700000,
	"priceRange": {
		"min": 4700000,
		"max": 4700000
	},
	"status": "PENDING",
	"userId": "507f1f77bcf86cd799439011",
	"attributes": {
		"brand": "Xiaomi",
		"model": "12S Pro",
		"color": "Deep Purple",
		"storage": "128GB",
		"condition": "99%"
	}
}
```

### Variant Model:

```json
{
	"_id": "507f1f77bcf86cd799439012",
	"productId": "507f1f77bcf86cd799439011",
	"title": "Bản 8/128",
	"price": 4700000,
	"stock": 5,
	"sku": "XIAOMI-12S-8-128",
	"attributes": {
		"capacity": "128GB",
		"ram": "8GB"
	},
	"status": "ACTIVE"
}
```
 