# Hướng Dẫn Upload Ảnh CCCD - Frontend Implementation

## Tổng Quan

Khi upload ảnh CCCD, hệ thống cần phân biệt được đâu là mặt trước và đâu là mặt sau. Có 2 cách để thực hiện điều này:

## Cách 1: Sử Dụng Field Names Cụ Thể (Khuyến Nghị)

### API Endpoint

```
POST /api/v1/seller/verify-cccd
```

### Request Format

```javascript
// Sử dụng FormData với field names cụ thể
const formData = new FormData();
formData.append('cccdNumber', '123456789012');
formData.append('cccdFront', frontImageFile); // Ảnh mặt trước
formData.append('cccdBack', backImageFile); // Ảnh mặt sau

// Gửi request
const response = await fetch('/api/v1/seller/verify-cccd', {
	method: 'POST',
	headers: {
		Authorization: `Bearer ${token}`,
	},
	body: formData,
});
```

### Frontend Implementation (React)

```jsx
import React, { useState } from 'react';

const CCCDUploadForm = () => {
	const [cccdNumber, setCccdNumber] = useState('');
	const [frontImage, setFrontImage] = useState(null);
	const [backImage, setBackImage] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!frontImage || !backImage) {
			alert('Vui lòng upload đầy đủ ảnh mặt trước và mặt sau');
			return;
		}

		setLoading(true);

		try {
			const formData = new FormData();
			formData.append('cccdNumber', cccdNumber);
			formData.append('cccdFront', frontImage);
			formData.append('cccdBack', backImage);

			const response = await fetch('/api/v1/seller/verify-cccd', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
				body: formData,
			});

			const result = await response.json();

			if (response.ok) {
				alert('Xác minh CCCD thành công!');
				console.log('Images:', result.data.images);
			} else {
				alert(result.message || 'Có lỗi xảy ra');
			}
		} catch (error) {
			console.error('Error:', error);
			alert('Có lỗi xảy ra khi upload ảnh');
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label>Số CCCD:</label>
				<input
					type='text'
					value={cccdNumber}
					onChange={(e) => setCccdNumber(e.target.value)}
					required
				/>
			</div>

			<div>
				<label>Ảnh mặt trước CCCD:</label>
				<input
					type='file'
					accept='image/*'
					onChange={(e) => setFrontImage(e.target.files[0])}
					required
				/>
			</div>

			<div>
				<label>Ảnh mặt sau CCCD:</label>
				<input
					type='file'
					accept='image/*'
					onChange={(e) => setBackImage(e.target.files[0])}
					required
				/>
			</div>

			<button type='submit' disabled={loading}>
				{loading ? 'Đang xử lý...' : 'Xác minh CCCD'}
			</button>
		</form>
	);
};

export default CCCDUploadForm;
```

## Cách 2: Sử Dụng Array Upload (Fallback)

### API Endpoint

```
POST /api/v1/seller/verify-cccd-array
```

### Request Format

```javascript
// Sử dụng FormData với array
const formData = new FormData();
formData.append('cccdNumber', '123456789012');
formData.append('cccdImages', frontImageFile); // Ảnh đầu tiên = mặt trước
formData.append('cccdImages', backImageFile); // Ảnh thứ hai = mặt sau

// Hoặc đặt tên file có chứa từ khóa
const frontFile = new File([frontImageBlob], 'cccd_front.jpg', {
	type: 'image/jpeg',
});
const backFile = new File([backImageBlob], 'cccd_back.jpg', {
	type: 'image/jpeg',
});

formData.append('cccdImages', frontFile);
formData.append('cccdImages', backFile);
```

### Frontend Implementation với Drag & Drop

```jsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const CCCDUploadWithDropzone = () => {
	const [cccdNumber, setCccdNumber] = useState('');
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [loading, setLoading] = useState(false);

	const onDrop = useCallback((acceptedFiles) => {
		// Sắp xếp file theo tên để đảm bảo thứ tự
		const sortedFiles = acceptedFiles.sort((a, b) => {
			const aName = a.name.toLowerCase();
			const bName = b.name.toLowerCase();

			// Ưu tiên file có tên chứa "front" hoặc "truoc"
			if (aName.includes('front') || aName.includes('truoc')) return -1;
			if (bName.includes('front') || bName.includes('truoc')) return 1;

			// Ưu tiên file có tên chứa "back" hoặc "sau"
			if (aName.includes('back') || aName.includes('sau')) return 1;
			if (bName.includes('back') || bName.includes('sau')) return -1;

			return aName.localeCompare(bName);
		});

		setUploadedFiles(sortedFiles);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			'image/*': ['.jpeg', '.jpg', '.png'],
		},
		maxFiles: 2,
		maxSize: 5 * 1024 * 1024, // 5MB
	});

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (uploadedFiles.length < 2) {
			alert('Vui lòng upload đầy đủ 2 ảnh CCCD');
			return;
		}

		setLoading(true);

		try {
			const formData = new FormData();
			formData.append('cccdNumber', cccdNumber);

			// Thêm file theo thứ tự
			uploadedFiles.forEach((file, index) => {
				formData.append('cccdImages', file);
			});

			const response = await fetch('/api/v1/seller/verify-cccd-array', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
				body: formData,
			});

			const result = await response.json();

			if (response.ok) {
				alert('Xác minh CCCD thành công!');
				setUploadedFiles([]);
				setCccdNumber('');
			} else {
				alert(result.message || 'Có lỗi xảy ra');
			}
		} catch (error) {
			console.error('Error:', error);
			alert('Có lỗi xảy ra khi upload ảnh');
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label>Số CCCD:</label>
				<input
					type='text'
					value={cccdNumber}
					onChange={(e) => setCccdNumber(e.target.value)}
					required
				/>
			</div>

			<div
				{...getRootProps()}
				style={{
					border: '2px dashed #ccc',
					borderRadius: '4px',
					padding: '20px',
					textAlign: 'center',
					cursor: 'pointer',
				}}>
				<input {...getInputProps()} />
				{isDragActive ? (
					<p>Thả file vào đây...</p>
				) : (
					<p>Kéo thả ảnh CCCD vào đây, hoặc click để chọn file</p>
				)}
			</div>

			{uploadedFiles.length > 0 && (
				<div>
					<h4>Files đã chọn:</h4>
					<ul>
						{uploadedFiles.map((file, index) => (
							<li key={index}>
								{file.name} -{' '}
								{index === 0 ? 'Mặt trước' : 'Mặt sau'}
							</li>
						))}
					</ul>
				</div>
			)}

			<button
				type='submit'
				disabled={loading || uploadedFiles.length < 2}>
				{loading ? 'Đang xử lý...' : 'Xác minh CCCD'}
			</button>
		</form>
	);
};

export default CCCDUploadWithDropzone;
```

## Cách 3: Upload Tuần Tự

```jsx
const CCCDUploadSequential = () => {
	const [cccdNumber, setCccdNumber] = useState('');
	const [frontImage, setFrontImage] = useState(null);
	const [backImage, setBackImage] = useState(null);
	const [currentStep, setCurrentStep] = useState(1);

	const handleFrontImageUpload = async (file) => {
		setFrontImage(file);
		setCurrentStep(2);
	};

	const handleBackImageUpload = async (file) => {
		setBackImage(file);
		setCurrentStep(3);
	};

	const handleSubmit = async () => {
		// Sử dụng field names cụ thể
		const formData = new FormData();
		formData.append('cccdNumber', cccdNumber);
		formData.append('cccdFront', frontImage);
		formData.append('cccdBack', backImage);

		// Gửi request...
	};

	return (
		<div>
			{currentStep === 1 && (
				<div>
					<h3>Bước 1: Upload ảnh mặt trước CCCD</h3>
					<input
						type='file'
						accept='image/*'
						onChange={(e) =>
							handleFrontImageUpload(e.target.files[0])
						}
					/>
				</div>
			)}

			{currentStep === 2 && (
				<div>
					<h3>Bước 2: Upload ảnh mặt sau CCCD</h3>
					<input
						type='file'
						accept='image/*'
						onChange={(e) =>
							handleBackImageUpload(e.target.files[0])
						}
					/>
				</div>
			)}

			{currentStep === 3 && (
				<div>
					<h3>Bước 3: Xác nhận thông tin</h3>
					<input
						type='text'
						placeholder='Nhập số CCCD'
						value={cccdNumber}
						onChange={(e) => setCccdNumber(e.target.value)}
					/>
					<button onClick={handleSubmit}>Xác minh CCCD</button>
				</div>
			)}
		</div>
	);
};
```

## Validation Rules

### Yêu Cầu Ảnh

-   **Định dạng**: JPG, JPEG, PNG
-   **Kích thước tối đa**: 5MB mỗi ảnh
-   **Chất lượng**: Ảnh rõ ràng, không bị mờ
-   **Nội dung**: Hiển thị đầy đủ thông tin CCCD

### Tên File Khuyến Nghị

```
cccd_front.jpg
mat_truoc_cccd.png
front_cccd.jpeg
cccd_back.jpg
mat_sau_cccd.png
back_cccd.jpeg
```

## Error Handling

```javascript
const handleUploadError = (error) => {
	switch (error.code) {
		case 'FILE_TOO_LARGE':
			alert('File quá lớn. Kích thước tối đa là 5MB');
			break;
		case 'INVALID_FILE_TYPE':
			alert('Định dạng file không hợp lệ. Chỉ chấp nhận JPG, JPEG, PNG');
			break;
		case 'MISSING_FILES':
			alert('Vui lòng upload đầy đủ ảnh mặt trước và mặt sau');
			break;
		default:
			alert('Có lỗi xảy ra khi upload ảnh');
	}
};
```

## Testing

### Test Cases

1. **Upload đúng 2 ảnh với field names cụ thể**
2. **Upload đúng 2 ảnh với array**
3. **Upload ảnh với tên file có từ khóa**
4. **Upload thiếu ảnh**
5. **Upload ảnh sai định dạng**
6. **Upload ảnh quá lớn**
7. **Upload không có ảnh**

### API Testing với Postman

```bash
# Test với field names cụ thể
POST /api/v1/seller/verify-cccd
Content-Type: multipart/form-data

cccdNumber: 123456789012
cccdFront: [file1.jpg]
cccdBack: [file2.jpg]

# Test với array
POST /api/v1/seller/verify-cccd-array
Content-Type: multipart/form-data

cccdNumber: 123456789012
cccdImages: [file1.jpg]
cccdImages: [file2.jpg]
```

## Kết Luận

**Khuyến nghị sử dụng Cách 1** (field names cụ thể) vì:

-   Rõ ràng và dễ hiểu
-   Ít lỗi xảy ra
-   Dễ debug và maintain
-   Tương thích tốt với các framework frontend

**Cách 2** (array upload) chỉ nên dùng làm fallback khi cần tương thích với hệ thống cũ.
