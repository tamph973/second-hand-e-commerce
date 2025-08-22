import cron from 'node-cron';
import { releaseSellerEscrowByOrder } from '../services/payment.service.js';

let escrowJob = null; // Biến lưu trữ tham chiếu cron job

export const startReleaseEscrowJob = () => {
	// Kiểm tra nếu job đang chạy thì không tạo mới
	if (escrowJob) {
		console.log('Cron job đã được khởi chạy trước đó');
		return;
	}

	// Lưu tham chiếu cron job vào biến escrowJob
	// Mỗi 1 phút kiểm tra 1 lần
	escrowJob = cron.schedule(
		'* * * * *',
		async () => {
			console.log('Cron Job: Đang kiểm tra giải ngân tự động...');
			const payments = await releaseSellerEscrowByOrder();
			if (!payments || payments.length === 0) {
				console.log('Cron Job: Hoàn tất giải ngân ✅✅✅');
				return;
			}
			console.log('Cron Job: Đã giải ngân cho người bán');
		},
		{
			scheduled: true,
			timezone: 'Asia/Ho_Chi_Minh', // Thiết lập múi giờ Việt Nam
		},
	);

	console.log('✅ Đã khởi động cron job giải ngân tự động');
};

// Hàm dừng cron job
export const stopReleaseEscrowJob = () => {
	if (escrowJob) {
		escrowJob.stop();
		escrowJob = null;
		console.log('Đã dừng cron job giải ngân tự động ❌❌❌');
	} else {
		console.log('Không có cron job nào đang chạy ❌❌❌');
	}
};

// Hàm kiểm tra trạng thái cron job
export const isEscrowJobRunning = () => {
	return escrowJob !== null;
};
