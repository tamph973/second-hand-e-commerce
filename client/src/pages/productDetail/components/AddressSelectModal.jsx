import Modal from '../../../components/modal/Modal';
import { FaCheckCircle, FaPlus } from 'react-icons/fa';
import PropTypes from 'prop-types';

const AddressSelectModal = ({
	isOpen,
	onClose,
	addresses = [],
	selectedAddress,
	onSelect,
	onAddNew,
}) => {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='Địa chỉ nhận hàng'
			size='xl'
			showCloseButton>
			<div className='mb-4'>
				<div className='text-sm text-gray-700 font-semibold mb-2'>
					Địa chỉ của tôi
				</div>
				<div className='space-y-3 max-h-64 overflow-y-auto pr-1'>
					{addresses.length === 0 && (
						<div className='text-gray-500 text-sm'>
							Chưa có địa chỉ nào.
						</div>
					)}
					{addresses.map((addr) => (
						<div
							key={addr._id}
							className={`flex items-center justify-between p-3 rounded-lg border transition ${
								addr._id === selectedAddress?._id
									? 'border-primary bg-primary/10'
									: 'border-gray-200 hover:border-primary'
							}`}>
							<div className='flex items-center gap-3 flex-1'>
								<input
									type='radio'
									name='address-radio'
									value={addr._id}
									checked={addr._id === selectedAddress?._id}
									onChange={() => onSelect(addr)}
									className='w-5 h-5 border border-gray-300 text-primary'
								/>
								<div>
									<div className='flex items-center gap-2 mb-1'>
										<span className='font-medium text-gray-900'>
											{addr.fullName}
										</span>
										<span className='text-gray-500 text-xs'>
											| {addr.phoneNumber}
										</span>
										{addr.isDefault && (
											<span className='ml-2 px-2 py-0.5 text-xs rounded bg-orange-100 text-primary border border-primary'>
												Mặc định
											</span>
										)}
									</div>
									<div className='text-gray-600 text-sm'>
										{addr.wardName}, {addr.districtName},{' '}
										{addr.provinceName}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
				<button
					className='mt-4 w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50 transition'
					onClick={onAddNew}>
					<FaPlus /> Thêm địa chỉ mới
				</button>
			</div>
		</Modal>
	);
};

AddressSelectModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	addresses: PropTypes.arrayOf(
		PropTypes.shape({
			_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
				.isRequired,
			fullName: PropTypes.string.isRequired,
			phoneNumber: PropTypes.string.isRequired,
			wardName: PropTypes.string.isRequired,
			districtName: PropTypes.string.isRequired,
			provinceName: PropTypes.string.isRequired,
			isDefault: PropTypes.bool,
			onSetDefault: PropTypes.func,
		}),
	),
	selectedAddress: PropTypes.object,
	onSelect: PropTypes.func.isRequired,
	onAddNew: PropTypes.func.isRequired,
};

export default AddressSelectModal;
