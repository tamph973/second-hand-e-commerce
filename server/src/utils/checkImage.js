import * as tf from '@tensorflow/tfjs-node';
import * as nsfwjs from 'nsfwjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Lấy đường dẫn thư mục hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đường dẫn đến file ảnh
const imagePath = path.join(__dirname, './bikini-multi-alcas-por-do-sol.jpg');

try {
	// Đọc file ảnh
	const image = fs.readFileSync(imagePath);

	// Chuyển đổi ảnh thành tensor
	const imageTensor = tf.node.decodeImage(image, 3);

	// Tải mô hình NSFWJS
	const model = await nsfwjs.load();

	// Phân loại ảnh
	const predictions = await model.classify(imageTensor);

	// Giải phóng tensor để tránh rò rỉ bộ nhớ
	imageTensor.dispose();

	// In kết quả
	console.log('\n📊 Kết quả phân tích:');
	console.log('------------------------');

	// Kiểm tra các loại nội dung không phù hợp
	const nsfwCategories = ['Porn', 'Hentai', 'Sexy'];
	const nsfwResults = predictions.filter(
		(p) => nsfwCategories.includes(p.className) && p.probability > 0.7,
	);

	if (nsfwResults.length > 0) {
		console.log('❌ Ảnh không phù hợp!');
		console.log('\n🔍 Chi tiết phát hiện:');
		nsfwResults.forEach((cat) => {
			console.log(
				`- ${cat.className}: ${(cat.probability * 100).toFixed(2)}%`,
			);
		});
	} else {
		console.log('✅ Ảnh hợp lệ');
	}

	console.log('\n📈 Phân tích chi tiết:');
	predictions.forEach((p) => {
		console.log(`- ${p.className}: ${(p.probability * 100).toFixed(2)}%`);
	});
} catch (error) {
	if (error.code === 'ENOENT') {
		console.error(
			'❌ Lỗi: Không tìm thấy file ảnh tại đường dẫn:',
			imagePath,
		);
	} else {
		console.error('❌ Lỗi:', error.message);
	}
}
