/* eslint-disable react/prop-types */
import { formatPriceVND } from '@/utils/helpers';
import { FaCoins } from 'react-icons/fa';

const BalanceCard = ({ user }) => {
	// Giả lập dữ liệu, sau này sẽ lấy từ props hoặc API
	const balance = user?.sellerVerification?.balance;
	const points = user?.sellerVerification?.points;

	return (
		<div className='flex flex-col justify-center bg-white rounded-2xl shadow h-full p-7 min-h-[140px]'>
			<div className='text-textSecondary text-base mb-1'>
				Số dư của bạn
			</div>
			<div className='text-3xl font-bold text-primary mb-2'>
				{formatPriceVND(balance)}
			</div>
			<div className='flex items-center gap-2 text-textPrimary'>
				<FaCoins className='text-yellow-400 text-lg' />
				<span className='font-semibold text-base'>{points} Điểm</span>
			</div>
		</div>
	);
};

export default BalanceCard;
