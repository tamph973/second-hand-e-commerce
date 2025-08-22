/* eslint-disable react/prop-types */
import React, { useCallback, useState, useEffect } from 'react';
import {
	ATTRIBUTE_LABELS,
	COLOR_OPTIONS,
	MATERIAL_OPTIONS,
	SIZE_OPTIONS,
} from '@/constants/productOptions';

const ProductVariant = ({ variants = [], onVariantSelect }) => {
	// State để lưu các thuộc tính đã chọn
	const [selectedAttributes, setSelectedAttributes] = useState({});
	const [selectedVariant, setSelectedVariant] = useState(null);

	// Mapping các options arrays
	const OPTIONS_MAPPING = {
		color: COLOR_OPTIONS,
		size: SIZE_OPTIONS,
		material: MATERIAL_OPTIONS,
	};

	// Lấy label cho attribute key
	const getAttributeKeyLabel = (key) => {
		return ATTRIBUTE_LABELS[key] || key; // EX: color => Màu sắc
	};

	// Lấy label cho attribute value
	const getValueAttribute = (key, value) => {
		const options = OPTIONS_MAPPING[key]; // color, size, material
		if (options) {
			return (
				options.find((option) => option.value === value)?.label || value
			);
		}
		return value;
	};

	// Lấy tất cả unique keys từ tất cả variants: color, size, material
	const getAllAttributeKeys = () => {
		const keys = new Set();
		variants.forEach((variant) => {
			if (variant.attributes) {
				Object.keys(variant.attributes).forEach((key) => keys.add(key));
			}
		});
		return Array.from(keys);
	};

	// Lấy tất cả values cho một key cụ thể: color: white, size: M, material: cotton
	const getValuesForAttribute = (attributeKey) => {
		const values = new Set();
		variants.forEach((variant) => {
			if (variant.attributes && variant.attributes[attributeKey]) {
				values.add(variant.attributes[attributeKey]);
			}
		});
		return Array.from(values);
	};

	// Tìm variant phù hợp với các thuộc tính đã chọn
	const findMatchingVariant = useCallback(
		(attributes) => {
			return variants.find((variant) => {
				if (!variant.attributes) return false;
				// Kiểm tra xem variant có khớp với tất cả thuộc tính đã chọn không
				return Object.entries(attributes).every(([key, value]) => {
					return variant.attributes[key] === value;
				});
			});
		},
		[variants],
	);

	// Xử lý khi chọn thuộc tính: EX attributeKey :>>  color, value :>>  black
	const handleAttributeSelect = useCallback((attributeKey, value) => {
		setSelectedAttributes((prev) => {
			const newAttributes = { ...prev };

			// Nếu đã chọn thuộc tính này, bỏ chọn
			if (newAttributes[attributeKey] === value) {
				delete newAttributes[attributeKey];
			} else {
				// Nếu chưa chọn, thêm vào
				newAttributes[attributeKey] = value;
			}

			return newAttributes;
		});
	}, []);

	// Cập nhật selectedVariant khi selectedAttributes thay đổi
	useEffect(() => {
		const matchingVariant = findMatchingVariant(selectedAttributes);
		setSelectedVariant(matchingVariant);

		if (onVariantSelect) {
			onVariantSelect(matchingVariant);
		}
	}, [selectedAttributes, findMatchingVariant, onVariantSelect]);

	// Kiểm tra thuộc tính có được chọn không
	const isAttributeSelected = (attributeKey, value) => {
		return selectedAttributes[attributeKey] === value;
	};

	// Kiểm tra thuộc tính có khả dụng không (có variant phù hợp)
	const isAttributeAvailable = (attributeKey, value) => {
		// Tạo attributes tạm thời để kiểm tra
		const tempAttributes = { ...selectedAttributes, [attributeKey]: value };
		return findMatchingVariant(tempAttributes) !== undefined;
	};

	const attributeKeys = getAllAttributeKeys();

	return (
		<div className='flex flex-col gap-4'>
			{attributeKeys.map((attributeKey) => (
				<div key={attributeKey} className='flex items-center gap-3'>
					<span className='text-sm font-medium text-gray-700 min-w-[80px]'>
						{getAttributeKeyLabel(attributeKey)}:
					</span>
					<div className='flex gap-2'>
						{getValuesForAttribute(attributeKey).map((value) => {
							const isSelected = isAttributeSelected(
								attributeKey,
								value,
							);
							const isAvailable = isAttributeAvailable(
								attributeKey,
								value,
							);

							return (
								// Dành cho màu sắc
								attributeKey === 'color' ? (
									<button
										key={value}
										onClick={() =>
											handleAttributeSelect(
												attributeKey,
												value,
											)
										}
										disabled={!isAvailable}
										className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
											isSelected
												? 'border-blue-500 shadow-md'
												: isAvailable
												? 'border-gray-200 hover:border-gray-300'
												: 'border-gray-100 opacity-50 cursor-not-allowed'
										}`}
										style={{
											backgroundColor: value,
										}}
										title={getValueAttribute(
											attributeKey,
											value,
										)}>
										{/* Hiển thị checkmark cho thuộc tính được chọn */}
										{isSelected && (
											<div className='w-full h-full flex items-center justify-center'>
												<svg
													className='w-4 h-4 text-white'
													fill='currentColor'
													viewBox='0 0 20 20'>
													<path
														fillRule='evenodd'
														d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
														clipRule='evenodd'
													/>
												</svg>
											</div>
										)}
									</button>
								) : (
									<button
										key={value}
										onClick={() =>
											handleAttributeSelect(
												attributeKey,
												value,
											)
										}
										disabled={!isAvailable}
										className={`text-sm px-5 py-1 border-2 rounded-md transition-all duration-200 ${
											isSelected
												? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
												: isAvailable
												? 'border-gray-200 hover:border-gray-300 text-gray-600'
												: 'border-gray-100 text-gray-400 opacity-50 cursor-not-allowed'
										}`}>
										{value}
									</button>
								)
							);
						})}
					</div>
				</div>
			))}

			{/* Hiển thị thông tin variant được chọn */}
			{/* {selectedVariant && (
				<div className='mt-4 p-3 bg-blue-50 rounded-lg'>
					<p className='text-sm font-medium text-blue-800'>
						Variant được chọn: {selectedVariant._id}
					</p>
					<p className='text-sm text-blue-600'>
						Giá: {selectedVariant.price?.toLocaleString()} VNĐ
					</p>
					<p className='text-sm text-blue-600'>
						Stock: {selectedVariant.stock}
					</p>
				</div>
			)} */}
		</div>
	);
};

export default ProductVariant;
