import { AIR_CONDITIONER_CAPACITY_OPTIONS, CAPACITY_OPTIONS, RAM_OPTIONS, REFRIGERATOR_CAPACITY_OPTIONS, TABLET_SCREEN_SIZE_OPTIONS, WASHING_MACHINE_CAPACITY_OPTIONS, WASHING_MACHINE_DOOR_OPTIONS } from './productOptions';

export const productCateFields = {
	categories: {
		'Điện thoại': {
			fields: [
				{
					id: 'dien-thoai-dung-luong',
					name: 'capacity',
					label: 'Dung lượng',
					type: 'select',
					required: true,
					placeholder: 'Chọn dung lượng',
					options: CAPACITY_OPTIONS,
				},
				{
					id: 'dien-thoai-ram',
					name: 'ram',
					label: 'RAM',
					type: 'select',
					required: true,
					placeholder: 'Chọn RAM',
					options: RAM_OPTIONS,
				},
			],
		},
		'Máy tính bảng': {
			fields: [
				// {
				// 	id: 'may-tinh-bang-dong-may',
				// 	name: 'model',
				// 	label: 'Dòng máy',
				// 	type: 'select',
				// 	required: true,
				// 	placeholder: 'Chọn dòng máy',
				// },
				{
					id: 'may-tinh-bang-dung-luong',
					name: 'capacity',
					label: 'Dung lượng',
					type: 'select',
					required: true,
					placeholder: 'Chọn dung lượng',
					options: CAPACITY_OPTIONS,
				},
				{
					id: 'may-tinh-bang-ram',
					name: 'ram',
					label: 'RAM',
					type: 'select',
					required: true,
					placeholder: 'Chọn RAM',
					options: RAM_OPTIONS,
				},
				{
					id: 'may-tinh-bang-kich-thuoc-man-hinh',
					name: 'screen_size',
					label: 'Kích thước màn hình',
					type: 'select',
					required: true,
					placeholder: 'Chọn kích thước màn hình',
					options: TABLET_SCREEN_SIZE_OPTIONS,
				},
			],
		},
		Laptop: {
			fields: [
				{
					id: 'laptop-dong-may',
					name: 'model',
					label: 'Dòng máy',
					type: 'select',
					required: true,
					placeholder: 'Chọn dòng máy',
				},
				{
					id: 'laptop-bo-vi-xu-ly',
					name: 'cpu',
					label: 'Bộ vi xử lý',
					type: 'select',
					required: true,
					placeholder: 'Chọn bộ vi xử lý',
				},
				{
					id: 'laptop-ram',
					name: 'ram',
					label: 'RAM',
					type: 'select',
					required: true,
					placeholder: 'Chọn RAM',
				},
				{
					id: 'laptop-o-cung',
					name: 'storage',
					label: 'Ổ cứng',
					type: 'select',
					required: true,
					placeholder: 'Chọn ổ cứng',
				},
				{
					id: 'laptop-loai-o-cung',
					name: 'storage_type',
					label: 'Loại ổ cứng',
					type: 'select',
					required: true,
					placeholder: 'Chọn loại ổ cứng',
				},
				{
					id: 'laptop-card-man-hinh',
					name: 'gpu',
					label: 'Card màn hình',
					type: 'select',
					required: true,
					placeholder: 'Chọn card màn hình',
				},
				{
					id: 'laptop-kich-thuoc-man-hinh',
					name: 'screen_size',
					label: 'Kích thước màn hình',
					type: 'select',
					required: true,
					placeholder: 'Chọn kích thước màn hình',
				},
			],
		},
		'Máy tính bàn': {
			fields: [
				{
					id: 'may-tinh-ban-bo-vi-xu-ly',
					name: 'cpu',
					label: 'Bộ vi xử lý',
					type: 'select',
					required: true,
					placeholder: 'Chọn bộ vi xử lý',
				},
				{
					id: 'may-tinh-ban-ram',
					name: 'ram',
					label: 'RAM',
					type: 'select',
					required: true,
					placeholder: 'Chọn RAM',
				},
				{
					id: 'may-tinh-ban-o-cung',
					name: 'storage',
					label: 'Ổ cứng',
					type: 'select',
					required: true,
					placeholder: 'Chọn ổ cứng',
				},
				{
					id: 'may-tinh-ban-loai-o-cung',
					name: 'storage_type',
					label: 'Loại ổ cứng',
					type: 'select',
					required: true,
					placeholder: 'Chọn loại ổ cứng',
				},
				{
					id: 'may-tinh-ban-card-man-hinh',
					name: 'gpu',
					label: 'Card màn hình',
					type: 'select',
					required: true,
					placeholder: 'Chọn card màn hình',
				},
				{
					id: 'may-tinh-ban-kich-thuoc-man-hinh',
					name: 'screen_size',
					label: 'Kích thước màn hình',
					type: 'select',
					required: true,
					placeholder: 'Chọn kích thước màn hình',
				},
			],
		},
		'Máy ảnh, máy quay phim': {
			fields: [
				{
					id: 'may-anh-hang',
					name: 'brand',
					label: 'Hãng',
					type: 'select',
					required: true,
					placeholder: 'Chọn hãng',
				},
			],
		},
		Tivi: {
			fields: [
				{
					id: 'tivi-kich-thuoc-man-hinh',
					name: 'screen_size',
					label: 'Kích thước màn hình',
					type: 'select',
					required: true,
					placeholder: 'Chọn kích thước màn hình',
				},
			],
		},
		Loa: {
			fields: [
				{
					id: 'loa-loai-loa',
					name: 'type_speaker',
					label: 'Loại loa',
					type: 'select',
					required: true,
					placeholder: 'Chọn loại loa',
				},
				{
					id: 'loa-cong-suat-am-thanh',
					name: 'power',
					label: 'Công suất âm thanh',
					type: 'select',
					required: false,
					placeholder: 'Chọn công suất âm thanh',
				},
			],
		},
		Amply: {
			fields: [
				{
					id: 'amply-loai-loa',
					name: 'Loại loa',
					label: 'Loại loa',
					type: 'select',
					required: true,
					placeholder: 'Chọn loại loa',
				},
				{
					id: 'amply-cong-suat',
					name: 'power',
					label: 'Công suất',
					type: 'select',
					required: false,
					placeholder: 'Chọn công suất',
				},
			],
		},
		'Phụ kiện': {
			fields: [
				{
					id: 'phu-kien-loai-phu-kien',
					name: 'type_accessory',
					label: 'Loại phụ kiện',
					type: 'select',
					required: true,
					placeholder: 'Chọn loại phụ kiện',
				},
				{
					id: 'phu-kien-thiet-bi',
					name: 'device',
					label: 'Thiết bị',
					type: 'select',
					required: true,
					placeholder: 'Chọn thiết bị',
				},
			],
		},
		'Tủ lạnh': {
			fields: [
				{
					id: 'tu-lanh-dung-tich',
					name: 'capacity_refrigerator',
					label: 'Dung tích',
					type: 'select',
					required: true,
					placeholder: 'Chọn dung tích',
					options: REFRIGERATOR_CAPACITY_OPTIONS,
				},
			],
		},
		'Máy lạnh, điều hòa': {
			fields: [
				{
					id: 'may-lanh-cong-suat',
					name: 'capacity_air_conditioner',
					label: 'Công suất',
					type: 'select',
					required: true,
					placeholder: 'Chọn công suất',
					options: AIR_CONDITIONER_CAPACITY_OPTIONS,
				},
			],
		},
		'Máy giặt': {
			fields: [
				{
					id: 'may-giat-cua-may-giat',
					name: 'door',
					label: 'Cửa máy giặt',
					type: 'select',
					required: true,
					placeholder: 'Chọn cửa máy giặt',
					options: WASHING_MACHINE_DOOR_OPTIONS,
				},
				{
					id: 'may-giat-khoi-luong-giat',
					name: 'capacity_washing_machine',
					label: 'Khối lượng giặt',
					type: 'select',
					required: true,
					placeholder: 'Chọn khối lượng giặt',
					options: WASHING_MACHINE_CAPACITY_OPTIONS,
				},
			],
		},
		'Bàn ghế': {
			fields: [
				{
					id: 'ban-ghe-loai-ban-ghe',
					name: 'type',
					label: 'Loại bàn, ghế',
					type: 'select',
					required: true,
					placeholder: 'Chọn loại bàn, ghế',
				},
				{
					id: 'ban-ghe-chat-lieu',
					name: 'material',
					label: 'Chất liệu',
					type: 'select',
					required: true,
					placeholder: 'Chọn chất liệu',
				},
			],
		},
		'Tủ, kệ': {
			fields: [
				{
					id: 'tu-ke-loai-tu-ke',
					name: 'type',
					label: 'Loại tủ, kệ',
					type: 'select',
					required: true,
					placeholder: 'Chọn loại tủ, kệ',
				},
				{
					id: 'tu-ke-chat-lieu',
					name: 'material',
					label: 'Chất liệu',
					type: 'select',
					required: true,
					placeholder: 'Chọn chất liệu',
				},
			],
		},
		Quạt: {
			fields: [
				{
					id: 'quat-loai-quat',
					name: 'type',
					label: 'Loại quạt',
					type: 'select',
					required: true,
					placeholder: 'Chọn loại quạt',
				},
			],
		},
		Đèn: {
			fields: [
				{
					id: 'den-loai-den',
					name: 'type',
					label: 'Loại đèn',
					type: 'select',
					required: true,
					placeholder: 'Chọn loại đèn',
				},
			],
		},
		'Thời trang': {
			fields: [
				{
					id: 'thoi-trang-loai-san-pham',
					name: 'type',
					label: 'Loại sản phẩm',
					type: 'select',
					required: true,
					placeholder: 'Chọn loại sản phẩm',
				},
			],
		},
	},
};
