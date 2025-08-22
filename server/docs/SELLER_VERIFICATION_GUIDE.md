# Hệ Thống Xác Minh Seller - Hướng Dẫn Triển Khai

## Tổng Quan

Hệ thống xác minh seller được thiết kế để đảm bảo tính minh bạch và độ tin cậy trong nền tảng thương mại điện tử đồ cũ. Hệ thống áp dụng các phương pháp xác minh đa lớp và phân cấp quyền hạn dựa trên mức độ xác minh.

## Cấu Trúc Hệ Thống

### 1. Phân Cấp Xác Minh

```
NONE → BASIC → ADVANCED → PREMIUM
```

-   **NONE**: Chưa xác minh
-   **BASIC**: Xác minh cơ bản (Email + SDT + CCCD hoặc tài khoản ngân hàng)
-   **ADVANCED**: Xác minh nâng cao (Email + SDT + CCCD + tài khoản ngân hàng)
-   **PREMIUM**: Xác minh cao cấp (Đầy đủ thông tin + lịch sử tốt)

### 2. Giới Hạn Theo Cấp Độ

| Cấp Độ   | Số SP Tối Đa | Giá Tối Đa | Upload/Ngày |
| -------- | ------------ | ---------- | ----------- |
| BASIC    | 10           | 500K VNĐ   | 5           |
| ADVANCED | 50           | 2M VNĐ     | 10          |
| PREMIUM  | 200          | 10M VNĐ    | 20          |

## API Endpoints

### Seller Registration & Verification

```javascript
// Đăng ký làm seller
POST /api/v1/seller/register
{
  "businessName": "Cửa hàng ABC",
  "businessLicense": "GP123456",
  "businessAddress": "123 Đường ABC, Hà Nội",
  "taxCode": "0123456789"
}

// Xác minh CCCD
POST /api/v1/seller/verify-cccd
{
  "cccdNumber": "123456789012",
  "cccdFrontImage": {
    "url": "https://...",
    "public_id": "..."
  },
  "cccdBackImage": {
    "url": "https://...",
    "public_id": "..."
  }
}

// Xác minh tài khoản ngân hàng
POST /api/v1/seller/verify-bank
{
  "accountNumber": "1234567890",
  "accountName": "Nguyễn Văn A",
  "bankName": "Vietcombank"
}

// Nâng cấp cấp độ
POST /api/v1/seller/upgrade-level
{
  "targetLevel": "ADVANCED"
}
```

### Product Management

```javascript
// Tạo sản phẩm (yêu cầu seller đã xác minh)
POST /api/v1/seller/products
{
  "name": "iPhone 12 Pro Max",
  "description": "Điện thoại cũ, còn 90%",
  "price": 15000000,
  "categoryId": "category_id",
  "brandId": "brand_id",
  "thumbnail": {
    "url": "https://...",
    "public_id": "..."
  }
}

// Lấy danh sách sản phẩm của seller
GET /api/v1/seller/products?page=1&limit=10

// Cập nhật sản phẩm
PUT /api/v1/seller/products/:productId

// Xóa sản phẩm
DELETE /api/v1/seller/products/:productId
```

## Middleware Bảo Mật

### 1. `isSeller`

Kiểm tra user có phải là seller không

### 2. `isVerifiedSeller`

Kiểm tra seller đã được xác minh chưa

### 3. `checkProductLimits`

Kiểm tra giới hạn giá và số lượng sản phẩm

### 4. `checkDailyUploadLimit`

Kiểm tra giới hạn upload hàng ngày

### 5. `requireVerificationLevel(minLevel)`

Kiểm tra cấp độ xác minh tối thiểu

## Tích Hợp AI & Machine Learning

### 1. Xác Minh CCCD

```javascript
// Sử dụng Google Vision API hoặc AWS Rekognition
const verifyCCCDWithAI = async (cccdData) => {
	// OCR để đọc thông tin CCCD
	// Face recognition để so sánh ảnh
	// Validation logic
};
```

### 2. Phát Hiện Gian Lận

```javascript
// Machine learning để phát hiện:
// - Sản phẩm giả mạo
// - Giá bất thường
// - Hành vi đáng ngờ
// - Spam content
```

### 3. Đánh Giá Tín Nhiệm

```javascript
// Tính toán trust score dựa trên:
// - Lịch sử giao dịch
// - Đánh giá từ người mua
// - Tỷ lệ phản hồi
// - Thời gian hoạt động
```

## Quy Trình Xác Minh

### Bước 1: Đăng Ký Seller

1. User đăng ký tài khoản thường
2. Chuyển đổi thành seller role
3. Cập nhật thông tin business

### Bước 2: Xác Minh Cơ Bản

1. Xác minh CCCD hoặc tài khoản ngân hàng
2. Nâng cấp lên BASIC level
3. Có thể đăng sản phẩm giá thấp

### Bước 3: Xác Minh Nâng Cao

1. Xác minh thêm phương thức còn lại
2. Nâng cấp lên ADVANCED level
3. Có thể đăng sản phẩm giá cao hơn

### Bước 4: Duy Trì Uy Tín

1. Duy trì rating cao
2. Phản hồi nhanh chóng
3. Giao dịch thành công
4. Nâng cấp lên PREMIUM

## Monitoring & Analytics

### 1. Metrics Theo Dõi

-   Số lượng seller đăng ký
-   Tỷ lệ xác minh thành công
-   Thời gian xác minh trung bình
-   Tỷ lệ gian lận phát hiện được

### 2. Dashboard Admin

-   Danh sách seller chờ xác minh
-   Báo cáo gian lận
-   Thống kê theo cấp độ
-   Khuyến nghị cải thiện

## Bảo Mật & Tuân Thủ

### 1. Bảo Mật Dữ Liệu

-   Mã hóa thông tin nhạy cảm
-   Không lưu trữ CCCD dưới dạng plain text
-   Tuân thủ GDPR/LGPD

### 2. Audit Trail

-   Log tất cả hoạt động xác minh
-   Lưu trữ lịch sử thay đổi
-   Backup dữ liệu định kỳ

### 3. Rate Limiting

-   Giới hạn số lần xác minh
-   Chống spam và abuse
-   Monitoring bất thường

## Triển Khai Production

### 1. Environment Variables

```bash
# AI Services
GOOGLE_VISION_API_KEY=your_key
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret

# SMS Service
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token

# Bank API
BANK_API_KEY=your_key
BANK_API_SECRET=your_secret
```

### 2. Database Indexes

```javascript
// Tối ưu query performance
db.users.createIndex({ 'sellerVerification.isVerified': 1 });
db.users.createIndex({ 'sellerVerification.verificationLevel': 1 });
db.products.createIndex({ userId: 1, status: 1 });
```

### 3. Caching Strategy

```javascript
// Cache seller verification status
const cacheKey = `seller_verification_${userId}`;
await redis.setex(cacheKey, 3600, JSON.stringify(verificationData));
```

## Testing

### 1. Unit Tests

```javascript
describe('Seller Verification', () => {
	test('should verify CCCD successfully', async () => {
		// Test logic
	});

	test('should reject invalid CCCD', async () => {
		// Test logic
	});
});
```

### 2. Integration Tests

```javascript
describe('Product Creation', () => {
	test('should allow verified seller to create product', async () => {
		// Test logic
	});

	test('should reject unverified seller', async () => {
		// Test logic
	});
});
```

## Monitoring & Alerts

### 1. Health Checks

-   API response time
-   Database connection
-   External service status

### 2. Alerts

-   High failure rate
-   Suspicious activity
-   System downtime

## Kết Luận

Hệ thống xác minh seller này cung cấp:

-   **Bảo mật cao**: Xác minh đa lớp
-   **Linh hoạt**: Phân cấp quyền hạn
-   **Mở rộng**: Dễ dàng thêm tính năng mới
-   **Tuân thủ**: Đáp ứng yêu cầu pháp lý
-   **AI-powered**: Tích hợp machine learning

Hệ thống này có thể được áp dụng cho các nền tảng thương mại điện tử khác và dễ dàng tùy chỉnh theo yêu cầu cụ thể.
