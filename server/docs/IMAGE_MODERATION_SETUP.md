# Hướng dẫn Cài đặt Image Moderation

## Tổng quan

Hệ thống kiểm duyệt hình ảnh tự động sử dụng Google Cloud Vision API để phát hiện nội dung không phù hợp trong hình ảnh.

## Tính năng chính

-   ✅ Kiểm tra nội dung người lớn, bạo lực, khiêu dâm
-   ✅ Phát hiện nội dung thù địch, khủng bố
-   ✅ Tự động từ chối hình ảnh không phù hợp
-   ✅ Thống kê và báo cáo chi tiết
-   ✅ Cài đặt linh hoạt cho admin
-   ✅ Tích hợp vào ImageDropzone component

## Bước 1: Cài đặt Google Cloud Vision

### 1.1 Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Bật Cloud Vision API:
    - Vào "APIs & Services" > "Library"
    - Tìm "Cloud Vision API"
    - Click "Enable"

### 1.2 Tạo Service Account

1. Vào "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Đặt tên: `image-moderation-service`
4. Gán role: `Cloud Vision API User`
5. Tạo key JSON và download về máy

### 1.3 Cấu hình Environment Variables

Tạo file `.env` trong thư mục `server/`:

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

## Bước 2: Cài đặt Dependencies

### Server

```bash
cd server
npm install @google-cloud/vision
```

### Client

```bash
cd client
npm install
```

## Bước 3: Cấu hình Backend

### 3.1 Thêm Routes

Thêm vào `server/src/routes/v1/index.js`:

```javascript
const imageModerationRoutes = require('./imageModeration.routes');
router.use('/image-moderation', imageModerationRoutes);
```

### 3.2 Cấu hình Middleware

Đảm bảo đã cài đặt multer:

```bash
npm install multer
```

## Bước 4: Tích hợp vào Frontend

### 4.1 Sử dụng trong ProductCreateForm

```javascript
import ImageDropzone from '@/components/common/ImageDropzone';

// Trong component
<ImageDropzone
	label='Upload hình ảnh sản phẩm'
	value={images}
	onChange={setImages}
	maxFiles={6}
	enableModeration={true} // Bật kiểm duyệt
	color={selectedColor} // Nếu có màu sắc
/>;
```

### 4.2 Tùy chỉnh cài đặt

```javascript
// Tắt kiểm duyệt cho admin
<ImageDropzone
	enableModeration={false}
	// ... other props
/>
```

## Bước 5: Cài đặt Admin Panel

### 5.1 Thêm vào Admin Dashboard

```javascript
import ImageModerationSettings from '@/components/admin/ImageModerationSettings';

// Trong admin dashboard
<ImageModerationSettings />;
```

## Bước 6: Testing

### 6.1 Test API Endpoints

```bash
# Test kiểm tra một hình ảnh
curl -X POST http://localhost:5000/api/v1/image-moderation/check \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@test-image.jpg"

# Test kiểm tra nhiều hình ảnh
curl -X POST http://localhost:5000/api/v1/image-moderation/check-multiple \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg"
```

### 6.2 Test Frontend

1. Upload hình ảnh bình thường → ✅ Được chấp nhận
2. Upload hình ảnh có nội dung không phù hợp → ❌ Bị từ chối
3. Kiểm tra thông báo lỗi chi tiết

## Cấu hình nâng cao

### 1. Tùy chỉnh độ nhạy

```javascript
// Trong imageModeration.controller.js
const strictMode = process.env.IMAGE_MODERATION_STRICT_MODE === 'true';
const confidenceThreshold =
	parseInt(process.env.IMAGE_MODERATION_CONFIDENCE_THRESHOLD) || 70;
```

### 2. Thêm categories mới

```javascript
// Trong imageModeration.controller.js
const categories = [
	{ name: 'adult', likelihood: detections.adult },
	{ name: 'violence', likelihood: detections.violence },
	{ name: 'racy', likelihood: detections.racy },
	// Thêm categories mới ở đây
];
```

### 3. Tùy chỉnh thông báo

```javascript
// Trong imageModeration.service.js
const categoryNames = {
	adult: 'Nội dung người lớn',
	violence: 'Bạo lực',
	racy: 'Nội dung khiêu dâm',
	// Thêm tên tiếng Việt cho categories mới
};
```

## Troubleshooting

### Lỗi thường gặp

#### 1. "Google Cloud Vision API not enabled"

-   Kiểm tra đã bật Cloud Vision API trong Google Cloud Console
-   Đảm bảo service account có quyền truy cập

#### 2. "Invalid API key"

-   Kiểm tra file JSON key có đúng định dạng
-   Đảm bảo đường dẫn `GOOGLE_CLOUD_KEY_FILE` chính xác

#### 3. "File too large"

-   Tăng `maxSize` trong multer config
-   Hoặc nén hình ảnh trước khi upload

#### 4. "Rate limit exceeded"

-   Google Cloud Vision có giới hạn 1000 requests/tháng miễn phí
-   Nâng cấp plan nếu cần

### Debug Mode

Thêm vào `.env`:

```env
DEBUG_IMAGE_MODERATION=true
```

## Chi phí và Giới hạn

### Google Cloud Vision Pricing

-   **Miễn phí**: 1000 requests/tháng
-   **Có phí**: $1.50/1000 requests sau đó
-   **Rate limit**: 1800 requests/phút

### Tối ưu hóa chi phí

1. Cache kết quả kiểm duyệt
2. Giảm kích thước hình ảnh trước khi gửi
3. Batch processing cho nhiều hình ảnh
4. Sử dụng CDN để giảm tải

## Bảo mật

### 1. Bảo vệ API Key

-   Không commit file JSON key vào git
-   Sử dụng environment variables
-   Rotate key định kỳ

### 2. Rate Limiting

```javascript
// Thêm rate limiting middleware
const rateLimit = require('express-rate-limit');

const imageModerationLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 phút
	max: 100, // Tối đa 100 requests
	message: 'Quá nhiều requests kiểm duyệt hình ảnh',
});
```

### 3. File Validation

-   Kiểm tra file type
-   Giới hạn kích thước file
-   Sanitize filename

## Monitoring và Analytics

### 1. Logs

```javascript
// Trong imageModeration.controller.js
console.log(
	`Image moderation: ${filename} - ${
		isAppropriate ? 'APPROVED' : 'REJECTED'
	}`,
);
```

### 2. Metrics

-   Tỷ lệ hình ảnh bị từ chối
-   Thời gian xử lý trung bình
-   Lỗi rate

### 3. Alerts

-   Email thông báo khi có hình ảnh bị từ chối
-   Slack/Discord integration
-   Dashboard monitoring

## Kết luận

Hệ thống image moderation đã được tích hợp hoàn chỉnh với:

-   ✅ Backend API với Google Cloud Vision
-   ✅ Frontend component với ImageDropzone
-   ✅ Admin panel để quản lý cài đặt
-   ✅ Thống kê và báo cáo
-   ✅ Error handling và fallback
-   ✅ Security và rate limiting

Bạn có thể bắt đầu sử dụng ngay sau khi hoàn thành các bước cài đặt trên!
