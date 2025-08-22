import * as Yup from 'yup';
import { formatPriceVND } from '@/utils/helpers';

const MIN_PRICE = 10000;

export const productCreateSchema = Yup.object({
	title: Yup.string().required('Vui lòng nhập tiêu đề sản phẩm'),
	description: Yup.string().required('Vui lòng nhập mô tả sản phẩm'),
	brandId: Yup.string().required('Vui lòng chọn thương hiệu'),
	color: Yup.string().required('Vui lòng chọn màu sắc'),
	// warranty: Yup.string().required('Vui lòng chọn thời gian bảo hành'),
	origin: Yup.string().required('Vui lòng chọn nguồn gốc sản phẩm'),
	images: Yup.array().min(1, 'Vui lòng chọn ít nhất 1 ảnh'),
	price: Yup.number()
		.typeError('Giá phải là số')
		.required('Vui lòng nhập giá bán')
		.min(
			MIN_PRICE,
			`Giá quá thấp. Vui lòng nhập giá lớn hơn ${formatPriceVND(MIN_PRICE)}`,
		),
});
