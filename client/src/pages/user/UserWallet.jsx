import BalanceCard from './components/wallet/BalanceCard';
import BankAccountList from './components/wallet/BankAccountList';
import VerifyAlert from './components/wallet/VerifyAlert';
import TransactionFilter from './components/wallet/TransactionFilter';
import TransactionTable from './components/wallet/TransactionTable';
import { useSelector } from 'react-redux';
import useAppQuery from '@/hooks/useAppQuery';
import PaymentService from '@/services/payment.service';

const UserWallet = () => {
	const { user } = useSelector((state) => state.user);
	const { data: paymentHistory, isPending } = useAppQuery(
		['paymentHistory'],
		() => PaymentService.getPaymentHistory(),
		{
			select: (res) => res.data,
		},
	);

	console.log('paymentHistory :>> ', paymentHistory);
	return (
		<div className='bg-gray-50 min-h-screen rounded-2xl shadow-lg p-8'>
			<div className='max-w-5xl mx-auto'>
				<h2 className='text-3xl text-primary font-bold mb-6'>
					Quản lý tiền của tôi
				</h2>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-4'>
					<div className='md:col-span-2 flex flex-col h-full'>
						<BalanceCard user={user} />
					</div>
					<div className='flex flex-col h-full'>
						<BankAccountList
							isVerified={user?.sellerVerification.isVerified}
						/>
					</div>
				</div>
				<VerifyAlert
					isVerified={user?.sellerVerification.isVerified}
					className='mb-4'
				/>
				<div className='bg-white rounded-2xl shadow p-5 mb-4'>
					<TransactionFilter />
				</div>
				<div className='bg-white rounded-2xl shadow p-5'>
					<TransactionTable data={paymentHistory} />
				</div>
			</div>
		</div>
	);
};

export default UserWallet;
