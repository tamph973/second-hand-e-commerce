export default function convertDate(date) {
	if (!date) return 'Không xác định';

	const d = new Date(date);
	if (isNaN(d.getTime())) return 'Không xác định';

	return d.toLocaleString('vi-VN', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	});
}
