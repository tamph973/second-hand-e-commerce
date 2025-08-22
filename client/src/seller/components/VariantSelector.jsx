import React, { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { generateVariants, validateVariantOptions } from '@/utils/variantUtils';
import PropTypes from 'prop-types';
import ColorSelect from '@/components/form/ColorSelect';
import { COLOR_OPTIONS, ATTRIBUTE_OPTIONS } from '@/constants/productOptions';
import { Switch } from '@headlessui/react';
import CustomInput from '@/components/form/CustomInput';
import isEqual from 'lodash/isEqual';
import { FaCloudUploadAlt, FaPlus } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { MdEdit } from 'react-icons/md';

const VariantSelector = ({
	options = [],
	variants = [],
	onOptionsChange,
	onVariantsChange,
	basePrice = 0,
}) => {
	const [priceStockMap, setPriceStockMap] = useState(new Map());
	const [colorEnabled, setColorEnabled] = useState(false);
	const [selectedColors, setSelectedColors] = useState([]);
	const [attributes, setAttributes] = useState([]);
	const prevOptionsRef = useRef(options);
	const [imageUploads, setImageUploads] = useState({});

	useEffect(() => {
		const newMap = new Map();
		if (variants.length > 0) {
			variants.forEach((item) => {
				newMap.set(item.code, {
					price: item.price || basePrice,
					stock: item.stock || 0,
					isActive: item.isActive !== false,
				});
			});
		}
		setPriceStockMap(newMap);
	}, [variants, basePrice]);

	useEffect(() => {
		const newOptions = [];
		if (colorEnabled && selectedColors.length > 0) {
			newOptions.push({
				name: 'color',
				value: selectedColors.map((color) => color.value),
			});
		}
		attributes.forEach((attr) => {
			if (attr.name && attr.values.length > 0) {
				newOptions.push({
					name: attr.name,
					value: attr.values,
				});
			}
		});
		if (!isEqual(newOptions, prevOptionsRef.current)) {
			prevOptionsRef.current = newOptions;
			onOptionsChange(newOptions);
		}
	}, [colorEnabled, selectedColors, attributes, onOptionsChange]);

	useEffect(() => {
		if (options.length === 0) {
			if (variants.length > 0) onVariantsChange([]);
			return;
		}
		// const validation = validateVariantOptions(options);
		// if (validation.isValid) {
		const newVariants = generateVariants(options, priceStockMap, basePrice);
		// Thêm hình ảnh vào biến thể
		const variantsWithImages = newVariants.map((variant) => {
			// Tìm màu trong biến thể
			const colorCombination = variant.combination.find((item) =>
				COLOR_OPTIONS.some((color) => color.value === item.value),
			); // {name: 'color', value: 'red'

			if (colorCombination && imageUploads[colorCombination.value]) {
				return {
					...variant,
					preview: URL.createObjectURL(
						imageUploads[colorCombination.value],
					),
					images: imageUploads[colorCombination.value],
				};
			}
			return variant;
		});

		if (!isEqual(variantsWithImages, variants))
			onVariantsChange(variantsWithImages);
		// }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [options, imageUploads]);

	const addNewAttribute = useCallback(() => {
		setAttributes([...attributes, { name: '', values: [] }]);
	}, [attributes]);

	const removeAttribute = useCallback(
		(index) => {
			setAttributes(attributes.filter((_, i) => i !== index));
		},
		[attributes],
	);

	const updateAttributeName = useCallback(
		(index, name) => {
			const newAttributes = [...attributes];
			newAttributes[index] = {
				...newAttributes[index],
				name,
				values: [],
			};
			setAttributes(newAttributes);
		},
		[attributes],
	);

	const updateAttributeValues = useCallback(
		(index, values) => {
			const newAttributes = [...attributes];
			newAttributes[index] = {
				...newAttributes[index],
				values: values || [],
			};
			setAttributes(newAttributes);
		},
		[attributes],
	);

	useEffect(() => {
		if (!colorEnabled) setSelectedColors([]);
		if (!colorEnabled) setImageUploads({});
	}, [colorEnabled]);

	const updateVariantPrice = (variantIndex, price) => {
		const newVariants = [...variants];
		newVariants[variantIndex].price = price;
		setPriceStockMap((prev) => {
			const newMap = new Map(prev);
			newMap.set(newVariants[variantIndex].code, {
				price,
				stock: newVariants[variantIndex].stock,
				isActive: newVariants[variantIndex].isActive,
			});
			return newMap;
		});
		onVariantsChange(newVariants);
	};

	const updateVariantStock = (variantIndex, stock) => {
		const newVariants = [...variants];
		newVariants[variantIndex].stock = stock;
		setPriceStockMap((prev) => {
			const newMap = new Map(prev);
			newMap.set(newVariants[variantIndex].code, {
				price: newVariants[variantIndex].price,
				stock,
				isActive: newVariants[variantIndex].isActive,
			});
			return newMap;
		});
		onVariantsChange(newVariants);
	};

	const toggleVariantActive = (variantIndex) => {
		const newVariants = [...variants];
		newVariants[variantIndex].isActive =
			!newVariants[variantIndex].isActive;
		setPriceStockMap((prev) => {
			const newMap = new Map(prev);
			newMap.set(newVariants[variantIndex].code, {
				price: newVariants[variantIndex].price,
				stock: newVariants[variantIndex].stock,
				isActive: newVariants[variantIndex].isActive,
			});
			return newMap;
		});
		onVariantsChange(newVariants);
	};

	const generateSKU = (combination) =>
		combination.map((item) => item.value).join('-');

	// Handle file upload for specific color
	const handleImageUpload = (colorValue, e) => {
		const file = e.target.files[0];
		if (file) {
			setImageUploads((prev) => ({
				...prev,
				[colorValue]: file,
			}));
		}
	};

	const removeImage = (colorValue) => {
		setImageUploads((prev) => {
			const newUploads = { ...prev };
			delete newUploads[colorValue];
			return newUploads;
		});
	};

	return (
		<div className='space-y-6 p-4 bg-gray-50 rounded-lg shadow-md'>
			<h2 className='text-xl font-bold text-gray-800 mb-1'>
				Bộ chọn biến thể sản phẩm
			</h2>
			<div className='grid grid-cols-1 gap-6'>
				{/* Color Section */}
				<div className='p-4 bg-white rounded-lg shadow-sm border border-gray-200'>
					<div className='flex items-center justify-between mb-4'>
						<h3 className='text-lg font-semibold text-gray-800'>
							Màu sắc
						</h3>
						<div className='flex items-center gap-2'>
							{/* Nút thêm mày nếu không có trong danh sách */}
							{/* <button
								type='button'
								className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2'
								onClick={() => setColorEnabled(true)}>
								<FaPlus />
								Thêm màu
							</button> */}
							{/* Switch */}
							<Switch
								checked={colorEnabled}
								onChange={setColorEnabled}
								className={`${
									colorEnabled ? 'bg-blue-600' : 'bg-gray-200'
								} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}>
								<span
									className={`${
										colorEnabled
											? 'translate-x-6'
											: 'translate-x-1'
									} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
								/>
							</Switch>
						</div>
					</div>
					{colorEnabled && (
						<ColorSelect
							selectedColors={selectedColors}
							onChange={setSelectedColors}
							options={COLOR_OPTIONS}
						/>
					)}
				</div>
				{/* Tải ảnh màu sắc */}
				{colorEnabled && selectedColors.length > 0 && (
					<div className='p-4 bg-white rounded-lg shadow-sm border border-gray-200'>
						<div className='flex items-center justify-between mb-4'>
							<h3 className='text-lg font-semibold text-gray-800'>
								Ảnh biến thể
							</h3>
						</div>
						<div className='flex flex-wrap gap-4'>
							{selectedColors.map((color) => (
								<div key={color.value} className='space-y-3'>
									{/* Badge màu và tên màu */}
									<div className='flex items-center gap-2 mb-2'>
										<div
											className='w-5 h-5 rounded-full border-2 border-gray-200 shadow-sm'
											style={{
												backgroundColor: color.color,
											}}
										/>
										<span className='text-sm font-medium text-gray-700'>
											{color.label}
										</span>
									</div>
									<div className='relative'>
										<input
											type='file'
											id={`file-${color.value}`}
											accept='image/*'
											className='hidden'
											onChange={(e) =>
												handleImageUpload(
													color.value,
													e,
												)
											}
										/>
										<label
											htmlFor={`file-${color.value}`}
											className='block w-[120px] h-[120px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200 relative overflow-hidden'>
											{imageUploads[color.value] ? (
												<>
													<img
														src={URL.createObjectURL(
															imageUploads[
																color.value
															],
														)}
														alt={`Image ${color.label}`}
														className='w-full h-full object-cover'
													/>

													<div className='absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center'>
														<div className='w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200'>
															<MdEdit
																size={16}
																className='text-white'
															/>
														</div>
													</div>
													<button
														type='button'
														onClick={(e) => {
															e.preventDefault();
															e.stopPropagation();
															removeImage(
																color.value,
															);
														}}
														className='absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors'>
														<IoClose size={10} />
													</button>
												</>
											) : (
												<div className='flex flex-col items-center justify-center h-full'>
													<div className='relative'>
														<FaCloudUploadAlt className='text-gray-400 w-6 h-6' />
													</div>
													<div className='text-center mt-2'>
														<p className='text-xs font-medium text-blue-600'>
															Click để tải ảnh
														</p>
														<p className='text-xs text-gray-500'>
															Hoặc kéo thả
														</p>
													</div>
												</div>
											)}
										</label>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
				{/* Attributes Section */}
				<div className='p-4 bg-white rounded-lg shadow-sm border border-gray-200'>
					<div className='flex items-center justify-between mb-4'>
						<h3 className='text-lg font-semibold text-gray-800'>
							Thuộc tính khác
						</h3>
						<button
							type='button'
							onClick={addNewAttribute}
							className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2'>
							<FaPlus />
							Thêm thuộc tính
						</button>
					</div>

					{attributes.length === 0 && (
						<p className='text-gray-500 text-sm italic'>
							Chưa có thuộc tính nào được thêm
						</p>
					)}

					{attributes.map((attribute, attrIndex) => (
						<div
							key={attrIndex}
							className='mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50'>
							<div className='flex items-center justify-between mb-3'>
								<h4 className='text-md font-medium text-gray-700'>
									Thuộc tính {attrIndex + 1}
								</h4>
								<button
									type='button'
									onClick={() => removeAttribute(attrIndex)}
									className='text-red-500 hover:text-red-700 text-sm'>
									Xóa thuộc tính
								</button>
							</div>

							<div className='mb-4'>
								<CustomInput
									id={`attribute-${attrIndex}`}
									name={`attribute-${attrIndex}`}
									type='select'
									label='Chọn thuộc tính'
									value={attribute.name}
									onChange={(e) =>
										updateAttributeName(
											attrIndex,
											e.target.value,
										)
									}
									placeholder='Chọn thuộc tính'
									options={ATTRIBUTE_OPTIONS}
									className='w-full rounded-lg'
								/>
							</div>

							{attribute.name && (
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Giá trị thuộc tính
									</label>
									<div className='space-y-2'>
										{attribute.values.map(
											(value, valueIndex) => {
												const attrOption =
													ATTRIBUTE_OPTIONS.find(
														(attr) =>
															attr.value ===
															attribute.name,
													);
												const valueObj =
													attrOption?.options?.find(
														(opt) =>
															opt.value === value,
													) || null;
												return (
													<div
														key={valueIndex}
														className='flex gap-2 items-center'>
														<input
															type='text'
															value={
																valueObj
																	? valueObj.label
																	: value
															}
															onChange={(e) => {
																let newValue =
																	e.target
																		.value;
																let mappedValue =
																	newValue;
																if (
																	attrOption?.options
																) {
																	const found =
																		attrOption.options.find(
																			(
																				opt,
																			) =>
																				opt.label ===
																				newValue,
																		);
																	if (found)
																		mappedValue =
																			found.value;
																}
																const newValues =
																	[
																		...attribute.values,
																	];
																newValues[
																	valueIndex
																] = mappedValue;
																updateAttributeValues(
																	attrIndex,
																	newValues,
																);
															}}
															placeholder={`Giá trị ${
																valueIndex + 1
															}`}
															className='flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none text-textPrimary'
														/>
														<button
															type='button'
															onClick={() => {
																const newValues =
																	attribute.values.filter(
																		(
																			_,
																			i,
																		) =>
																			i !==
																			valueIndex,
																	);
																updateAttributeValues(
																	attrIndex,
																	newValues,
																);
															}}
															className='px-3 py-2 text-red-500 hover:text-red-700'>
															Xóa
														</button>
													</div>
												);
											},
										)}
										<button
											type='button'
											onClick={() => {
												updateAttributeValues(
													attrIndex,
													[...attribute.values, ''],
												);
											}}
											className='text-blue-600 hover:text-blue-800 text-sm font-medium'>
											+ Thêm giá trị
										</button>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			</div>
			{variants.length > 0 && (
				<div className='p-4 bg-white rounded-lg shadow-sm border border-gray-200 mt-6'>
					<h3 className='text-lg font-semibold text-gray-800 mb-4'>
						Biến thể sản phẩm ({variants.length} biến thể)
					</h3>
					<div className='overflow-x-auto'>
						<table className='w-full min-w-[600px]'>
							<thead>
								<tr className='bg-gray-100 border-b border-gray-200'>
									<th className='text-left py-3 px-4 font-medium text-gray-700'>
										SL
									</th>
									<th className='text-left py-3 px-4 font-medium text-gray-700'>
										Hình ảnh
									</th>
									<th className='text-left py-3 px-4 font-medium text-gray-700'>
										Biến thể
									</th>
									<th className='text-center py-3 px-4 font-medium text-gray-700 w-[200px]'>
										Giá (₫)
									</th>
									<th className='text-center py-3 px-4 font-medium text-gray-700'>
										SKU
									</th>
									<th className='text-center py-3 px-4 font-medium text-gray-700'>
										Tồn kho
									</th>
								</tr>
							</thead>
							<tbody>
								{variants.map((variant, index) => (
									<tr
										key={index}
										className={`border-b border-gray-200 ${
											!variant.isActive
												? 'bg-gray-50'
												: ''
										}`}>
										<td className='py-3 px-4 text-gray-800'>
											{index + 1}
										</td>
										<td className='py-3 px-4'>
											{variant.preview ? (
												<div className='relative'>
													<img
														src={variant.preview}
														alt={`Variant ${
															index + 1
														}`}
														className='w-16 h-16 object-cover rounded-lg border border-gray-200'
													/>
													{!variant.isActive && (
														<div className='absolute inset-0 bg-gray-400 bg-opacity-50 rounded-lg flex items-center justify-center'>
															<span className='text-white text-xs font-medium'>
																Ẩn
															</span>
														</div>
													)}
												</div>
											) : (
												<div className='w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center'>
													<span className='text-gray-400 text-xs'>
														Chưa có ảnh
													</span>
												</div>
											)}
										</td>
										<td className='py-3 px-4'>
											<div
												className={
													!variant.isActive
														? 'text-gray-400'
														: 'text-gray-800'
												}>
												{variant.combination
													.map(
														(item) =>
															COLOR_OPTIONS.find(
																(opt) =>
																	opt.value ===
																	item.value,
															)?.label ||
															item.value,
													)
													.join(' - ')}
											</div>
										</td>
										<td className='py-3 px-4 text-center'>
											{variant.isActive ? (
												<input
													type='number'
													value={variant.price}
													onChange={(e) =>
														updateVariantPrice(
															index,
															Number(
																e.target.value,
															),
														)
													}
													className='w-40 rounded-md border border-gray-300 px-2 py-1 text-center focus:border-blue-500 focus:outline-none text-textPrimary'
													placeholder='0'
													min='0'
												/>
											) : (
												<span className='text-gray-400'>
													-
												</span>
											)}
										</td>
										<td className='py-3 px-4 text-center'>
											{variant.isActive ? (
												<input
													type='text'
													value={generateSKU(
														variant.combination,
													)}
													readOnly
													className='w-32 rounded-md border border-gray-300 px-2 py-1 text-center bg-gray-100 text-sm text-textPrimary'
												/>
											) : (
												<span className='text-gray-400'>
													-
												</span>
											)}
										</td>
										<td className='py-3 px-4 text-center'>
											{variant.isActive ? (
												<input
													type='number'
													value={variant.stock}
													onChange={(e) =>
														updateVariantStock(
															index,
															Number(
																e.target.value,
															),
														)
													}
													className='w-24 rounded-md border border-gray-300 px-2 py-1 text-center focus:border-blue-500 focus:outline-none text-textPrimary'
													placeholder='0'
													min='0'
												/>
											) : (
												<span className='text-gray-400'>
													-
												</span>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
};

VariantSelector.propTypes = {
	options: PropTypes.array.isRequired,
	variants: PropTypes.array.isRequired,
	onOptionsChange: PropTypes.func.isRequired,
	onVariantsChange: PropTypes.func.isRequired,
	basePrice: PropTypes.number.isRequired,
	onColorChange: PropTypes.func,
};

export default VariantSelector;
