/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
	FaChevronUp,
	FaChevronDown,
	FaFilter,
	FaRegTrashAlt,
	FaCheck,
} from 'react-icons/fa';
import PriceFilter from './PriceFilter';
import useAppQuery from '@/hooks/useAppQuery';
import BrandService from '@/services/brand.service';
import AddressService from '@/services/address.service';
import { CONDITION_OPTIONS } from '@/constants/productOptions';

const FilterPanel = ({
	onPriceChange,
	currentMinPrice,
	currentMaxPrice,
	onProvinceChange,
	onClearFilters,
	onBrandChange,
	currentBrand,
	onConditionChange,
	currentCondition,
	currentProvince,
}) => {
	const [isExpanded, setIsExpanded] = useState(true);
	const [selectedBrands, setSelectedBrands] = useState(() => {
		// Parse currentBrand từ string thành array
		if (currentBrand) {
			return currentBrand.split(',').filter((brand) => brand.trim());
		}
		return [];
	});
	const [selectedConditions, setSelectedConditions] = useState(() => {
		// Parse currentCondition từ string thành array
		if (currentCondition) {
			return currentCondition
				.split(',')
				.filter((condition) => condition.trim());
		}
		return [];
	});
	const [selectedProvinces, setSelectedProvinces] = useState(() => {
		// Parse currentProvince từ string thành array
		if (currentProvince) {
			return currentProvince
				.split(',')
				.filter((province) => province.trim());
		}
		return [];
	});

	// Lấy danh sách tỉnh từ sản phẩm
	const { data: provincesData = [] } = useAppQuery(
		['provinces-in-products'],
		() => AddressService.getProvincesInProduct(),
		{
			select: (res) => res.data,
			refetchOnWindowFocus: false,
		},
	);

	// Lấy thương hiệu
	const { data: brands = [] } = useAppQuery(
		['brands'],
		() => BrandService.getAllBrands(),
		{
			select: (res) => res.data,
			refetchOnWindowFocus: false,
		},
	);

	// Sync selectedBrands với currentBrand prop
	useEffect(() => {
		if (currentBrand) {
			setSelectedBrands(
				currentBrand.split(',').filter((brand) => brand.trim()),
			);
		} else {
			setSelectedBrands([]);
		}
	}, [currentBrand]);

	// Sync selectedConditions với currentCondition prop
	useEffect(() => {
		if (currentCondition) {
			setSelectedConditions(
				currentCondition
					.split(',')
					.filter((condition) => condition.trim()),
			);
		} else {
			setSelectedConditions([]);
		}
	}, [currentCondition]);

	// Sync selectedProvinces với currentProvince prop
	useEffect(() => {
		if (currentProvince) {
			setSelectedProvinces(
				currentProvince
					.split(',')
					.filter((province) => province.trim()),
			);
		} else {
			setSelectedProvinces([]);
		}
	}, [currentProvince]);

	// Xử lý khi chọn/bỏ chọn brand
	const handleBrandSelection = (brandName, isChecked) => {
		let newSelectedBrands;

		if (isChecked) {
			newSelectedBrands = [...selectedBrands, brandName];
		} else {
			newSelectedBrands = selectedBrands.filter(
				(brand) => brand !== brandName,
			);
		}

		setSelectedBrands(newSelectedBrands);

		// Gọi callback với chuỗi brands được join bằng dấu phẩy
		const brandsString = newSelectedBrands.join(',');
		console.log('brandsString :>> ', brandsString);
		onBrandChange({ target: { value: brandsString } });
	};

	// Clear all selected brands
	const handleClearBrands = () => {
		setSelectedBrands([]);
		onBrandChange({ target: { value: '' } });
	};

	// Xử lý khi chọn/bỏ chọn condition
	const handleConditionSelection = (conditionName, isChecked) => {
		let newSelectedConditions;

		if (isChecked) {
			newSelectedConditions = [...selectedConditions, conditionName];
		} else {
			newSelectedConditions = selectedConditions.filter(
				(condition) => condition !== conditionName,
			);
		}

		setSelectedConditions(newSelectedConditions);

		// Gọi callback với chuỗi conditions được join bằng dấu phẩy
		const conditionsString = newSelectedConditions.join(',');
		console.log('conditionsString :>> ', conditionsString);
		onConditionChange({ target: { value: conditionsString } });
	};

	// Clear all selected conditions
	const handleClearConditions = () => {
		setSelectedConditions([]);
		onConditionChange({ target: { value: '' } });
	};

	// Xử lý khi chọn/bỏ chọn province
	const handleProvinceSelection = (provinceCode, isChecked) => {
		let newSelectedProvinces;

		if (isChecked) {
			newSelectedProvinces = [...selectedProvinces, provinceCode];
		} else {
			newSelectedProvinces = selectedProvinces.filter(
				(province) => province !== provinceCode,
			);
		}

		setSelectedProvinces(newSelectedProvinces);

		// Gọi callback với chuỗi provinces được join bằng dấu phẩy
		const provincesString = newSelectedProvinces.join(',');
		console.log('provincesString :>> ', provincesString);
		onProvinceChange({ target: { value: provincesString } });
	};

	// Clear all selected provinces
	const handleClearProvinces = () => {
		setSelectedProvinces([]);
		onProvinceChange({ target: { value: '' } });
	};

	return (
		<div className='space-y-4 p-2'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
					<FaFilter className='text-orange-500' />
					Bộ lọc tìm kiếm
				</h3>
				<button
					onClick={onClearFilters}
					className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200'
					title='Xóa tất cả bộ lọc'>
					<FaRegTrashAlt />
				</button>
			</div>

			{/* Price Filter */}
			<PriceFilter
				onPriceChange={onPriceChange}
				currentMinPrice={currentMinPrice}
				currentMaxPrice={currentMaxPrice}
			/>

			{/* Brand Filter */}
			<div className='bg-white rounded-lg border border-gray-200 shadow-sm'>
				<div
					className='flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200'
					onClick={() => setIsExpanded(!isExpanded)}>
					<div className='flex items-center gap-2'>
						<h3 className='text-lg font-semibold text-gray-900'>
							Thương hiệu
						</h3>
						{selectedBrands.length > 0 && (
							<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700'>
								{selectedBrands.length}
							</span>
						)}
					</div>
					<div className='flex items-center gap-2'>
						{selectedBrands.length > 0 && (
							<button
								onClick={(e) => {
									e.stopPropagation();
									handleClearBrands();
								}}
								className='text-xs text-gray-500 hover:text-red-500 transition-colors duration-200'
								title='Xóa tất cả'>
								Xóa
							</button>
						)}
						{isExpanded ? (
							<FaChevronUp className='text-gray-500 transition-transform duration-200' />
						) : (
							<FaChevronDown className='text-gray-500 transition-transform duration-200' />
						)}
					</div>
				</div>

				{isExpanded && (
					<div className='px-4 pb-4 space-y-2 h-[400px] overflow-auto'>
						{brands.map((brand) => {
							const isSelected = selectedBrands.includes(
								brand.name,
							);
							return (
								<label
									key={brand._id}
									className={`
										flex items-center cursor-pointer group rounded-lg p-2 transition-all duration-200
										${
											isSelected
												? 'bg-blue-50 border border-blue-200'
												: 'hover:bg-gray-50 border border-transparent'
										}
									`}>
									<div className='relative'>
										<input
											onChange={(e) =>
												handleBrandSelection(
													brand.name,
													e.target.checked,
												)
											}
											id={brand._id}
											name='brand'
											value={brand.name}
											type='checkbox'
											checked={isSelected}
											className='w-4 h-4 text-blue-500 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all duration-200'
										/>
										{isSelected && (
											<FaCheck className='absolute inset-0 w-3 h-3 text-blue-600 pointer-events-none m-auto' />
										)}
									</div>
									<span
										className={`
										ml-3 text-sm font-medium transition-colors duration-200
										${
											isSelected
												? 'text-blue-700 font-semibold'
												: 'text-gray-700 group-hover:text-gray-900'
										}
									`}>
										{brand.name}
									</span>
									{isSelected && (
										<div className='ml-auto'>
											<div className='w-2 h-2 bg-blue-500 rounded-full'></div>
										</div>
									)}
								</label>
							);
						})}
					</div>
				)}
			</div>

			{/* Condition Filter */}
			<div className='bg-white rounded-lg border border-gray-200 shadow-sm'>
				<div className='flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200'>
					<div className='flex items-center gap-2'>
						<h3 className='text-lg font-semibold text-gray-900'>
							Tình trạng
						</h3>
						{selectedConditions.length > 0 && (
							<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700'>
								{selectedConditions.length}
							</span>
						)}
					</div>
					<div className='flex items-center gap-2'>
						{selectedConditions.length > 0 && (
							<button
								onClick={(e) => {
									e.stopPropagation();
									handleClearConditions();
								}}
								className='text-xs text-gray-500 hover:text-red-500 transition-colors duration-200'
								title='Xóa tất cả'>
								Xóa
							</button>
						)}
						<FaChevronDown className='text-gray-500 transition-transform duration-200' />
					</div>
				</div>

				<div className='px-4 pb-4 space-y-2'>
					{CONDITION_OPTIONS.map((condition) => {
						const isSelected =
							selectedConditions.includes(condition.value);
						return (
							<label
								key={condition.value}
								className={`
									flex items-center cursor-pointer group rounded-lg p-2 transition-all duration-200
									${
										isSelected
											? 'bg-blue-50 border border-blue-200'
											: 'hover:bg-gray-50 border border-transparent'
									}
								`}>
								<div className='relative'>
									<input
										onChange={(e) =>
											handleConditionSelection(
												condition.value,
												e.target.checked,
											)
										}
										id={condition.value}
										name='condition'
										value={condition.value}
										type='checkbox'
										checked={isSelected}
										className='w-4 h-4 text-blue-500 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all duration-200'
									/>
									{isSelected && (
										<FaCheck className='absolute inset-0 w-3 h-3 text-blue-600 pointer-events-none m-auto' />
									)}
								</div>
								<span
									className={`
									ml-3 text-sm font-medium transition-colors duration-200
									${
										isSelected
											? 'text-blue-700 font-semibold'
											: 'text-gray-700 group-hover:text-gray-900'
									}
								`}>
									{condition.label}
								</span>
								{isSelected && (
									<div className='ml-auto'>
										<div className='w-2 h-2 bg-blue-500 rounded-full'></div>
									</div>
								)}
							</label>
						);
					})}
				</div>
			</div>

			{/* Location Filter */}
			<div className='bg-white rounded-lg border border-gray-200 shadow-sm'>
				<div className='flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200'>
					<div className='flex items-center gap-2'>
						<h3 className='text-lg font-semibold text-gray-900'>
							Địa điểm
						</h3>
						{selectedProvinces.length > 0 && (
							<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700'>
								{selectedProvinces.length}
							</span>
						)}
					</div>
					<div className='flex items-center gap-2'>
						{selectedProvinces.length > 0 && (
							<button
								onClick={(e) => {
									e.stopPropagation();
									handleClearProvinces();
								}}
								className='text-xs text-gray-500 hover:text-red-500 transition-colors duration-200'
								title='Xóa tất cả'>
								Xóa
							</button>
						)}
						<FaChevronDown className='text-gray-500 transition-transform duration-200' />
					</div>
				</div>

				<div className='px-4 pb-4 space-y-2 max-h-[300px] overflow-auto'>
					{provincesData.map((province) => {
						const isSelected = selectedProvinces.includes(
							province.code.toString(),
						);
						return (
							<label
								key={province.code}
								className={`
									flex items-center cursor-pointer group rounded-lg p-2 transition-all duration-200
									${
										isSelected
											? 'bg-blue-50 border border-blue-200'
											: 'hover:bg-gray-50 border border-transparent'
									}
								`}>
								<div className='relative'>
									<input
										onChange={(e) =>
											handleProvinceSelection(
												province.code.toString(),
												e.target.checked,
											)
										}
										id={province.code}
										name='province'
										value={province.code}
										type='checkbox'
										checked={isSelected}
										className='w-4 h-4 text-blue-500 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all duration-200'
									/>
									{isSelected && (
										<FaCheck className='absolute inset-0 w-3 h-3 text-blue-600 pointer-events-none m-auto' />
									)}
								</div>
								<span
									className={`
									ml-3 text-sm font-medium transition-colors duration-200
									${
										isSelected
											? 'text-blue-700 font-semibold'
											: 'text-gray-700 group-hover:text-gray-900'
									}
								`}>
									{province.name}
								</span>
								{isSelected && (
									<div className='ml-auto'>
										<div className='w-2 h-2 bg-blue-500 rounded-full'></div>
									</div>
								)}
							</label>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default FilterPanel;
