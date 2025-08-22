import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaTh, FaList, FaChevronDown } from 'react-icons/fa';

const ProductGridHeader = ({
	data,
	viewMode,
	onViewModeChange,
	onSort,
	sortBy,
	onSellerType, 
}) => {
	const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

	const handleSortChange = (newSortBy) => {
		onSort?.(newSortBy);
		setIsSortDropdownOpen(false);
	};

	const sortOptions = [
		{ value: 'createdAtDesc', label: 'Mới nhất' },
		{ value: 'createdAtAsc', label: 'Cũ nhất' },
		{ value: 'priceAsc', label: 'Giá tăng dần' },
		{ value: 'priceDesc', label: 'Giá giảm dần' },
		{ value: 'nameAsc', label: 'Tên A-Z' },
		{ value: 'nameDesc', label: 'Tên Z-A' },
		{ value: 'ratingDesc', label: 'Đánh giá cao nhất' },
		{ value: 'ratingAsc', label: 'Đánh giá thấp nhất' },
	];

	const getCurrentSortLabel = () => {
		const currentOption = sortOptions.find(
			(option) => option.value === sortBy,
		);
		return currentOption ? currentOption.label : 'Sắp xếp theo';
	};

	// State cho filter type
	const [sellerType, setSellerType] = useState('ALL');

	// Chuyển đổi giữa các loại filter
	const handleSellerType= (sellerType) => {
		setSellerType(sellerType);
		// Có thể thêm logic gọi API hoặc cập nhật URL params ở đây
		if (onSellerType) {
			onSellerType(sellerType);
		}
	};

	return (
		<div className='bg-white rounded-lg border border-gray-200 p-4 mb-6'>
			<div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
				{/* Left side - Product count */}
				<div className='flex items-center gap-4 text-textPrimary'>
					{/* Tất cả */}
					<span
						onClick={() => handleSellerType('ALL')}
						className={`  shrink-0 border-b-2 cursor-pointer hover:border-blue-500 hover:text-blue-500 px-1 pb-4 text-sm font-medium ${
							sellerType === 'ALL'
								? 'border-blue-500 text-blue-500'
								: ''
						}`}>
						Tất cả
					</span>
					{/* Bán chuyên */}
					<span
						onClick={() => handleSellerType('seller')}
						className={`  shrink-0 border-b-2 cursor-pointer hover:border-blue-500 hover:text-blue-500 px-1 pb-4 text-sm font-medium ${
							sellerType === 'seller'
								? 'border-blue-500 text-blue-500'
								: ''
						}`}>
						Cá nhân
					</span>
					{/* Cửa hàng/shop */}
					<span
						onClick={() => handleSellerType('business')}
						className={`  shrink-0 border-b-2 cursor-pointer hover:border-blue-500 hover:text-blue-500 px-1 pb-4 text-sm font-medium ${
							sellerType === 'business'
								? 'border-blue-500 text-blue-500'
								: ''
						}`}>
						Cửa hàng/shop
					</span>
				</div>

				{/* Right side - View toggles and sorting */}
				<div className='flex items-center gap-4'>
					{/* View mode toggles */}
					<div className='flex items-center bg-gray-100 rounded-lg p-1'>
						<button
							onClick={() => onViewModeChange('grid')}
							className={`p-2 rounded-md transition-all duration-200 ${
								viewMode === 'grid'
									? 'bg-white text-blue-600 shadow-sm'
									: 'text-gray-500 hover:text-gray-700'
							}`}
							title='Dạng lưới'>
							<FaTh className='w-4 h-4' />
						</button>
						<button
							onClick={() => onViewModeChange('list')}
							className={`p-2 rounded-md transition-all duration-200 ${
								viewMode === 'list'
									? 'bg-white text-blue-600 shadow-sm'
									: 'text-gray-500 hover:text-gray-700'
							}`}
							title='Dạng danh sách'>
							<FaList className='w-4 h-4' />
						</button>
					</div>

					{/* Sort dropdown */}
					<div className='relative'>
						<button
							onClick={() =>
								setIsSortDropdownOpen(!isSortDropdownOpen)
							}
							className='flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200'>
							<span className='text-sm font-medium text-gray-700'>
								{getCurrentSortLabel()}
							</span>
							<FaChevronDown
								className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${
									isSortDropdownOpen ? 'rotate-180' : ''
								}`}
							/>
						</button>

						{/* Dropdown menu */}
						{isSortDropdownOpen && (
							<div className='absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10'>
								<div className='py-1'>
									{sortOptions.map((option) => (
										<button
											key={option.value}
											onClick={() =>
												handleSortChange(option.value)
											}
											className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-200 ${
												sortBy === option.value
													? 'text-blue-600 bg-blue-50'
													: 'text-gray-700'
											}`}>
											{option.label}
										</button>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

ProductGridHeader.propTypes = {
	data: PropTypes.shape({
		pagination: PropTypes.shape({
			total: PropTypes.number,
			page: PropTypes.number,
			totalPages: PropTypes.number,
			limit: PropTypes.number,
		}),
	}),
	viewMode: PropTypes.oneOf(['grid', 'list']).isRequired,
	onViewModeChange: PropTypes.func.isRequired,
	onSort: PropTypes.func,
	sortBy: PropTypes.string,
	onSellerType: PropTypes.func,
};

ProductGridHeader.defaultProps = {
	data: null,
	onSort: null,
	sortBy: 'createdAtDesc',
};

export default ProductGridHeader;
