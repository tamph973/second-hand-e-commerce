/* eslint-disable react/prop-types */
import AddAddressModal from '@/components/address/AddAddressModal';
import AddressItem from '@/components/address/AddressItem';
import EditAddressModal from '@/components/address/EditAddressModal';
import Button from '@/components/common/Button';
import { useModal } from '@/hooks/useModal';
import { getUserAddress } from '@/store/address/addressSlice';
import { useCallback, useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

const AddressOrder = ({ onAddressSelect }) => {
	const dispatch = useDispatch();
	const [selectedAddress, setSelectedAddress] = useState(null);
	const address = useSelector((state) => state.address.address);
	const {
		isOpen: isOpenAddress,
		open: openAddress,
		close: closeAddress,
	} = useModal();
	const {
		isOpen: isOpenEditAddress,
		open: openEditAddress,
		close: closeEditAddress,
	} = useModal();
	const [selectedId, setSelectedId] = useState(
		address.find((a) => a.isDefault)?._id || address[0]?._id || null,
	);

	// Truyền địa chỉ được chọn về component cha
	useEffect(() => {
		if (selectedId && onAddressSelect) {
			const selectedAddressData = address.find(
				(addr) => addr._id === selectedId,
			);
			onAddressSelect(selectedAddressData);
		}
	}, [selectedId, address, onAddressSelect]);

	const handleSelect = useCallback((id) => {
		setSelectedId(id);
	}, []);

	const handleAddAddress = useCallback(() => {
		dispatch(getUserAddress());
	}, [dispatch]);

	const handleEditAddress = useCallback(() => {
		dispatch(getUserAddress());
	}, [dispatch]);

	return (
		<div className='bg-white rounded-2xl shadow-xl p-6 max-h-[450px] overflow-y-auto custom-scrollbar'>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-900'>
					Địa chỉ giao hàng
				</h2>
				<Button
					onClick={openAddress}
					className='flex items-center bg-blue-600 hover:bg-blue-700 text-white'>
					<FaPlus className='h-5 w-5 mr-1' />
					Thêm địa chỉ mới
				</Button>
			</div>

			<div className='space-y-4'>
				{address.length === 0 ? (
					<div className='text-center py-8'>
						<p className='text-gray-500 mb-4'>
							Bạn chưa có địa chỉ nào
						</p>
						<Button
							type='button'
							onClick={openAddress}
							className='bg-blue-600 hover:bg-blue-700 text-white'>
							Thêm địa chỉ mới
						</Button>
					</div>
				) : (
					<div className=''>
						{address.map((item) => (
							<label
								key={item._id}
								className='relative flex items-center rounded-xl cursor-pointer select-none'>
								<input
									type='radio'
									name='address'
									checked={selectedId === item._id}
									onChange={() => handleSelect(item._id)}
									className='h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 border-2'
								/>
								<div className='flex-1 p-2'>
									<AddressItem
										item={item}
										onEdit={() => {
											setSelectedAddress(item);
											openEditAddress();
										}}
									/>
								</div>
							</label>
						))}
					</div>
				)}
			</div>
			<AddAddressModal
				isOpen={isOpenAddress}
				onClose={closeAddress}
				onSuccess={handleAddAddress}
			/>
			<EditAddressModal
				isOpen={isOpenEditAddress}
				addressData={selectedAddress}
				onClose={closeEditAddress}
				onSuccess={handleEditAddress}
			/>
		</div>
	);
};

export default AddressOrder;
