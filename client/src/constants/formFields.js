// Trường đăng ký seller
export const sellerRegisterFields = [
	{
		type: 'text',
		id: 'businessName',
		name: 'businessName',
		label: 'Tên doanh nghiệp/cửa hàng',
		placeholder: 'Nhập tên doanh nghiệp hoặc cửa hàng',
	},
	{
		type: 'text',
		id: 'businessLicense',
		name: 'businessLicense',
		label: 'Số giấy phép kinh doanh',
		placeholder: 'Nhập số giấy phép kinh doanh',
	},
	{
		type: 'text',
		id: 'businessAddress',
		name: 'businessAddress',
		label: 'Địa chỉ kinh doanh',
		placeholder: 'Nhập địa chỉ kinh doanh',
	},
	{
		type: 'text',
		id: 'taxCode',
		name: 'taxCode',
		label: 'Mã số thuế',
		placeholder: 'Nhập mã số thuế',
	},
];

// Trường đăng ký tài khoản
export const registerFields = [
	{
		type: 'text',
		id: 'fullName',
		name: 'fullName',
		label: 'Họ và tên',
		placeholder: 'Họ và tên',
		autoComplete: 'fullName',
	},
	{
		type: 'text',
		id: 'email',
		name: 'email',
		label: 'Email',
		placeholder: 'Email',
		autoComplete: 'email',
	},
	{
		type: 'password',
		id: 'password',
		name: 'password',
		label: 'Mật khẩu',
		placeholder: 'Mật khẩu',
		autoComplete: 'password',
	},
	{
		type: 'password',
		id: 'confirmPassword',
		name: 'confirmPassword',
		label: 'Xác nhận mật khẩu',
		placeholder: 'Xác nhận mật khẩu',
		autoComplete: 'confirmPassword',
	},
];

export const loginFields = [
	{
		type: 'email',
		id: 'email',
		name: 'email',
		label: 'Email',
		placeholder: 'Email',
		autoComplete: 'email',
	},
	{
		type: 'password',
		id: 'password',
		name: 'password',
		label: 'Mật khẩu',
		placeholder: 'Mật khẩu',
		autoComplete: 'password',
	},
];

// Trường thông tin công khai user
export const publicProfileFields = [
	{
		type: 'text',
		id: 'fullName',
		name: 'fullName',
		label: 'Họ và tên',
		placeholder: 'Họ và tên',
		autoComplete: 'fullName',
	},
	{
		type: 'date',
		id: 'dob',
		name: 'dob',
		label: 'Ngày sinh',
		placeholder: 'Ngày sinh',
	},
	{
		type: 'select',
		id: 'gender',
		name: 'gender',
		label: 'Giới tính',
		placeholder: 'Chọn giới tính',
		options: [
			{ label: 'Nam', value: 'MALE' },
			{ label: 'Nữ', value: 'FEMALE' },
			{ label: 'Khác', value: 'OTHER' },
		],
	},
	{
		type: 'textarea',
		id: 'bio',
		name: 'bio',
		label: 'Giới thiệu',
		placeholder: 'Viết vài dòng giới thiệu về bạn...',
		rows: 3,
		maxLength: 200,
	},
	// {
	// 	type: 'text',
	// 	id: 'nickname',
	// 	name: 'nickname',
	// 	label: 'Tên gợi nhớ',
	// 	placeholder: 'https://2ecoc.com/user/ten-goi-nho',
	// 	helper: 'Tên gợi nhớ sau khi được cập nhật sẽ không thể thay đổi trong vòng 60 ngày tới.',
	// },
];

// Trường thông tin riêng tư user
export const privateProfileFields = [
	{
		type: 'email',
		id: 'email',
		name: 'email',
		label: 'Email',
		placeholder: 'Email',
		autoComplete: 'email',
		disabled: false,
	},
	{
		type: 'text',
		id: 'phoneNumber',
		name: 'phoneNumber',
		label: 'Số điện thoại',
		placeholder: 'Số điện thoại',
		autoComplete: 'phoneNumber',
	},
];

// Trường xác minh CCCD
export const cccdVerificationFields = [
	{
		type: 'select',
		id: 'idType',
		name: 'idType',
		label: 'Loại ID',
		placeholder: 'Chọn loại giấy tờ',
		required: true,
		options: [
			{ label: 'ID - CMT/CCCD (Vietnam)', value: 'CCCD' },
			{ label: 'Hộ chiếu', value: 'PASSPORT' },
		],
	},
	{
		type: 'text',
		id: 'cccdNumber',
		name: 'cccdNumber',
		label: 'Mã số',
		placeholder: 'Nhập số CCCD/CMT',
		required: true,
	},
	{
		type: 'text',
		id: 'fullName',
		name: 'fullName',
		label: 'Tên đầy đủ',
		placeholder: 'Nhập họ và tên',
		required: true,
	},
	{
		type: 'date',
		id: 'dob',
		name: 'dob',
		label: 'Ngày sinh',
		placeholder: 'Chọn ngày sinh',
		required: true,
	},
	{
		type: 'text',
		id: 'cccdIssuedPlace',
		name: 'cccdIssuedPlace',
		label: 'Nơi cấp',
		placeholder: 'Nhập nơi cấp',
		required: true,
	},
	{
		type: 'date',
		id: 'cccdIssuedDate',
		name: 'cccdIssuedDate',
		label: 'Ngày cấp',
		placeholder: 'Chọn ngày cấp',
		required: true,
	},
	{
		type: 'date',
		id: 'cccdExpiredDate',
		name: 'cccdExpiredDate',
		label: 'Ngày hết hạn',
		placeholder: 'Chọn ngày hết hạn',
		required: true,
	},
	{
		type: 'imageDropzone',
		id: 'cccdFront',
		name: 'cccdFront',
		label: 'Ảnh mặt trước CCCD',
		placeholder: '',
		required: true,
	},
	{
		type: 'imageDropzone',
		id: 'cccdBack',
		name: 'cccdBack',
		label: 'Ảnh mặt sau CCCD',
		placeholder: '',
		required: true,
	},
	{
		type: 'checkbox',
		id: 'agree',
		name: 'agree',
		label: 'Tôi đồng ý với dịch vụ đăng tin',
		required: true,
		link: {
			label: 'đăng tin',
			href: '/dich-vu-dang-tin',
		},
	},
];

// Trường thông tin sản phẩm
export const productCreateFields = [
	{
		type: 'text',
		id: 'productName',
		name: 'productName',
		label: 'Tên sản phẩm',
		placeholder: 'Nhập tên sản phẩm',
	},
];

// Trường tạo mã giá
export const discountCreateFields = [
	{
		type: 'select',
		id: 'couponType',
		name: 'couponType',
		label: 'Loại phiếu giảm giá',
		placeholder: 'Chọn loại phiếu giảm giá',
		options: [
			{ label: 'Giảm giá trên đơn hàng', value: 'DISCOUNT_ON_PURCHASE' },
			{ label: 'Giảm giá vận chuyển', value: 'DISCOUNT_ON_SHIPPING' },
		],
	},
	{
		type: 'text',
		id: 'title',
		name: 'title',
		label: 'Tên giảm giá',
		placeholder: 'Tên giảm giá',
	},
	{
		type: 'text',
		id: 'code',
		name: 'code',
		label: 'Mã giảm giá',
		placeholder: 'VÍ DỤ: WELCOME10',
	},
	{
		type: 'select',
		id: 'discountType',
		name: 'discountType',
		label: 'Loại giảm giá',
		placeholder: 'Chọn loại giảm giá',
		options: [
			{ label: 'Phần trăm', value: 'PERCENT' },
			{ label: 'Số tiền cố định', value: 'FIXED' },
		],
	},
	{
		type: 'number',
		id: 'amount',
		name: 'amount',
		label: 'Số tiền giảm giá',
		placeholder: 'Số tiền giảm giá',
	},
	{
		type: 'number',
		id: 'minimumPurchase',
		name: 'minimumPurchase',
		label: 'Số tiền tối thiểu để áp dụng',
		placeholder: 'Số tiền tối thiểu để áp dụng',
		helper: 'Số tiền tối thiểu để áp dụng mã giảm giá',
	},
	{
		type: 'number',
		id: 'maximumDiscount',
		name: 'maximumDiscount',
		label: 'Số tiền giảm giá tối đa',
		placeholder: 'Số tiền giảm giá tối đa',
	},
	{
		type: 'number',
		id: 'limitUsage',
		name: 'limitUsage',
		label: 'Số lần sử dụng tối đa',
		placeholder: 'Số lần sử dụng tối đa',
		helper: 'Số lần sử dụng tối đa của mã giảm giá',
	},
	{
		type: 'select',
		id: 'discountScope',
		name: 'discountScope',
		label: 'Phạm vi áp dụng',
		placeholder: 'Chọn phạm vi áp dụng',
		options: [
			{ label: 'Công khai (Tất cả người dùng)', value: 'PUBLIC' },
			{ label: 'Riêng tư (Người dùng cụ thể)', value: 'PRIVATE' },
		],
		helper: 'PUBLIC: Tất cả người dùng có thể sử dụng. PRIVATE: Chỉ người dùng được chỉ định mới sử dụng được.',
	},
	{
		type: 'select',
		id: 'userId',
		name: 'userId',
		label: 'Người dùng',
		placeholder: 'Chọn người dùng',
	},
	{
		type: 'date',
		id: 'startDate',
		name: 'startDate',
		label: 'Ngày bắt đầu',
		placeholder: 'Ngày bắt đầu',
	},
	{
		type: 'date',
		id: 'endDate',
		name: 'endDate',
		label: 'Ngày kết thúc',
		placeholder: 'Ngày kết thúc',
	},
];
