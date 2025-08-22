/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { formatPriceVND } from '@/utils/helpers';

const PriceFilter = ({ onPriceChange, currentMinPrice, currentMaxPrice }) => {
	const [isExpanded, setIsExpanded] = useState(true);
	const [selectedOption, setSelectedOption] = useState('all');
	const [customMinPrice, setCustomMinPrice] = useState('');
	const [customMaxPrice, setCustomMaxPrice] = useState('');
	const [isCustomSelected, setIsCustomSelected] = useState(false);

	const priceRanges = [
		{ id: 'all', label: 'Tất cả', min: '', max: '' },
		{ id: 'under100k', label: 'Dưới 100.0000đ', min: 0, max: 100000 },
		{
			id: '100k-200k',
			label: '100.000đ - 200.000đ',
			min: 100000,
			max: 200000,
		},
		{
			id: '200k-500k',
			label: '200.000đ - 500.000đ',
			min: 200000,
			max: 500000,
		},
		{
			id: 'over500k',
			label: 'Trên 500.000đ',
			min: 500000,
			max: Number.MAX_SAFE_INTEGER,
		},
	];

	// Parse price from string
	const parsePrice = (priceString) => {
		if (!priceString || priceString === '') return undefined;
		const parsed = parseInt(priceString.replace(/[^\d]/g, ''));
		return isNaN(parsed) ? undefined : parsed;
	};

	// Handle radio button selection
	const handleOptionChange = (optionId) => {
		setSelectedOption(optionId);
		setIsCustomSelected(false);

		const selectedRange = priceRanges.find(
			(range) => range.id === optionId,
		);
		if (selectedRange) {
			if (optionId === 'all') {
				onPriceChange('', '');
			} else {
				onPriceChange(selectedRange.min, selectedRange.max);
			}
		}
	};

	// Handle custom price range
	const handleCustomPriceChange = () => {
		const min = parsePrice(customMinPrice);
		const max = parsePrice(customMaxPrice);

		// Chỉ áp dụng filter nếu có ít nhất một giá trị hợp lệ
		if (min !== undefined || max !== undefined) {
			setIsCustomSelected(true);
			setSelectedOption('custom');
			onPriceChange(min, max);
		}
	};

	// Apply custom price filter
	const handleApplyCustomPrice = () => {
		handleCustomPriceChange();
	};

	// Clear price filter
	const handleClearPriceFilter = () => {
		setSelectedOption('all');
		setIsCustomSelected(false);
		setCustomMinPrice('');
		setCustomMaxPrice('');
		// Gửi undefined để backend hiểu là không lọc
		onPriceChange('', '');
	};

	// Check if apply button should be enabled
	const isApplyEnabled = () => {
		const min = parsePrice(customMinPrice);
		const max = parsePrice(customMaxPrice);
		return min !== undefined || max !== undefined;
	};

	// Check if any filter is active
	const isFilterActive = () => {
		return selectedOption !== 'all' || isCustomSelected;
	};

	// Initialize with current values
	useEffect(() => {
		// Nếu không có giá trị hiện tại hoặc cả hai đều undefined, đặt mặc định là "Tất cả"
		if (
			(!currentMinPrice && !currentMaxPrice) ||
			(currentMinPrice === '' && currentMaxPrice === '')
		) {
			setSelectedOption('all');
			setIsCustomSelected(false);
			setCustomMinPrice('');
			setCustomMaxPrice('');
			return;
		}

		// Tìm range phù hợp với giá trị hiện tại
		const matchingRange = priceRanges.find((range) => {
			// So sánh với giá trị hiện tại
			const currentMin = currentMinPrice
				? parseInt(currentMinPrice)
				: undefined;
			const currentMax = currentMaxPrice
				? parseInt(currentMaxPrice)
				: undefined;

			return range.min === currentMin && range.max === currentMax;
		});

		if (matchingRange) {
			setSelectedOption(matchingRange.id);
			setIsCustomSelected(false);
			setCustomMinPrice('');
			setCustomMaxPrice('');
		} else {
			// Nếu không tìm thấy range phù hợp, đặt là custom
			setSelectedOption('custom');
			setIsCustomSelected(true);
			setCustomMinPrice(
				currentMinPrice ? formatPriceVND(currentMinPrice) : '',
			);
			setCustomMaxPrice(
				currentMaxPrice ? formatPriceVND(currentMaxPrice) : '',
			);
		}
	}, [currentMinPrice, currentMaxPrice]);

	// Tự động chọn "Tất cả" khi component mount lần đầu
	useEffect(() => {
		if (!currentMinPrice && !currentMaxPrice) {
			// Gọi callback để đảm bảo URL được cập nhật
			onPriceChange('', '');
		}
	}, []);

	return (
		<div className='bg-white rounded-lg border border-gray-200 shadow-sm'>
			{/* Header */}
			<div
				className='flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200'
				onClick={() => setIsExpanded(!isExpanded)}>
				<h3 className='text-lg font-semibold text-gray-900'>Giá</h3>
				<div className='flex items-center gap-2'>
					{isFilterActive() && (
						<button
							onClick={(e) => {
								e.stopPropagation();
								handleClearPriceFilter();
							}}
							className='px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors duration-200'
							title='Xóa bộ lọc giá'>
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

			{/* Content */}
			{isExpanded && (
				<div className='px-4 pb-4 space-y-4'>
					{/* Predefined Price Ranges */}
					<div className='space-y-3'>
						{priceRanges.map((range) => (
							<label
								key={range.id}
								className='flex items-center cursor-pointer group hover:bg-gray-50 rounded-lg p-2 transition-colors duration-200'>
								<input
									type='radio'
									name='priceRange'
									value={range.id}
									checked={
										selectedOption === range.id &&
										!isCustomSelected
									}
									onChange={() =>
										handleOptionChange(range.id)
									}
									className='w-4 h-4 text-orange-500 bg-gray-100 border-gray-300 focus:ring-orange-500 focus:ring-2 transition-all duration-200'
								/>
								<span className='ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200'>
									{range.label}
								</span>
							</label>
						))}
					</div>

					{/* Custom Price Range */}
					<div className='border-t border-gray-200 pt-4'>
						<label className='flex items-center cursor-pointer group hover:bg-gray-50 rounded-lg p-2 transition-colors duration-200'>
							<input
								type='radio'
								name='priceRange'
								value='custom'
								checked={isCustomSelected}
								onChange={() => setIsCustomSelected(true)}
								className='w-4 h-4 text-orange-500 bg-gray-100 border-gray-300 focus:ring-orange-500 focus:ring-2 transition-all duration-200'
							/>
							<span className='ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200'>
								Chọn khoảng giá
							</span>
						</label>

						{/* Custom Price Inputs */}
						<div className='mt-3 ml-7 space-y-3'>
							<div className='flex items-center gap-2'>
								<div className='flex-1'>
									<label className='block text-xs font-medium text-gray-600 mb-1'>
										Từ
									</label>
									<div className='relative'>
										<input
											type='text'
											value={customMinPrice}
											onChange={(e) =>
												setCustomMinPrice(
													e.target.value,
												)
											}
											placeholder='0'
											className='w-full text-gray-500 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200'
										/>
									</div>
								</div>
								<span className='text-gray-400 mt-6'>-</span>
								<div className='flex-1'>
									<label className='block text-xs font-medium text-gray-600 mb-1'>
										Đến
									</label>
									<div className='relative'>
										<input
											type='text'
											value={customMaxPrice}
											onChange={(e) =>
												setCustomMaxPrice(
													e.target.value,
												)
											}
											placeholder='0'
											className='w-full text-gray-500 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200'
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Apply Button */}
						<div className='mt-4 ml-7'>
							<button
								onClick={handleApplyCustomPrice}
								disabled={!isApplyEnabled()}
								className={`w-full px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
									isApplyEnabled()
										? 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
										: 'bg-gray-200 text-gray-400 cursor-not-allowed'
								}`}>
								Áp dụng
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

PriceFilter.propTypes = {
	onPriceChange: PropTypes.func,
	currentMinPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	currentMaxPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

PriceFilter.defaultProps = {
	onPriceChange: () => {},
	currentMinPrice: '',
	currentMaxPrice: '',
};

export default PriceFilter;
