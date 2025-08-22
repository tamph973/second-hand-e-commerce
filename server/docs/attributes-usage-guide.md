# Hướng dẫn sử dụng Attributes

## 1. Cấu trúc Attributes

### Product Attributes

```json
{
	"brand": "Apple",
	"model": "iPhone 14 Pro Max",
	"color": "Deep Purple",
	"storage": "128GB",
	"ram": "6GB",
	"battery_health": "95%",
	"warranty": "6 months"
}
```

### Variant Attributes

```json
{
	"color": "Deep Purple",
	"storage": "128GB",
	"ram": "6GB"
}
```

## 2. Quy tắc sử dụng

### 2.1. Product Attributes

-   **Mục đích**: Mô tả đặc điểm chung của sản phẩm
-   **Format**: Object với key-value pairs
-   **Ví dụ**: Thương hiệu, model, điều kiện, bảo hành chung

### 2.2. Variant Attributes

-   **Mục đích**: Mô tả đặc điểm riêng của từng biến thể
-   **Format**: Object với key-value pairs
-   **Ví dụ**: Màu sắc, dung lượng, kích thước cụ thể

## 3. Ví dụ theo danh mục

### 3.1. Điện tử (Electronics)

**Product Attributes:**

```json
{
	"brand": "Apple",
	"model": "iPhone 14 Pro Max",
	"condition": "99%",
	"warranty": "6 months",
	"origin": "Singapore"
}
```

**Variant Attributes:**

```json
{
	"color": "Deep Purple",
	"storage": "128GB",
	"ram": "6GB"
}
```

### 3.2. Quần áo (Clothing)

**Product Attributes:**

```json
{
	"brand": "Levi's",
	"model": "501",
	"material": "100% Cotton",
	"style": "Denim Jacket",
	"care": "Machine washable"
}
```

**Variant Attributes:**

```json
{
	"size": "M",
	"color": "Dark Blue"
}
```

### 3.3. Đồ gia dụng (Home Appliances)

**Product Attributes:**

```json
{
	"brand": "Samsung",
	"model": "WF80F5E5U4W",
	"capacity": "8kg",
	"type": "Front Load",
	"energy_rating": "A+++",
	"features": ["EcoBubble", "Inverter"],
	"warranty": "1 year"
}
```

**Variant Attributes:**

```json
{
	"color": "White",
	"capacity": "8kg"
}
```

## 4. Cách gửi trong API

### 4.1. Form-data (multipart/form-data)

```
attributes: '{"brand": "Apple", "model": "iPhone 14", "color": "Black"}'
```

### 4.2. JSON (application/json)

```json
{
	"attributes": {
		"brand": "Apple",
		"model": "iPhone 14",
		"color": "Black"
	}
}
```

## 5. Validation Rules

### 5.1. Product Attributes

-   ✅ Có thể chứa bất kỳ key-value pairs nào
-   ✅ Nên có các thông tin cơ bản: brand, model, condition
-   ✅ Có thể chứa thông tin bảo hành, xuất xứ

### 5.2. Variant Attributes

-   ✅ Phải khác biệt giữa các variants
-   ✅ Thường là: color, size, storage, capacity
-   ✅ Không nên trùng lặp với product attributes

## 6. Best Practices

### 6.1. Naming Convention

-   Sử dụng snake_case hoặc camelCase nhất quán
-   Tên key ngắn gọn, dễ hiểu
-   Tránh ký tự đặc biệt

### 6.2. Data Types

-   **String**: brand, model, color, size
-   **Number**: storage (GB), capacity (kg), ram (GB)
-   **Array**: features, colors (nếu có nhiều)
-   **Boolean**: is_new, has_warranty

### 6.3. Required vs Optional

-   **Product**: brand, model (bắt buộc)
-   **Variant**: color, size, storage (tùy theo sản phẩm)

## 7. Migration từ Array Format

### Cũ (Array Format):

```json
[
	{
		"id": "brand",
		"value": "Apple",
		"label": "Thương hiệu"
	}
]
```

### Mới (Object Format):

```json
{
	"brand": "Apple"
}
```

**Lợi ích:**

-   Dễ đọc và hiểu hơn
-   Ít verbose hơn
-   Linh hoạt hơn trong việc thêm/sửa/xóa
-   Tương thích với variant attributes
