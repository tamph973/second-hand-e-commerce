import { useFormik } from 'formik';
import CustomInput from '@/components/form/CustomInput';
import { FaSearch } from 'react-icons/fa';
import Button from '@/components/common/Button';

const TransactionFilter = () => {
	const formik = useFormik({
		initialValues: {
			fromDate: '',
			toDate: '',
			transactionType: 'all',
		},
	});

	return (
		<form
			onSubmit={formik.handleSubmit}
			className='flex flex-col md:flex-row gap-3 md:items-center text-primary'>
			<div>
				<CustomInput
					type='date'
					className='border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary transition max-w-[200px]'
					placeholder='Từ ngày'
				/>
			</div>
			<div>
				<CustomInput
					type='date'
					className='border border-gray-200 rounded-xl px-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary transition max-w-[200px]'
					placeholder='Đến ngày'
				/>
			</div>
			<div>
				<CustomInput
					type='select'
					className=' rounded-xl px-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary transition'
					placeholder='Loại giao dịch'
					id='transactionType'
					name='transactionType'
					value={formik.values.transactionType}
					onChange={formik.handleChange}
					options={[
						{ value: 'all', label: 'Tất cả' },
						{ value: 'deposit', label: 'Nạp tiền' },
						{ value: 'withdraw', label: 'Rút tiền' },
						{ value: 'reward', label: 'Nhận thưởng' },
					]}
				/>
			</div>
			<Button
				type='submit'
				className='flex items-center justify-center gap-2 text-white px-6 py-2 rounded-xl font-semibold text-sm shadow-md transition ml-auto bg-primary/80'>
				<FaSearch className='text-sm' />
				Tìm kiếm
			</Button>
		</form>
	);
};

export default TransactionFilter;
