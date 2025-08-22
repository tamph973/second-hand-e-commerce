// Seller Registration Steps
export const sellerRegistrationSteps = [
	{
		key: 'register',
		label: 'Đăng ký',
		number: 1,
		description: 'Đăng ký tài khoản người bán',
	},
	{
		key: 'verifyCCCD',
		label: 'Xác thực CCCD',
		number: 2,
		description: 'Xác minh thông tin căn cước công dân',
	},
	{
		key: 'complete',
		label: 'Hoàn tất',
		number: 3,
		description: 'Hoàn tất quá trình đăng ký',
	},
];

// Order Tracking Steps
export const orderTrackingSteps = [
	{
		key: 'orderPlaced',
		label: 'Order Placed',
		description: 'Đơn hàng đã được đặt',
	},
	{
		key: 'orderConfirmed',
		label: 'Order Confirmed',
		description: 'Đơn hàng đã được xác nhận',
	},
	{
		key: 'preparingShipment',
		label: 'Preparing Shipment',
		description: 'Đang chuẩn bị giao hàng',
	},
	{
		key: 'onTheWay',
		label: 'Order is on the way',
		description: 'Đơn hàng đang được vận chuyển',
	},
	{
		key: 'orderShipped',
		label: 'Order Shipped',
		description: 'Đơn hàng đã được giao',
	},
];

// Checkout Steps
export const checkoutSteps = [
	{
		key: 'cart',
		label: 'Giỏ hàng',
		number: 1,
		description: 'Xem lại sản phẩm trong giỏ hàng',
	},
	{
		key: 'payment',
		label: 'Thanh toán',
		number: 2,
		description: 'Thông tin đặt hàng và thanh toán',
	},
	{
		key: 'confirmation',
		label: 'Xác nhận',
		number: 3,
		description: 'Xác nhận đơn hàng',
	},
];

// Product Creation Steps
export const productCreationSteps = [
	{
		key: 'basicInfo',
		label: 'Thông tin cơ bản',
		number: 1,
		description: 'Nhập thông tin sản phẩm',
	},
	{
		key: 'images',
		label: 'Hình ảnh',
		number: 2,
		description: 'Tải lên hình ảnh sản phẩm',
	},
	{
		key: 'variants',
		label: 'Biến thể',
		number: 3,
		description: 'Thêm biến thể sản phẩm',
	},
	{
		key: 'pricing',
		label: 'Giá cả',
		number: 4,
		description: 'Thiết lập giá và khuyến mãi',
	},
	{
		key: 'publish',
		label: 'Xuất bản',
		number: 5,
		description: 'Kiểm tra và xuất bản sản phẩm',
	},
];

// Account Verification Steps
export const accountVerificationSteps = [
	{
		key: 'personalInfo',
		label: 'Thông tin cá nhân',
		number: 1,
		description: 'Cập nhật thông tin cá nhân',
	},
	{
		key: 'identityVerification',
		label: 'Xác minh danh tính',
		number: 2,
		description: 'Tải lên CCCD/CMT để xác minh',
	},
	{
		key: 'phoneVerification',
		label: 'Xác minh số điện thoại',
		number: 3,
		description: 'Xác minh qua SMS',
	},
	{
		key: 'emailVerification',
		label: 'Xác minh email',
		number: 4,
		description: 'Xác minh qua email',
	},
	{
		key: 'completed',
		label: 'Hoàn tất',
		number: 5,
		description: 'Tài khoản đã được xác minh',
	},
];
