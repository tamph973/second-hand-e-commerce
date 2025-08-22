import brandIcon from '@/assets/icons/icon-brand.png';
import Table from '@/components/common/Table';
import { TableCell, TableRow, ToggleSwitch } from 'flowbite-react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import CustomInput from '@/components/form/CustomInput';
import Button from '@/components/common/Button';
import ImageDropzone from '@/components/common/ImageDropzone';
import useAppQuery from '@/hooks/useAppQuery';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaPenClip } from 'react-icons/fa6';
import { FaTrash } from 'react-icons/fa';
import BrandService from '@/services/brand.service';
import ModalConfirm from '@/components/modal/ModalConfirm';
import { useModal } from '@/hooks/useModal';
import { useState } from 'react';
const headers = [
	{
		label: 'Ảnh thương hiệu',
		key: 'image',
	},
	{
		label: 'Tên thương hiệu',
		key: 'name',
	},
	{
		label: 'Trạng thái',
		key: 'status',
	},
	{
		label: 'Hành động',
		key: 'action',
	},
];

export default function AddBrand() {
	const navigate = useNavigate();
	const { isOpen, open, close } = useModal();
	const [brandId, setBrandId] = useState(null);
	const {
		data: brands = [],
		isLoading,
		error,
	} = useAppQuery(['brands'], () => BrandService.getAllBrands(), {
		select: (res) => res.data,
		refetchOnWindowFocus: false,
	});

	const formik = useFormik({
		initialValues: {
			name: '',
			image: null,
		},
		validationSchema: yup.object({
			name: yup.string().required('Tên thương hiệu không được để trống'),
			image: yup.mixed().required('Ảnh thương hiệu không được để trống'),
		}),
		onSubmit: async (values) => {
			try {
				const res = await BrandService.createBrand(values);
				if (res.status === 201) {
					toast.success(res.data.message);
					formik.resetForm();
					window.location.reload();
				}
			} catch (error) {
				toast.error(error);
			}
		},
	});

	// const handleToggleStatus = async (id, status) => {
	// 	try {
	// 		const res = await CategoryService.updateCategory(id, { status });
	// 		if (res.status === 200) {
	// 			toast.success(res.data.message);
	// 			setTimeout(() => {
	// 				window.location.reload();
	// 			}, 500);
	// 		}
	// 	} catch (error) {
	// 		toast.error(error);
	// 	}
	// };

	const handleDelete = async (id) => {
		try {
			const res = await BrandService.deleteBrand(id);
			if (res.status === 200) {
				toast.success(res.data.message);
				window.location.reload();
			}
		} catch (error) {
			toast.error(error);
		}
	};

	if (isLoading) {
		return (
			<div className='container mx-auto text-textPrimary'>
				<div className='flex items-center gap-2 mb-4'>
					<img src={brandIcon} alt='Thêm mới thương hiệu' />
					<h1 className='text-2xl font-bold'>Thêm mới thương hiệu</h1>
				</div>
				<div className='flex justify-center items-center h-64'>
					<div className='text-lg'>Đang tải thương hiệu...</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='container mx-auto text-textPrimary'>
				<div className='flex items-center gap-2 mb-4'>
					<img src={brandIcon} alt='Thêm mới thương hiệu' />
					<h1 className='text-2xl font-bold'>Thêm mới thương hiệu</h1>
				</div>
				<div className='flex justify-center items-center h-64'>
					<div className='text-red-500 text-lg'>Lỗi: {error}</div>
				</div>
			</div>
		);
	}

	return (
		<div className='container mx-auto text-textPrimary'>
			<div className='flex items-center gap-2 mb-4'>
				<img src={brandIcon} alt='Thêm mới thương hiệu' />
				<h1 className='text-2xl font-bold'>Thêm mới thương hiệu</h1>
			</div>

			<div className='card bg-white rounded-lg shadow-md'>
				<div className='card-body p-5'>
					<form onSubmit={formik.handleSubmit} className='space-y-4'>
						<div className='flex items-center gap-4 '>
							<div className='w-1/2 '>
								<CustomInput
									type='text'
									label='Tên thương hiệu'
									id='name'
									name='name'
									value={formik.values.name}
									onBlur={formik.handleBlur}
									onChange={formik.handleChange}
									isRequired={true}
									placeholder='Nhập tên thương hiệu'
								/>
								{formik.touched.name && formik.errors.name && (
									<p className='text-sm text-red-500'>
										{formik.errors.name}
									</p>
								)}
							</div>

							<div className='w-1/2'>
								<ImageDropzone
									label='Ảnh thương hiệu'
									value={formik.values.image}
									onChange={(file) =>
										formik.setFieldValue('image', file)
									}
									error={
										formik.touched.image &&
										formik.errors.image
									}
								/>
							</div>
						</div>
						<div className='flex gap-2 justify-end'>
							<Button
								type='reset'
								className='bg-gray-500 text-white mr-2'
								onClick={() => formik.resetForm()}>
								Reset
							</Button>
							<Button
								type='submit'
								className='bg-primary text-white'>
								Thêm thương hiệu
							</Button>
						</div>
					</form>
				</div>
			</div>

			{brands.length === 0 ? (
				<div className='flex justify-center items-center h-64'>
					<div className='text-lg text-gray-500'>
						Chưa có thương hiệu nào
					</div>
				</div>
			) : (
				<Table
					headers={headers}
					data={brands}
					renderRow={(item) => (
						<TableRow key={item._id} className='hover:!bg-gray-200'>
							<TableCell>
								<img
									src={item.image.url}
									alt={item.name}
									className='w-16 h-16 rounded-full object-cover border border-gray-300'
								/>
							</TableCell>
							<TableCell className='text-textPrimary'>
								{item.name}
							</TableCell>
							<TableCell>
								<ToggleSwitch
									checked={item.status}
									color='blue'
									// onChange={() =>
									// 	handleToggleStatus(
									// 		item._id,
									// 		!item.status,
									// 	)
									// }
								/>
							</TableCell>
							<TableCell>
								<div className='flex items-center gap-2'>
									<Button
										className='bg-blue-500 text-white '
										onClick={() =>
											navigate(
												`/admin/category/${item._id}`,
											)
										}>
										<FaPenClip className='w-4 h-4' />
									</Button>
									<Button
										className='bg-red-500 text-white'
										onClick={() => {
											open();
											setBrandId(item._id);
										}}>
										<FaTrash className='w-4 h-4' />
									</Button>
								</div>
							</TableCell>
						</TableRow>
					)}
				/>
			)}
			<ModalConfirm
				isOpen={isOpen}
				onClose={close}
				onConfirm={() => handleDelete(brandId)}
				message='Bạn có chắc chắn muốn xóa thương hiệu này không?'
				confirmText='Xóa'
				cancelText='Huỷ'
				variant='error'
				loading={false}
				showCancel={true}
			/>
		</div>
	);
}
