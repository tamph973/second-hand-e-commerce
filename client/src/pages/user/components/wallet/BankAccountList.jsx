/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import ModalConfirm from '@/components/modal/ModalConfirm';
import { useModal } from '@/hooks/useModal';
import { getBankList } from '@/configs/bankAPI';
import AddBankAccountModal from './AddBankAccountModal';
import { getLocalStorage, setLocalStorage } from '@/utils/localStorageUtils';

const BANK_ACCOUNTS_KEY = 'bankAccounts';

const BankAccountList = ({ isVerified }) => {
	const [bankAccounts, setBankAccounts] = useState(
		() => getLocalStorage(BANK_ACCOUNTS_KEY) || [],
	);
	const {
		isOpen: isOpenVerify,
		open: openVerify,
		close: closeVerify,
	} = useModal();
	const {
		isOpen: isOpenAddBank,
		open: openAddBank,
		close: closeAddBank,
	} = useModal();
	const [banks, setBanks] = useState([]);

	useEffect(() => {
		getBankList().then((res) => {
			setBanks(res.data);
		});
	}, []);

	// Lưu vào localStorage mỗi khi bankAccounts thay đổi
	useEffect(() => {
		setLocalStorage(BANK_ACCOUNTS_KEY, bankAccounts);
	}, [bankAccounts]);

	const handleAddBankClick = () => {
		if (!isVerified) {
			openVerify();
			return;
		}
		openAddBank();
	};
	const handleAddBankSuccess = (bankInfo) => {
		closeAddBank();
		setBankAccounts((prev) => [...prev, bankInfo]);
	};

	return (
		<>
			<div className='bg-white rounded-2xl shadow h-full p-7 flex flex-col justify-between min-h-[140px]'>
				<div className='font-semibold text-textPrimary mb-2'>
					Tài khoản ngân hàng để nhận tiền
				</div>
				{bankAccounts.length === 0 ? (
					<div className='text-textSecondary text-sm mb-4 text-center'>
						Chưa có tài khoản ngân hàng
					</div>
				) : (
					<ul className='mb-4'>
						{bankAccounts.map((acc, idx) => (
							<li
								key={acc.bankCode + acc.accountNumber}
								className='text-textPrimary text-sm mb-1'>
								{acc.accountName} - {acc.accountNumber}
							</li>
						))}
					</ul>
				)}
				<button
					className='flex items-center justify-center gap-2 text-primary hover:text-secondary font-medium text-sm mt-auto transition-colors'
					onClick={handleAddBankClick}
					type='button'>
					<FaPlus className='text-xs' /> Thêm mới
				</button>
			</div>

			<ModalConfirm
				size='md'
				isOpen={isOpenVerify}
				onClose={closeVerify}
				onConfirm={closeVerify}
				title='Thêm tài khoản ngân hàng'
				message={
					<>
						<div className='flex flex-col items-center'>
							<span className='block text-gray-700 text-base mt-2'>
								Bạn chưa hoàn tất xác minh danh tính. Vui lòng
								hoàn thành bước xác minh để có thể thêm thông in
								tài khoản ngân hàng
							</span>
						</div>
					</>
				}
				confirmText='Đã hiểu'
				showCancel={false}
				variant='error'
			/>

			<AddBankAccountModal
				isOpen={isOpenAddBank}
				onClose={closeAddBank}
				banks={banks}
				onSuccess={handleAddBankSuccess}
			/>
		</>
	);
};

export default BankAccountList;
