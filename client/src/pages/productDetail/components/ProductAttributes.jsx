import React from 'react';
import PropTypes from 'prop-types';
import { productCateFields } from '@/constants/productCateFields';
import * as productOptions from '@/constants/productOptions';

// Hàm lấy label từ value cho từng trường động
function getLabelByValue(fieldName, value) {
	// Ex: color: 'red'
	const optionsMap = {
		color: productOptions.COLOR_OPTIONS,
		warranty: productOptions.WARRANTY_OPTIONS,
		origin: productOptions.ORIGIN_OPTIONS,
		capacity: productOptions.WASHING_MACHINE_CAPACITY_OPTIONS,
		door: productOptions.WASHING_MACHINE_DOOR_OPTIONS,
	};
	const options = optionsMap[fieldName];
	if (options) {
		const found = options.find((opt) => opt.value === value);
		return found ? found.label : value;
	}
	return value;
}

const ProductAttributes = ({
	categoryName = '',
	attributes = {},
	brand,
	color,
	warranty,
	origin,
	condition,
	shippingFee,
}) => {
	const dynamicFields =
		productCateFields.categories[categoryName]?.fields || [];

	return (
		<section className='bg-white rounded-xl p-6 shadow-md border-gray-200 text-textPrimary'>
			<h2 className='font-semibold text-xl text-gray-800 mb-4 border-b border-gray-200 pb-2'>
				Thông tin nổi bật
			</h2>
			<div className='flex flex-col gap-2'>
				<table className='w-full text-sm border-collapse'>
					<tbody>
						{condition && (
							<tr className='border-b border-gray-200'>
								<td className='py-2 text-gray-600 w-1/3'>
									Tình trạng
								</td>
								<td className='py-2 font-medium'>
									{getLabelByValue('condition', condition)}
								</td>
							</tr>
						)}
						{brand && (
							<tr className='border-b border-gray-200'>
								<td className='py-2 text-gray-600 w-1/3'>
									Thương hiệu
								</td>
								<td className='py-2 font-medium'>{brand}</td>
							</tr>
						)}
						{color && (
							<tr className='border-b border-gray-200'>
								<td className='py-2 text-gray-600 w-1/3'>
									Màu sắc
								</td>
								<td className='py-2 font-medium'>
									{getLabelByValue('color', color)}
								</td>
							</tr>
						)}
						{warranty && (
							<tr className='border-b border-gray-200'>
								<td className='py-2 text-gray-600 w-1/3'>
									Chính sách bảo hành
								</td>
								<td className='py-2 font-medium'>
									{getLabelByValue('warranty', warranty)}
								</td>
							</tr>
						)}
						{origin && (
							<tr className='border-b border-gray-200'>
								<td className='py-2 text-gray-600 w-1/3'>
									Xuất xứ
								</td>
								<td className='py-2 font-medium'>
									{getLabelByValue('origin', origin)}
								</td>
							</tr>
						)}
						{shippingFee && (
							<tr className='border-b border-gray-200'>
								<td className='py-2 text-gray-600 w-1/3'>
									Phí vận chuyển
								</td>
								<td className='py-2 font-medium'>
									{shippingFee}
								</td>
							</tr>
						)}
						{dynamicFields.map((field) =>
							attributes[field.name] ? (
								<tr
									key={field.name}
									className='border-b border-gray-200'>
									<td className='py-2 text-gray-600 w-1/3'>
										{field.label}
									</td>
									<td className='py-2 font-medium'>
										{getLabelByValue(
											field.name,
											attributes[field.name],
										)}
									</td>
								</tr>
							) : null,
						)}
					</tbody>
				</table>
			</div>
		</section>
	);
};

ProductAttributes.propTypes = {
	categoryName: PropTypes.string,
	attributes: PropTypes.object,
	brand: PropTypes.string,
	color: PropTypes.string,
	warranty: PropTypes.string,
	origin: PropTypes.string,
	condition: PropTypes.string,
	shippingFee: PropTypes.string,
};

export default ProductAttributes;
