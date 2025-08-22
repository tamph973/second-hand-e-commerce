import { useState } from 'react';
import { MdAdd } from 'react-icons/md';

import Button from '@/components/common/Button';
import AddressItem from './AddressItem';
import AddAddressModal from './AddAddressModal';
import EditAddressModal from './EditAddressModal';
import AddressService from '@/services/address.service';
import LoadingThreeDot from '@/components/common/LoadingThreeDot';
import useAppQuery from '@/hooks/useAppQuery';
import { useModal } from '@/hooks/useModal';
// import AddressSkeleton from './AddressSkeleton'; // Nếu có

const Address = () => {
	const [selectedAddress, setSelectedAddress] = useState(null);
	const { isOpen: isAddOpen, open: openAdd, close: closeAdd } = useModal();
	const { isOpen: isEditOpen, open: openEdit, close: closeEdit } = useModal();

	const {
		data: address,
		isPending,
		isError,
		refetch,
	} = useAppQuery(['address'], () => AddressService.getUserAddress(), {
		select: (res) => res.data,
		refetchOnWindowFocus: false,
	});
	const handleEditOpen = (address) => {
		setSelectedAddress(address);
		openEdit();
	};

	const handleEditClose = () => {
		closeEdit();
		setSelectedAddress(null);
	};

	const handleAddSuccess = () => {
		closeAdd();
		refetch();
	};

	const handleEditSuccess = () => {
		closeEdit();
		setSelectedAddress(null);
		refetch();
	};

	return (
		<div className='p-4 text-gray-900'>
			<div className='flex items-center justify-between mb-4'>
				<h1 className='text-2xl font-bold text-lime-500'>
					Địa chỉ của tôi
				</h1>
				<Button
					onClick={openAdd}
					className='flex items-center gap-2 bg-green-500 text-white px-4 py-2 hover:bg-green-600 transition-all duration-200 shadow-md'
					type='button'
					aria-label='Thêm địa chỉ mới'>
					<MdAdd size={22} /> Thêm địa chỉ mới
				</Button>
			</div>

			{isPending ? (
				// <AddressSkeleton /> // Nếu có skeleton, dùng thay cho LoadingThreeDot
				<LoadingThreeDot />
			) : isError ? (
				<div className='mt-4 text-red-500'>
					Đã xảy ra lỗi khi tải địa chỉ.
					<Button
						onClick={refetch}
						className='ml-2 text-blue-500 underline'
						type='button'>
						Thử lại
					</Button>
				</div>
			) : !address || address.length === 0 ? (
				<p className='mt-4 text-gray-600 italic'>
					Bạn chưa có địa chỉ nào.
				</p>
			) : (
				<div className='w-full space-y-2 mt-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar'>
					{address.map((item) => (
						<AddressItem
							key={item._id}
							item={item}
							isDefault={item.isDefault}
							onEdit={() => handleEditOpen(item)}
						/>
					))}
				</div>
			)}

			<AddAddressModal
				isOpen={isAddOpen}
				onClose={closeAdd}
				onSuccess={handleAddSuccess}
			/>

			<EditAddressModal
				isOpen={isEditOpen}
				onClose={handleEditClose}
				addressData={selectedAddress}
				onSuccess={handleEditSuccess}
			/>
		</div>
	);
};

export default Address;
