import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { FaCheckCircle, FaPencilAlt, FaRegTrashAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

import Button from '../common/Button';
import { getUserAddress } from '../../store/address/addressSlice';
import AddressService from '@/services/address.service';

const AddressItem = ({ item, onEdit }) => {
	const dispatch = useDispatch();

	const handleDelete = async () => {
		Swal.fire({
			title: 'Bạn chắc chắn muốn xóa địa chỉ?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Xóa',
			confirmButtonColor: '#22c55e', // Màu xanh lá cây (Tailwind: green-500)
			cancelButtonText: 'Hủy',
			cancelButtonColor: '#ef4444', // Màu đỏ (Tailwind: red-500)
		}).then(async (result) => {
			try {
				if (result.isConfirmed) {
					const res = await AddressService.deleteAddress(item._id);
					if (res.status === 200) {
						toast.success(res.data.message);
						window.location.reload();
						dispatch(getUserAddress());
					}
				}
			} catch (error) {
				toast.error(error);
			}
		});
	};

	return (
		<div
			onClick={onEdit}
			className='bg-white shadow-md rounded-lg p-6 mb-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer'>
			<div className='flex justify-between items-start'>
				<div>
					<div className='flex items-center gap-2'>
						<h2 className='text-lg font-semibold text-gray-800'>
							{item?.fullName}
						</h2>
						{item?.isDefault && (
							<span className='flex items-center gap-1 text-sm text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full'>
								<FaCheckCircle size={16} />
								Mặc định
							</span>
						)}
					</div>
					<p className='text-sm text-gray-700 mt-2'>
						<span className='mr-1 font-medium text-gray-800'>
							(+84)
						</span>
						<span className='tracking-wider'>
							{item?.phoneNumber}
						</span>
					</p>
					<div className='flex items-center gap-2 mt-2'>
						<p className='text-sm text-gray-600 truncate max-w-[180px]'>
							{item?.addressDetail}
						</p>
						<span className='text-gray-400'>•</span>
						<p
							title={`${item?.wardName}, ${item?.districtName}, ${item?.provinceName}`}
							className='text-sm text-gray-600 truncate '>
							{item?.wardName}, {item?.districtName},{' '}
							{item?.provinceName}
						</p>
					</div>
				</div>

				<div className='flex gap-3'>
					<Button
						onClick={onEdit}
						className='flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-all'>
						<FaPencilAlt size={18} />
						Sửa
					</Button>
					<Button
						onClick={(e) => {
							e.stopPropagation();
							handleDelete();
						}}
						className='flex items-center gap-2 bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-all'>
						<FaRegTrashAlt size={18} />
						Xóa
					</Button>
				</div>
			</div>
		</div>
	);
};

AddressItem.propTypes = {
	item: PropTypes.shape({
		_id: PropTypes.string,
		fullName: PropTypes.string,
		phoneNumber: PropTypes.string,
		addressDetail: PropTypes.string,
		wardName: PropTypes.string,
		districtName: PropTypes.string,
		provinceName: PropTypes.string,
		isDefault: PropTypes.bool,
	}).isRequired,
	onEdit: PropTypes.func.isRequired,
};

export default AddressItem;
