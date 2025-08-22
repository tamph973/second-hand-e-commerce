# Sample Data for Product and Variant Testing

## 1. Sample Product Data (Form Data)

### Basic Product (Electronics)

```
title: "iPhone 14 Pro Max 128GB - Hàng xách tay"
description: "iPhone 14 Pro Max 128GB màu Deep Purple, hàng xách tay từ Singapore. Máy còn bảo hành Apple 6 tháng, pin 95%, không trầy xước."
price: 25000000
categoryId: "64f8a1b2c3d4e5f6a7b8c9d0" // Electronics category
brandId: "64f8a1b2c3d4e5f6a7b8c9d1" // Apple brand
condition: "LIKE_NEW"
attributes: '{"color": "Deep Purple", "storage": "128GB", "ram": "6GB", "battery_health": "95%", "warranty": "6 months"}'
```

### Clothing Product

```
title: "Áo khoác denim nam Levi's 501 - Size M"
description: "Áo khoác denim nam Levi's 501, chất liệu cotton 100%, màu xanh đậm, size M. Áo đã giặt sạch, không bị sờn rách."
price: 450000
categoryId: "64f8a1b2c3d4e5f6a7b8c9d2" // Clothing category
brandId: "64f8a1b2c3d4e5f6a7b8c9d3" // Levi's brand
condition: "GOOD"
attributes: '{"material": "100% Cotton", "color": "Dark Blue", "size": "M", "style": "Denim Jacket", "care": "Machine washable"}'
```

### Home Appliance

```
title: "Máy giặt Samsung Inverter 8kg - WF80F5E5U4W"
description: "Máy giặt Samsung Inverter 8kg, công nghệ EcoBubble, tiết kiệm điện nước. Máy đã sử dụng 2 năm, còn bảo hành 1 năm."
price: 3500000
categoryId: "64f8a1b2c3d4e5f6a7b8c9d4" // Home Appliances category
brandId: "64f8a1b2c3d4e5f6a7b8c9d5" // Samsung brand
condition: "GOOD"
attributes: '{"capacity": "8kg", "type": "Front Load", "energy_rating": "A+++", "features": ["EcoBubble", "Inverter"], "warranty": "1 year"}'
```

## 2. Sample Variant Data (JSON)

### For iPhone 14 Pro Max

```json
[
	{
		"title": "iPhone 14 Pro Max 128GB - Deep Purple",
		"price": 25000000,
		"stock": 2,
		"sku": "IP14PM-128-DP",
		"attributes": {
			"color": "Deep Purple",
			"storage": "128GB",
			"ram": "6GB"
		}
	},
	{
		"title": "iPhone 14 Pro Max 256GB - Deep Purple",
		"price": 28000000,
		"stock": 1,
		"sku": "IP14PM-256-DP",
		"attributes": {
			"color": "Deep Purple",
			"storage": "256GB",
			"ram": "6GB"
		}
	},
	{
		"title": "iPhone 14 Pro Max 128GB - Gold",
		"price": 25000000,
		"stock": 1,
		"sku": "IP14PM-128-GD",
		"attributes": {
			"color": "Gold",
			"storage": "128GB",
			"ram": "6GB"
		}
	}
]
```

### For Levi's Jacket

```json
[
	{
		"title": "Áo khoác denim Levi's 501 - Size S",
		"price": 420000,
		"stock": 3,
		"sku": "LEVIS-501-S",
		"attributes": {
			"size": "S",
			"color": "Dark Blue",
			"material": "100% Cotton"
		}
	},
	{
		"title": "Áo khoác denim Levi's 501 - Size M",
		"price": 450000,
		"stock": 5,
		"sku": "LEVIS-501-M",
		"attributes": {
			"size": "M",
			"color": "Dark Blue",
			"material": "100% Cotton"
		}
	},
	{
		"title": "Áo khoác denim Levi's 501 - Size L",
		"price": 480000,
		"stock": 2,
		"sku": "LEVIS-501-L",
		"attributes": {
			"size": "L",
			"color": "Dark Blue",
			"material": "100% Cotton"
		}
	}
]
```

### For Samsung Washing Machine

```json
[
	{
		"title": "Máy giặt Samsung 8kg - Màu trắng",
		"price": 3500000,
		"stock": 1,
		"sku": "SAMSUNG-WF8-WHITE",
		"attributes": {
			"color": "White",
			"capacity": "8kg",
			"type": "Front Load"
		}
	},
	{
		"title": "Máy giặt Samsung 8kg - Màu bạc",
		"price": 3600000,
		"stock": 1,
		"sku": "SAMSUNG-WF8-SILVER",
		"attributes": {
			"color": "Silver",
			"capacity": "8kg",
			"type": "Front Load"
		}
	}
]
```

## 3. Testing Workflow

### Step 1: Create Product

1. Use POST `/api/v1/seller/products` with form-data
2. Include product images in the request
3. Send product data as form fields
4. Get product ID from response

### Step 2: Create Variants

1. Use POST `/api/v1/seller/products/{productId}/variants`
2. Send variants data as JSON in request body
3. Variants will be linked to the product via productId

### Step 3: Update Product Price Range

1. After creating variants, the product's priceRange should be updated
2. Use PUT `/api/v1/seller/products/{productId}` to update priceRange if needed

## 4. Postman Collection Example

### Create Product Request

```
POST {{base_url}}/api/v1/seller/products
Content-Type: multipart/form-data
Authorization: Bearer {{seller_token}}

Form Data:
- title: "iPhone 14 Pro Max 128GB - Hàng xách tay"
- description: "iPhone 14 Pro Max 128GB màu Deep Purple..."
- price: 25000000
- categoryId: "64f8a1b2c3d4e5f6a7b8c9d0"
- brandId: "64f8a1b2c3d4e5f6a7b8c9d1"
- condition: "LIKE_NEW"
- attributes: '{"color": "Deep Purple", "storage": "128GB", "ram": "6GB", "battery_health": "95%", "warranty": "6 months"}'
- images: [file1.jpg, file2.jpg, file3.jpg]
```

### Create Variants Request

```
POST {{base_url}}/api/v1/seller/products/{{product_id}}/variants
Content-Type: application/json
Authorization: Bearer {{seller_token}}

Body:
[
  {
    "title": "iPhone 14 Pro Max 128GB - Deep Purple",
    "price": 25000000,
    "stock": 2,
    "sku": "IP14PM-128-DP",
    "attributes": {
      "color": "Deep Purple",
      "storage": "128GB",
      "ram": "6GB"
    }
  },
  {
    "title": "iPhone 14 Pro Max 256GB - Deep Purple",
    "price": 28000000,
    "stock": 1,
    "sku": "IP14PM-256-DP",
    "attributes": {
      "color": "Deep Purple",
      "storage": "256GB",
      "ram": "6GB"
    }
  }
]
```

## 5. Expected Responses

### Product Creation Response

```json
{
  "success": true,
  "message": "Tạo sản phẩm thành công",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d6",
    "title": "iPhone 14 Pro Max 128GB - Hàng xách tay",
    "price": 25000000,
    "priceRange": {
      "min": 25000000,
      "max": 25000000
    },
    "status": "PENDING",
    "images": [...],
    "thumbnail": {...},
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Variant Creation Response

```json
{
  "success": true,
  "message": "Tạo biến thể thành công",
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d7",
      "productId": "64f8a1b2c3d4e5f6a7b8c9d6",
      "title": "iPhone 14 Pro Max 128GB - Deep Purple",
      "price": 25000000,
      "stock": 2,
      "sku": "IP14PM-128-DP",
      "attributes": {...}
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d8",
      "productId": "64f8a1b2c3d4e5f6a7b8c9d6",
      "title": "iPhone 14 Pro Max 256GB - Deep Purple",
      "price": 28000000,
      "stock": 1,
      "sku": "IP14PM-256-DP",
      "attributes": {...}
    }
  ]
}
```
