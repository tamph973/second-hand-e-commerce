/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler,
);

const RevenueChart = ({ data }) => {
	const [timeFilter, setTimeFilter] = useState('year');

	// Dữ liệu mẫu cho biểu đồ
	const chartData = {
		year: {
			labels: [
				'T1',
				'T2',
				'T3',
				'T4',
				'T5',
				'T6',
				'T7',
				'T8',
				'T9',
				'T10',
				'T11',
				'T12',
			],
			datasets: [
				{
					label: 'Doanh thu',
					data: [
						12000000, 15000000, 18000000, 22000000, 25000000,
						28000000, 32000000, 35000000, 38000000, 42000000,
						45000000, 52000000,
					],
					borderColor: 'rgb(59, 130, 246)',
					backgroundColor: 'rgba(59, 130, 246, 0.1)',
					fill: true,
					tension: 0.4,
					borderWidth: 2,
				},
				// {
				// 	label: 'Hoa hồng',
				// 	data: [
				// 		1200000, 1500000, 1800000, 2200000, 2500000, 2800000,
				// 		3200000, 3500000, 3800000, 4200000, 4500000, 5200000,
				// 	],
				// 	borderColor: 'rgb(34, 197, 94)',
				// 	backgroundColor: 'rgba(34, 197, 94, 0.1)',
				// 	fill: true,
				// 	tension: 0.4,
				// 	borderWidth: 2,
				// },
			],
		},
		month: {
			labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
			datasets: [
				{
					label: 'Doanh thu',
					data: [8000000, 12000000, 15000000, 18000000],
					borderColor: 'rgb(59, 130, 246)',
					backgroundColor: 'rgba(59, 130, 246, 0.1)',
					fill: true,
					tension: 0.4,
				},
				{
					label: 'Hoa hồng',
					data: [800000, 1200000, 1500000, 1800000],
					borderColor: 'rgb(34, 197, 94)',
					backgroundColor: 'rgba(34, 197, 94, 0.1)',
					fill: true,
					tension: 0.4,
				},
			],
		},
		week: {
			labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
			datasets: [
				{
					label: 'Doanh thu',
					data: [
						2000000, 2500000, 3000000, 3500000, 4000000, 4500000,
						5000000,
					],
					borderColor: 'rgb(59, 130, 246)',
					backgroundColor: 'rgba(59, 130, 246, 0.1)',
					fill: true,
					tension: 0.4,
				},
				{
					label: 'Hoa hồng',
					data: [
						200000, 250000, 300000, 350000, 400000, 450000, 500000,
					],
					borderColor: 'rgb(34, 197, 94)',
					backgroundColor: 'rgba(34, 197, 94, 0.1)',
					fill: true,
					tension: 0.4,
				},
			],
		},
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'top',
				labels: {
					usePointStyle: true,
					padding: 20,
					font: {
						size: 12,
					},
				},
			},
			title: {
				display: false,
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				ticks: {
					callback: function (value) {
						return new Intl.NumberFormat('vi-VN', {
							style: 'currency',
							currency: 'VND',
							minimumFractionDigits: 0,
							maximumFractionDigits: 0,
						}).format(value);
					},
				},
				grid: {
					color: 'rgba(0, 0, 0, 0.05)',
				},
			},
			x: {
				grid: {
					display: false,
				},
				ticks: {
					maxTicksLimit: 12,
				},
			},
		},
		interaction: {
			intersect: false,
		},
		elements: {
			point: {
				radius: 4,
				hoverRadius: 6,
			},
		},
		layout: {
			padding: {
				right: 20,
			},
		},
	};

	const timeFilters = [
		{ key: 'year', label: 'Năm nay' },
		{ key: 'month', label: 'Tháng này' },
		{ key: 'week', label: 'Tuần này' },
	];

	return (
		<div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
			<div className='flex items-center justify-between mb-6'>
				<div className='flex items-center'>
					<div className='p-2 bg-blue-100 rounded-lg mr-3'>
						<svg
							className='w-5 h-5 text-blue-600'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
							/>
						</svg>
					</div>
					<h3 className='text-lg font-semibold text-gray-900'>
						Thống kê doanh thu
					</h3>
				</div>
				<div className='flex space-x-1 bg-gray-100 rounded-lg p-1'>
					{timeFilters.map((filter) => (
						<button
							key={filter.key}
							onClick={() => setTimeFilter(filter.key)}
							className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
								timeFilter === filter.key
									? 'bg-white text-blue-600 shadow-sm'
									: 'text-gray-600 hover:text-gray-900'
							}`}>
							{filter.label}
						</button>
					))}
				</div>
			</div>
			<div className='h-96'>
				<Line data={chartData[timeFilter]} options={options} />
			</div>
		</div>
	);
};

export default RevenueChart;
