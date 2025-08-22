import { useState } from 'react';

export default function SalesOverview() {
	const [selectedPeriod, setSelectedPeriod] = useState('all');

	const salesData = {
		totalSold: 2320,
		previousPeriod: 4000,
		percentageChange: -42,
		lastUpdate: '10:25',
	};

	const periods = [
		{ key: 'all', label: 'Tất cả SKU' },
		{ key: '30days', label: '30 ngày gần nhất: 27/03' },
	];

	return (
		<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
			<div className='flex items-center justify-between mb-6'>
				<h3 className='text-lg font-semibold text-gray-800'>
					Tổng quan bán hàng
				</h3>
				<span className='text-sm text-gray-500'>
					(Đã cập nhật lúc {salesData.lastUpdate})
				</span>
			</div>

			<div className='mb-6'>
				<p className='text-sm text-gray-600 mb-2'>
					Tổng số SKU đã bán của tất cả các Shop
				</p>
				<div className='flex items-center gap-4'>
					<p className='text-3xl font-bold text-gray-800'>
						{salesData.totalSold.toLocaleString()}
					</p>
					<div className='flex items-center gap-2'>
						<span className='text-sm text-gray-600'>
							vs Trước 30 Ngày
						</span>
						<span
							className={`text-sm font-medium ${
								salesData.percentageChange >= 0
									? 'text-green-600'
									: 'text-red-600'
							}`}>
							{Math.abs(salesData.percentageChange)}%
						</span>
						<svg
							className={`w-4 h-4 ${
								salesData.percentageChange >= 0
									? 'text-green-600 rotate-0'
									: 'text-red-600 rotate-180'
							}`}
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M5 10l7-7m0 0l7 7m-7-7v18'
							/>
						</svg>
					</div>
				</div>
				<p className='text-sm text-gray-600 mt-2'>
					Số lượng sản phẩm bán ra từ tất cả SKU
				</p>
			</div>

			<div className='flex gap-2'>
				{periods.map((period) => (
					<button
						key={period.key}
						onClick={() => setSelectedPeriod(period.key)}
						className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
							selectedPeriod === period.key
								? 'bg-blue-600 text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}>
						{period.label}
					</button>
				))}
			</div>
		</div>
	);
}
