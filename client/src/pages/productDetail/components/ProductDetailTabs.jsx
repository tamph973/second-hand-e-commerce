/* eslint-disable react/prop-types */
import { Tab } from '@headlessui/react';

function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}

export default function ProductDetailTabs({
	description,
	shippingSection,
	reviewSection,
}) {
	return (
		<div className='w-full px-2 py-8 sm:px-0'>
			<Tab.Group>
				<Tab.List className='flex space-x-1 rounded-xl  p-1'>
					<Tab
						className={({ selected }) =>
							classNames(
								'w-full py-2.5 text-sm leading-5 font-bold',
								'focus:outline-none',
								selected
									? 'bg-blue-600 text-white shadow rounded-[99px]'
									: 'text-gray-500 hover:bg-white/[0.12] hover:text-blue-600',
							)
						}>
						Chi tiết sản phẩm
					</Tab>
					<Tab
						className={({ selected }) =>
							classNames(
								'w-full py-2.5 text-sm leading-5 font-bold',
								'focus:outline-none',
								selected
									? 'bg-blue-600 text-white shadow rounded-[99px]'
									: 'text-gray-500 hover:bg-white/[0.12] hover:text-blue-600',
							)
						}>
						Vận chuyển & Trả hàng
					</Tab>
					<Tab
						className={({ selected }) =>
							classNames(
								'w-full py-2.5 text-sm leading-5 font-bold',
								'focus:outline-none',
								selected
									? 'bg-blue-600 text-white shadow rounded-[99px]'
									: 'text-gray-500 hover:bg-white/[0.12] hover:text-blue-600',
							)
						}>
						Đánh giá
					</Tab>
				</Tab.List>
				<Tab.Panels className='mt-2'>
					<Tab.Panel>{description}</Tab.Panel>
					<Tab.Panel>{shippingSection}</Tab.Panel>
					<Tab.Panel>{reviewSection}</Tab.Panel>
				</Tab.Panels>
			</Tab.Group>
		</div>
	);
}
