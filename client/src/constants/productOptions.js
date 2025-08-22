// Các lựa chọn dùng cho form đăng bán sản phẩm

export const CONDITION_OPTIONS = [
	{
		value: 'NEW',
		label: 'Mới',
		title: 'Hàng mới kèm mác, chưa mở hộp/bao bì, chưa qua sử dụng',
	},
	{
		value: 'LIKE_NEW',
		label: 'Như mới',
		title: 'Hàng mới kèm mác, đã mở bao bì/hộp, chưa qua sử dụng.',
	},
	{
		value: 'GOOD',
		label: 'Tốt',
		title: 'Đã qua sử dụng, tính năng đầy đủ, hoạt động tốt (có thể có vài vết xước nhỏ)',
	},
	{
		value: 'FAIR',
		label: 'Trung bình',
		title: 'Hàng đã qua sử dụng, đầy đủ chức năng, nhiều sai sót hoặc lỗi nhỏ.',
	},
	{
		value: 'POOR',
		label: 'Kém',
		title: 'Hàng đã qua sử dụng, nhiều sai sót, có thể bị hỏng.',
	},
];

export const ACCOUNT_TYPE_OPTIONS = [
	{ value: 'personal', label: 'Cá nhân' },
	{ value: 'business', label: 'Bán chuyên' },
];

export const COLOR_OPTIONS = [
	// Màu cơ bản
	{ value: 'black', label: 'Đen', color: '#000000' },
	{ value: 'white', label: 'Trắng', color: '#F5F5F5' },
	{ value: 'gray', label: 'Xám', color: '#808080' },
	{ value: 'silver', label: 'Bạc', color: '#C0C0C0' },

	// Màu đỏ và hồng
	{ value: 'red', label: 'Đỏ', color: '#FF0000' },
	{ value: 'dark-red', label: 'Đỏ đậm', color: '#8B0000' },
	{ value: 'pink', label: 'Hồng', color: '#FF69B4' },
	{ value: 'hot-pink', label: 'Hồng đậm', color: '#FF1493' },
	{ value: 'rose', label: 'Hồng nhạt', color: '#FFB6C1' },

	// Màu cam và vàng
	{ value: 'orange', label: 'Cam', color: '#FFA500' },
	{ value: 'dark-orange', label: 'Cam đậm', color: '#FF8C00' },
	{ value: 'yellow', label: 'Vàng', color: '#FFD700' },
	{ value: 'gold', label: 'Vàng kim', color: '#FFD700' },
	{ value: 'cream', label: 'Kem', color: '#FFF8DC' },

	// Màu xanh lá
	{ value: 'green', label: 'Xanh lá', color: '#32CD32' },
	{ value: 'dark-green', label: 'Xanh lá đậm', color: '#006400' },
	{ value: 'olive', label: 'Xanh ô liu', color: '#808000' },
	{ value: 'mint', label: 'Xanh bạc hà', color: '#98FB98' },
	{ value: 'forest', label: 'Xanh rừng', color: '#228B22' },

	// Màu xanh dương
	{ value: 'blue', label: 'Xanh dương', color: '#0000FF' },
	{ value: 'navy', label: 'Xanh navy', color: '#000080' },
	{ value: 'sky-blue', label: 'Xanh bầu trời', color: '#87CEEB' },
	{ value: 'royal-blue', label: 'Xanh hoàng gia', color: '#4169E1' },
	{ value: 'turquoise', label: 'Xanh ngọc', color: '#40E0D0' },

	// Màu tím
	{ value: 'purple', label: 'Tím', color: '#800080' },
	{ value: 'violet', label: 'Tím nhạt', color: '#EE82EE' },
	{ value: 'lavender', label: 'Tím oải hương', color: '#E6E6FA' },
	{ value: 'plum', label: 'Tím mận', color: '#DDA0DD' },

	// Màu nâu và be
	{ value: 'brown', label: 'Nâu', color: '#A52A2A' },
	{ value: 'tan', label: 'Nâu nhạt', color: '#D2B48C' },
	{ value: 'beige', label: 'Be', color: '#F5F5DC' },
	{ value: 'khaki', label: 'Khaki', color: '#F0E68C' },
	{ value: 'camel', label: 'Camel', color: '#C19A6B' },

	// Màu đặc biệt
	{ value: 'burgundy', label: 'Burgundy', color: '#800020' },
	{ value: 'maroon', label: 'Maroon', color: '#800000' },
	{ value: 'coral', label: 'San hô', color: '#FF7F50' },
	{ value: 'salmon', label: 'Cá hồi', color: '#FA8072' },
	{ value: 'peach', label: 'Đào', color: '#FFCBA4' },
	{ value: 'lime', label: 'Chanh', color: '#32CD32' },
	{ value: 'teal', label: 'Xanh ngọc đậm', color: '#008080' },
	{ value: 'indigo', label: 'Chàm', color: '#4B0082' },
	{ value: 'magenta', label: 'Đỏ tươi', color: '#FF00FF' },
	{ value: 'fuchsia', label: 'Fuchsia', color: '#FF00FF' },

	// Màu kim loại
	{ value: 'gold-metal', label: 'Vàng kim loại', color: '#DAA520' },
	{ value: 'silver-metal', label: 'Bạc kim loại', color: '#C0C0C0' },
	{ value: 'bronze', label: 'Đồng', color: '#CD7F32' },
	{ value: 'copper', label: 'Đồng đỏ', color: '#B87333' },

	// Màu gradient và đặc biệt
	{ value: 'rainbow', label: 'Cầu vồng', color: '#FF6B6B' },
	{ value: 'transparent', label: 'Trong suốt', color: '#E8E8E8' },
	{ value: 'multi-color', label: 'Nhiều màu', color: '#FFD700' },
	{ value: 'other', label: 'Khác', color: '#888888' },
];

export const getColorLabel = (value) => {
	const found = COLOR_OPTIONS.find((opt) => opt.value === value);
	return found ? found.label : value;
};

export const ATTRIBUTE_OPTIONS = [
	{ value: 'size', label: 'Kích thước' },
	{ value: 'type', label: 'Loại' },
	{ value: 'capacity', label: 'Dung lượng' },
	{ value: 'material', label: 'Chất liệu' },
];

export const CAPACITY_OPTIONS = [
	{ value: '<8GB', label: '<8GB' },
	{ value: '8GB', label: '8GB' },
	{ value: '16GB', label: '16GB' },
	{ value: '32GB', label: '32GB' },
	{ value: '64GB', label: '64GB' },
	{ value: '128GB', label: '128GB' },
	{ value: '256GB', label: '256GB' },
	{ value: '512GB', label: '512GB' },
	{ value: '1TB', label: '1TB' },
	{ value: '2TB', label: '2TB' },
	{ value: '>2TB', label: '> 2TB' },
];

export const WARRANTY_OPTIONS = [
	{ value: 'no_warranty', label: 'Không bảo hành' },
	{ value: '1month', label: '1 tháng' },
	{ value: '3month', label: '3 tháng' },
	{ value: '6month', label: '6 tháng' },
	{ value: '12month', label: '12 tháng' },
	{ value: '>12', label: '> 12 tháng' },
	{ value: 'warranty', label: 'Còn bảo hành' },
];

export const ORIGIN_OPTIONS = [
	{ value: 'VN', label: 'Việt Nam', default: true }, // default hiển thị đầu tiên
	{ value: 'US', label: 'Mỹ' },
	{ value: 'JP', label: 'Nhật' },
	{ value: 'CN', label: 'Trung Quốc' },
	{ value: 'KR', label: 'Hàn Quốc' },
	{ value: 'TH', label: 'Thái Lan' },
	{ value: 'MY', label: 'Malaysia' },
	{ value: 'SG', label: 'Singapore' },
	{ value: 'ID', label: 'Indonesia' },
	{ value: 'PH', label: 'Philippines' },
	{ value: 'VN', label: 'Việt Nam' },
	{ value: 'other', label: 'Khác' },
];

export const RAM_OPTIONS = [
	{ value: '1GB', label: '1GB' },
	{ value: '2GB', label: '2GB' },
	{ value: '4GB', label: '4GB' },
	{ value: '6GB', label: '6GB' },
	{ value: '8GB', label: '8GB' },
	{ value: '12GB', label: '12GB' },
	{ value: '16GB', label: '16GB' },
	{ value: '32GB', label: '32GB' },
];

// Cửa máy giặt
export const WASHING_MACHINE_DOOR_OPTIONS = [
	{ value: 'front', label: 'Cửa trước (lồng ngang)' },
	{ value: 'top', label: 'Cửa trên (lồng đứng)' },
];

// Khối lượng giặt
export const WASHING_MACHINE_CAPACITY_OPTIONS = [
	{ value: '<8kg', label: '< 8kg' },
	{ value: '8kg', label: '8kg' },
	{ value: '9kg', label: '9kg' },
	{ value: '9.5kg', label: '9.5kg' },
	{ value: '10kg', label: '10kg' },
	{ value: '10.5kg', label: '10.5kg' },
];

// Kích thước màn hình tablet
export const TABLET_SCREEN_SIZE_OPTIONS = [
	{ value: '<7inch', label: '< 7 inch' },
	{ value: '7_7.9inch', label: '7 - 7.9 inch' },
	{ value: '8_8.9inch', label: '8 - 8.9 inch' },
	{ value: '9_9.9inch', label: '9 - 9.9 inch' },
	{ value: '10_10.9inch', label: '10 - 10.9 inch' },
	{ value: '>10.9inch', label: '> 10.9 inch' },
];

// Dung tích tủ lạnh
export const REFRIGERATOR_CAPACITY_OPTIONS = [
	{ value: '<150L', label: '< 150 lít' },
	{ value: '150-300L', label: '150-300 lít' },
	{ value: '300-400L', label: '300 -400 lít' },
	{ value: '400-550L', label: '400 -550 lít' },
	{ value: '>550L', label: '> 550 lít' },
];

export const VARIANT_OPTIONS = [
	{
		label: 'Màu sắc',
		value: 'color',
		options: [
			{ label: 'Đỏ', value: 'red' },
			{ label: 'Xanh', value: 'blue' },
			{ label: 'Vàng', value: 'yellow' },
			// ...
		],
	},
	{
		label: 'Kích thước',
		value: 'size',
		options: [
			{ label: 'S', value: 'S' },
			{ label: 'M', value: 'M' },
			{ label: 'L', value: 'L' },
			{ label: 'XL', value: 'XL' },
			// ...
		],
	},
	// ... các bộ chọn khác
];

export const SIZE_OPTIONS = [
	{ value: 'S', label: 'S' },
	{ value: 'M', label: 'M' },
	{ value: 'L', label: 'L' },
	{ value: 'XL', label: 'XL' },
	{ value: 'XXL', label: 'XXL' },
	{ value: 'XXXL', label: 'XXXL' },
];

export const MATERIAL_OPTIONS = [
	{ value: 'cotton', label: 'Bông' },
	{ value: 'polyester', label: 'Polyester' },
	{ value: 'silk', label: 'Tơ tằm' },
	{ value: 'leather', label: 'Da' },
	{ value: 'nylon', label: 'Nilon' },
	{ value: 'wool', label: 'Len' },
	{ value: 'cashmere', label: 'Kem' },
	{ value: 'fur', label: 'Fur' },
	{ value: 'denim', label: 'Denim' },
	{ value: 'other', label: 'Khác' },
];

export const ATTRIBUTE_LABELS = {
	color: 'Màu sắc',
	size: 'Kích thước',
	brand: 'Thương hiệu',
	capacity: 'Dung lượng',
	material: 'Chất liệu',
	ram: 'RAM',
	screen_size: 'Kích thước màn hình',
	model: 'Dòng sản phẩm',
	cpu: 'CPU',
	storage: 'Bộ nhớ',
	gpu: 'GPU',
	storage_type: 'Loại bộ nhớ',
	type_speaker: 'Loại loa',
	power: 'Công suất âm thanh',
	weight: 'Khối lượng',
	origin: 'Xuất xứ',
	type_accessory: 'Loại phụ kiện',
	device: 'Thiết bị',
	capacity_refrigerator: 'Dung tích tủ lạnh',
	capacity_air_conditioner: 'Công suất điều hòa',
	door: 'Cửa máy giặt',
	capacity_washing_machine: 'Khối lượng giặt',

	// Thêm các key khác nếu cần
};

export const ORDER_STATUS_OPTIONS = [
	{ label: 'Tất cả', value: 'ALL' },
	{ label: 'Chờ xác nhận', value: 'PENDING' },
	{ label: 'Đã xác nhận', value: 'CONFIRMED' },
	{ label: 'Đang xử lý', value: 'PROCESSING' },
	{ label: 'Đang vận chuyển', value: 'SHIPPING' },
	{ label: 'Đánh giá', value: 'REVIEW' },
	{ label: 'Khiếu nại', value: 'COMPLAINT' },
	{ label: 'Đơn bị huỷ', value: 'CANCELLED' },
	{ label: 'Đã vận chuyển', value: 'DELIVERED' },
	{ label: 'Hoàn thành', value: 'COMPLETED' },
];

export const PRODUCT_STATUS_OPTIONS = [
	{ label: 'Tất cả', value: 'ALL' },
	{ label: 'Chờ duyệt', value: 'PENDING' },
	{ label: 'Đã duyệt', value: 'APPROVED' },
	{ label: 'Đã từ chối', value: 'REJECTED' },
	{ label: 'Tạm dừng', value: 'INACTIVE' },
	{ label: 'Đang bán', value: 'ACTIVE' },
];

export const AIR_CONDITIONER_CAPACITY_OPTIONS = [
	{ value: '1HP', label: '1 HP (ngựa)' },
	{ value: '1.5HP', label: '1.5 HP (ngựa)' },
	{ value: '2HP', label: '2 HP (ngựa)' },
	{ value: '2.5HP', label: '2.5 HP (ngựa)' },
	{ value: '3HP', label: '3 HP (ngựa)' },
];

export const SORT_BY_OPTIONS = [
	{ value: 'createdAtDesc', label: 'Mới nhất' },
	{ value: 'createdAtAsc', label: 'Cũ nhất' },
	{ value: 'priceDesc', label: 'Giá cao nhất' },
	{ value: 'priceAsc', label: 'Giá thấp nhất' },
	{ value: 'nameAsc', label: 'Tên A-Z' },
	{ value: 'nameDesc', label: 'Tên Z-A' },
];
