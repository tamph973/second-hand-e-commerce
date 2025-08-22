/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import PaymentMethodItem from './PaymentMethodItem';
import momo from '@/assets/icons/momo.svg';
import vnpay from '@/assets/icons/vnpay.svg';
import cod from '@/assets/icons/cod.png';
const paymentMethods = [
	{ id: 'COD', name: 'Thanh toán khi nhận hàng', icon: cod },
	{ id: 'MOMO', name: 'Thanh toán Momo', icon: momo },
	{ id: 'VNPAY', name: 'Thanh toán VNPay', icon: vnpay },
];

const PaymentMethod = ({ paymentMethod }) => {
	const [selectedId, setSelectedId] = useState(paymentMethods[0]?.id || null);

	useEffect(() => {
		paymentMethod(paymentMethods[0]?.id || null);
	}, [paymentMethod]);

	const handleSelect = (id) => {
		setSelectedId(id);
		paymentMethod(id);
	};
	return (
		<div className='bg-white rounded-2xl shadow-xl p-6'>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-900'>
					Phương thức thanh toán
				</h2>
			</div>

			<div className='space-y-4'>
				{paymentMethods.map((method) => (
					<PaymentMethodItem
						key={method.id}
						method={method}
						selectedId={selectedId}
						onSelect={handleSelect}
					/>
				))}
			</div>
		</div>
	);
};

export default PaymentMethod;
