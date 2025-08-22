/* eslint-disable react/prop-types */
const PaymentMethodItem = ({ method, selectedId, onSelect }) => {
	return (
		<div className='flex items-center gap-2 border-2 border-gray-200 rounded-xl'>
			<label
				key={method.id}
				className='relative flex items-center rounded-xl cursor-pointer select-none'>
				<input
					type='radio'
					name='payment'
					checked={selectedId === method.id}
					onChange={() => onSelect(method.id)}
					className='ml-4 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 border-2'
				/>
				<div className='flex-1 p-4 flex items-center gap-2'>
					<img src={method.icon} alt={method.name} className='w-10 h-10' />
					<span>{method.name}</span>
				</div>
			</label>
		</div>
	);
};

export default PaymentMethodItem;
