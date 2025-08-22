/* eslint-disable react/prop-types */
import { ORDER_STATUS_OPTIONS } from '@/constants/productOptions';

export default function OrderStatusTabs({ value, onChange, counters = {} }) {
	return (
		<div className='mb-6'>
			{/* Single row for all tabs */}
			<div className='flex flex-wrap gap-1 border-b border-gray-200 pb-1'>
				{ORDER_STATUS_OPTIONS.map((tab) => (
					<button
						key={tab.value}
						className={`px-2.5 py-2 font-medium rounded-t-lg border-b-2 transition-all duration-200 focus:outline-none text-sm whitespace-nowrap relative
							${
								value === tab.value
									? 'border-orange-500 text-orange-600 bg-white shadow-sm'
									: 'border-transparent text-gray-600 hover:text-orange-600 hover:bg-gray-50'
							}
						`}
						onClick={() => onChange(tab.value)}>
						{tab.label}
						{counters[tab.value] > 0 && (
							<span className='ml-1 inline-flex items-center justify-center min-w-[16px] h-4 px-1 text-xs bg-red-500 text-white rounded-full'>
								{counters[tab.value]}
							</span>
						)}
					</button>
				))}
			</div>
		</div>
	);
}
