import { FaTh } from 'react-icons/fa';

const categoryItems = [
	{
		key: 'all',
		label: 'Tất cả danh mục',
		icon: <FaTh className='inline mr-1' />,
		subcategories: [
			'Sách',
			'Đồ cho nam',
			'Thời trang nữ',
			'Đồ làm đẹp',
			'Đồ cho mẹ và bé',
			'Đồ chơi & trò chơi',
			'Đồ dùng nhà cửa',
		],
	},
	{
		key: 'book',
		label: 'Sách',
		subcategories: [
			'Sách văn học',
			'Sách kinh tế',
			'Sách tiếng Anh',
			'Sách kỹ năng sống',
			'Sách giáo khoa - giáo trình',
			'Sách học ngoại ngữ',
			'Sách kỹ năng - thành công',
			'Sách thiếu nhi',
			'Sách tôn giáo - tâm linh',
			'Sách châm ngôn - pháp lý',
		],
	},
	{
		key: 'male',
		label: 'Đồ cho nam',
		subcategories: [
			'Áo thun nam',
			'Quần jeans nam',
			'Giày thể thao nam',
			'Đồng hồ nam',
			'Ví da nam',
			'Nước hoa nam',
		],
	},
	{
		key: 'female',
		label: 'Thời trang nữ',
		subcategories: [
			'Đầm nữ',
			'Áo sơ mi nữ',
			'Quần legging',
			'Giày cao gót',
			'Túi xách nữ',
		],
	},
	{
		key: 'beauty',
		label: 'Đồ làm đẹp',
		subcategories: [
			'Son môi',
			'Kem dưỡng da',
			'Mỹ phẩm trang điểm',
			'Nước hoa nữ',
		],
	},
	{
		key: 'mom',
		label: 'Đồ cho mẹ và bé',
		subcategories: [
			'Quần áo trẻ em',
			'Bỉm tã',
			'Sữa bột',
			'Đồ chơi trẻ em',
		],
	},
	{
		key: 'toy',
		label: 'Đồ chơi & trò chơi',
		subcategories: ['Lego', 'Búp bê', 'Xe đồ chơi', 'Trò chơi bảng'],
	},
	{
		key: 'home',
		label: 'Đồ dùng nhà cửa',
		subcategories: [
			'Nồi cơm điện',
			'Máy giặt',
			'Chăn ga gối đệm',
			'Đèn trang trí',
		],
	},
	{
		key: 'electronic',
		label: 'Thiết bị điện tử',
		subcategories: [
			'Điện thoại',
			'Máy tính bảng',
			'Laptop',
			'Máy tính bàn',
			'Tai nghe',
			'Smartwatch',
		],
	},
	{
		key: 'office',
		label: 'Đồ văn phòng',
		subcategories: ['Bút viết', 'Vở ghi', 'Máy in', 'Ghế văn phòng'],
	},
];

export default categoryItems;
