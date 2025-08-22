# Hướng Dẫn Sử Dụng Hệ Thống Kiểm Duyệt Hình Ảnh

## Tổng Quan

Hệ thống kiểm duyệt hình ảnh sử dụng Google Cloud Vision API để tự động kiểm tra và phân loại nội dung hình ảnh trong nền tảng thương mại điện tử bán đồ cũ.

## Tính Năng Chính

### 1. Kiểm Duyệt Tự Động

-   Phân tích 7 loại nội dung: adult, violence, racy, spoof, medical, hate, terror
-   Tính toán độ tin cậy và mức độ rủi ro
-   Tự động từ chối hoặc yêu cầu review thủ công

### 2. Cấu Hình Linh Hoạt

-   Ngưỡng kiểm duyệt có thể điều chỉnh cho từng loại nội dung
-   Chế độ nghiêm ngặt hoặc linh hoạt
-   Tự động từ chối hoặc chỉ cảnh báo

### 3. Quản Lý Review Thủ Công

-   Dashboard cho admin review hình ảnh
-   Lịch sử kiểm duyệt chi tiết
-   Thống kê và báo cáo

## Cấu Hình Môi Trường

Thêm các biến môi trường vào file `.env`:

```env
# Google Cloud Vision
GOOGLE_CLOUD_KEY_FILE=./google-cloud-key.json
GOOGLE_CLOUD_PROJECT_ID=your-project-id

# Image Moderation Settings
IMAGE_MODERATION_ENABLED=true
IMAGE_MODERATION_STRICT_MODE=false
IMAGE_MODERATION_AUTO_REJECT=true
IMAGE_MODERATION_CONFIDENCE_THRESHOLD=70
```

## API Endpoints

### 1. Kiểm Duyệt Hình Ảnh

#### Kiểm tra một hình ảnh

```http
POST /api/v1/image-moderation/check
Content-Type: multipart/form-data
Authorization: Bearer <token>

Form Data:
- image: file
```

#### Kiểm tra nhiều hình ảnh

```http
POST /api/v1/image-moderation/check-multiple
Content-Type: multipart/form-data
Authorization: Bearer <token>

Form Data:
- images: file[] (tối đa 10 files)
```

#### Kiểm tra hình ảnh sản phẩm

```http
POST /api/v1/image-moderation/check-product-images
Content-Type: multipart/form-data
Authorization: Bearer <token>

Form Data:
- images: file[] (tối đa 10 files)
```

### 2. Quản Lý Review

#### Lấy danh sách cần review

```http
GET /api/v1/image-moderation/pending-reviews?page=1&limit=20&riskLevel=HIGH
Authorization: Bearer <admin_token>
```

#### Review thủ công

```http
PUT /api/v1/image-moderation/:id/review
Authorization: Bearer <admin_token>

Body:
{
  "action": "approve|reject",
  "note": "Ghi chú review"
}
```

### 3. Thống Kê

#### Lấy thống kê tổng quan

```http
GET /api/v1/image-moderation/stats
Authorization: Bearer <admin_token>
```

#### Lấy lịch sử kiểm duyệt

```http
GET /api/v1/image-moderation/history?page=1&limit=10&status=APPROVED
Authorization: Bearer <token>
```

## Tích Hợp Vào Product Upload

### 1. Sử dụng Middleware

```javascript
import { moderateProductImages } from '../middlewares/imageModeration.js';

// Trong route upload sản phẩm
router.post(
	'/products',
	upload.array('images', 10),
	moderateProductImages,
	productController.createProduct,
);
```

### 2. Kiểm tra kết quả trong controller

```javascript
// Trong product controller
createProduct = async (req, res) => {
	try {
		// Kết quả kiểm duyệt có sẵn trong req.moderationResults
		const moderationResults = req.moderationResults;

		// Xử lý logic tạo sản phẩm
		const product = await ProductModel.create({
			...req.body,
			moderationStatus: moderationResults.some((r) => !r.isAppropriate)
				? 'PENDING'
				: 'APPROVED',
		});

		res.json({
			success: true,
			product,
			moderationResults,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
```

## Ngưỡng Kiểm Duyệt

### Cấu hình mặc định cho E-commerce:

| Loại Nội Dung | Ngưỡng Từ Chối | Ngưỡng Cảnh Báo |
| ------------- | -------------- | --------------- |
| Adult         | VERY_LIKELY    | LIKELY          |
| Violence      | VERY_LIKELY    | LIKELY          |
| Racy          | VERY_LIKELY    | LIKELY          |
| Hate          | LIKELY         | POSSIBLE        |
| Terror        | LIKELY         | POSSIBLE        |
| Medical       | VERY_LIKELY    | LIKELY          |
| Spoof         | VERY_LIKELY    | LIKELY          |

### Mức Độ Likelihood:

-   `VERY_UNLIKELY`: 0% - 20%
-   `UNLIKELY`: 20% - 40%
-   `POSSIBLE`: 40% - 60%
-   `LIKELY`: 60% - 80%
-   `VERY_LIKELY`: 80% - 100%

## Mức Độ Rủi Ro

-   **LOW**: Không có nội dung bị từ chối, độ tin cậy cao
-   **MEDIUM**: Có cảnh báo hoặc độ tin cậy thấp
-   **HIGH**: Có nội dung bị từ chối

## Trạng Thái Kiểm Duyệt

-   **PENDING**: Chờ xử lý
-   **APPROVED**: Đã phê duyệt
-   **REJECTED**: Bị từ chối
-   **MANUAL_REVIEW**: Cần review thủ công

## Xử Lý Lỗi

### Lỗi thường gặp:

1. **File quá lớn**

    - Giới hạn: 10MB
    - Giải pháp: Nén hình ảnh trước khi upload

2. **Định dạng không hỗ trợ**

    - Hỗ trợ: JPEG, PNG, WebP
    - Giải pháp: Chuyển đổi định dạng

3. **API quota exceeded**

    - Giải pháp: Tăng quota hoặc implement caching

4. **Network timeout**
    - Giải pháp: Tăng timeout hoặc retry logic

## Tối Ưu Hiệu Suất

### 1. Caching

```javascript
// Cache kết quả kiểm duyệt
const cacheKey = `moderation:${fileHash}`;
const cachedResult = await redis.get(cacheKey);
if (cachedResult) {
	return JSON.parse(cachedResult);
}
```

### 2. Batch Processing

```javascript
// Xử lý hàng loạt thay vì từng file
const batchResults = await Promise.all(
	files.map((file) => moderateImage(file)),
);
```

### 3. Async Processing

```javascript
// Xử lý bất đồng bộ cho hình ảnh lớn
const job = await queue.add('moderateImage', {
	fileId: file.id,
	userId: req.user.id,
});
```

## Monitoring và Logging

### 1. Metrics cần theo dõi:

-   Tỷ lệ hình ảnh bị từ chối
-   Thời gian xử lý trung bình
-   Số lượng API calls
-   Error rate

### 2. Logging:

```javascript
console.log('Image moderation result:', {
	filename: file.originalname,
	isAppropriate: result.isAppropriate,
	riskLevel: result.riskLevel,
	confidence: result.confidence,
	processingTime: Date.now() - startTime,
});
```

## Bảo Mật

### 1. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const moderationLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 phút
	max: 100, // tối đa 100 requests
	message: 'Quá nhiều requests kiểm duyệt',
});
```

### 2. File Validation

```javascript
// Kiểm tra file signature
const fileSignature = file.buffer.slice(0, 4);
const validSignatures = [
	Buffer.from([0xff, 0xd8, 0xff]), // JPEG
	Buffer.from([0x89, 0x50, 0x4e, 0x47]), // PNG
	// ...
];
```

## Testing

### 1. Unit Tests

```javascript
describe('Image Moderation', () => {
	test('should reject inappropriate content', async () => {
		const result = await moderateImage(testFile);
		expect(result.isAppropriate).toBe(false);
	});
});
```

### 2. Integration Tests

```javascript
describe('Moderation API', () => {
	test('should return moderation result', async () => {
		const response = await request(app)
			.post('/api/v1/image-moderation/check')
			.attach('image', testImagePath);

		expect(response.body.success).toBe(true);
	});
});
```

## Troubleshooting

### 1. Google Cloud Vision không hoạt động

-   Kiểm tra API key và project ID
-   Kiểm tra billing và quota
-   Kiểm tra network connectivity

### 2. Kết quả không chính xác

-   Điều chỉnh ngưỡng kiểm duyệt
-   Review thủ công các trường hợp đặc biệt
-   Cập nhật training data

### 3. Performance chậm

-   Implement caching
-   Sử dụng batch processing
-   Tối ưu image size trước khi upload
