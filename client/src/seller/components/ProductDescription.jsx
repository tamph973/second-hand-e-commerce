/* eslint-disable react/prop-types */
import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

const MAX_LENGTH = 1500;
const PLACEHOLDER = `- Xuất xứ, tình trạng hàng hoá/sản phẩm
- Thời gian sử dụng
- Bảo hành nếu có
- Sửa chữa, nâng cấp, phụ kiện đi kèm`;

const ProductDescription = ({ description, setDescription }) => {
	return (
		<div className='mb-4'>
			<label className='block mb-2 text-sm font-medium text-textPrimary'>
				Mô tả chi tiết <span style={{ color: 'red' }}>*</span>
			</label>
			<TextareaAutosize
				className='w-full border rounded px-3 py-2 text-base text-textPrimary focus:outline-none focus:ring-2 focus:ring-blue-400'
				minRows={5}
				maxRows={12}
				placeholder={PLACEHOLDER}
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				maxLength={MAX_LENGTH}
			/>
			<div className='text-xs text-gray-500 mt-1'>
				{description.length}/{MAX_LENGTH} kí tự
			</div>
		</div>
	);
};

export default ProductDescription;
