import { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '@/components/modal/Modal';
import { useDebounce } from '@/hooks/useDebounce';
import LoadingThreeDot from '@/components/common/LoadingThreeDot';

const ModalPhoneOTP = ({ isOpen, onClose, onSubmit }) => {
	const [phone, setPhone] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const debouncedPhone = useDebounce(phone, 500);
	const isValidPhone = (phone) => {
		return /^\d{10}$/.test(phone); // example: 0977490021
	};
	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title='Xác minh số điện thoại'
				variant='form'
				size='md'>
				<p className='text-gray-500 text-center mb-6'>
					Hãy điền số điện thoại và chúng tôi sẽ gửi bạn một mã xác
					minh gồm 6 chữ số tới số điện thoại của bạn.
				</p>
				<div className='mb-6 flex flex-col gap-2 items-center justify-center'>
					<div className='flex items-center w-full max-w-md border border-gray-300 rounded-full px-2 py-2 bg-white'>
						<input
							type='tel'
							className='flex-1 border-none outline-none px-2 text-gray-600 bg-transparent'
							placeholder='Nhập số điện thoại'
							value={phone}
							onChange={(e) => {
								setPhone(e.target.value);
							}}
							maxLength={10}
						/>
					</div>
					{debouncedPhone && !isValidPhone(debouncedPhone) && (
						<p className='text-red-500 text-sm mb-2 text-center'>
							Số điện thoại không hợp lệ (0xxxxxxxxx)
						</p>
					)}
				</div>
				<div className='flex flex-col items-center'>
					<div className='flex justify-center w-full'>
						<button
							className='w-1/2 py-2 rounded-full text-white font-semibold text-lg transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 disabled:opacity-50'
							style={{
								background:
									'linear-gradient(90deg, #0f5ad5 0%, #1de9b6 100%)',
								borderRadius: '9999px',
							}}
							onClick={() => onSubmit(debouncedPhone)}
							disabled={!debouncedPhone || isLoading}>
							{isLoading ? <LoadingThreeDot /> : 'Gửi'}
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
};

ModalPhoneOTP.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
};

export default ModalPhoneOTP;
