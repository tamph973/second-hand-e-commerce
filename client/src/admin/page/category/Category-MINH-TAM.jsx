import categoryIcon from '@/assets/icons/icon-category-setup.png';
import Table from '@/components/common/Table';
import { TableCell, TableRow, ToggleSwitch } from 'flowbite-react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import CustomInput from '@/components/form/CustomInput';
import Button from '@/components/common/Button';
import ImageDropzone from '@/components/common/ImageDropzone';
import CategoryService from '@/services/category.service';
import useAppQuery from '@/hooks/useAppQuery';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaPenClip } from 'react-icons/fa6';
import { FaTrash } from 'react-icons/fa';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import LoadingThreeDot from '@/components/common/LoadingThreeDot';
import { useAppMutation } from '@/hooks/useAppMutation';

const headers = [
	{
		label: 'Ảnh danh mục',
		key: 'image',
	},
	{
		label: 'Tên danh mục',
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

export default function Category() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [localLoading, setLocalLoading] = useState(false);

	const {
		data: categories,
		isLoading,
		error,
	} = useAppQuery(
		['categories', 'parent'],
		() => CategoryService.getAllCategory(),
		{
			select: (res) => res.data,
			refetchOnWindowFocus: false,
		},
	);

	const { mutateAsync: addCategory } = useAppMutation({
		mutationFn: (values) => CategoryService.createCategory(values),
		onSuccess: (res) => {
			toast.success(res?.data?.message || 'Thêm danh mục thành công!');
			queryClient.invalidateQueries(['categories']);
			formik.resetForm();
			window.location.reload();
		},
		onError: (err) => {
			toast.error(err || 'Thêm danh mục thất bại!');
		},
		onSettled: () => {
			setLocalLoading(false);
		},
	});

	const { mutateAsync: updateCategoryStatus } = useAppMutation({
		mutationFn: ({ id, status }) =>
			CategoryService.updateCategoryStatus(id, status),
		onSuccess: (res) => {
			toast.success(res.message);
			queryClient.invalidateQueries({
				queryKey: ['categories', 'parent'],
			});
		},
		onError: (err) => {
			toast.error(err || 'Cập nhật trạng thái danh mục thất bại!');
		},
	});

	const { mutateAsync: deleteCategory } = useAppMutation({
		mutationFn: (id) => CategoryService.deleteCategory(id),
		onSuccess: (res) => {
			toast.success(res.message);
			window.location.reload();
		},
		onError: (err) => {
			toast.error(err || 'Xóa danh mục thất bại!');
		},
	});

	const formik = useFormik({
		initialValues: {
			name: '',
			image: [],
		},
		validationSchema: yup.object({
			name: yup.string().required('Tên danh mục không được để trống'),
			image: yup.mixed().required('Ảnh danh mục không được để trống'),
		}),
		onSubmit: async (values) => {
			setLocalLoading(true);
			await addCategory(values);
		},
	});

	const isFormValid = formik.isValid && formik.dirty && !localLoading;

	const handleToggleStatus = async (id, nextStatus) => {
		// Optimistic update
		const prev = queryClient.getQueryData(['categories', 'parent']);
		queryClient.setQueryData(['categories', 'parent'], (old) => {
			if (!Array.isArray(old)) return old;
			return old.map((cat) =>
				cat.id === id ? { ...cat, status: nextStatus } : cat,
			);
		});
		try {
			await updateCategoryStatus({ id, status: nextStatus });
		} catch (e) {
			// Revert if failed
			queryClient.setQueryData(['categories', 'parent'], prev);
		}
	};

	const handleDelete = async (id) => {
		await deleteCategory(id);
	};

	if (isLoading) {
		return (
			<div className='container mx-auto text-textPrimary'>
				<div className='flex items-center gap-2 mb-4'>
					<img src={categoryIcon} alt='Thiết lập danh mục' />
					<h1 className='text-2xl font-bold'>Thiết lập danh mục</h1>
				</div>
				<div className='flex justify-center items-center h-64'>
					<div className='text-lg'>Đang tải danh mục...</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='container mx-auto text-textPrimary'>
				<div className='flex items-center gap-2 mb-4'>
					<img src={categoryIcon} alt='Thiết lập danh mục' />
					<h1 className='text-2xl font-bold'>Thiết lập danh mục</h1>
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
				<img src={categoryIcon} alt='Thiết lập danh mục' />
				<h1 className='text-2xl font-bold'>Thiết lập danh mục</h1>
			</div>

			<div className='card bg-white rounded-lg shadow-md'>
				<div className='card-body p-5'>
					<form onSubmit={formik.handleSubmit} className='space-y-4'>
						<div className='flex items-center gap-4 '>
							<div className='w-1/2 '>
								<CustomInput
									type='text'
									label='Tên danh mục'
									id='name'
									name='name'
									value={formik.values.name}
									onBlur={formik.handleBlur}
									onChange={formik.handleChange}
									isRequired={true}
									placeholder='Nhập tên danh mục'
								/>
								{formik.touched.name && formik.errors.name && (
									<p className='text-sm text-red-500'>
										{formik.errors.name}
									</p>
								)}
							</div>

							<div className='w-1/2'>
								<ImageDropzone
									maxFiles={1}
									enableModeration={false}
									label='Ảnh danh mục'
									value={formik.values.image}
									onChange={(file) => {
										formik.setFieldValue('image', file);
									}}
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
								Đặt lại
							</Button>
							<Button
								type='submit'
								className={`text-base font-medium text-white rounded-[99px] transition-all duration-200 ${
									isFormValid
										? 'bg-primary hover:bg-primary/80 active:bg-primary/90 shadow-md hover:shadow-lg transform hover:scale-[1.02]'
										: 'bg-gray-400 cursor-not-allowed'
								}`}
								disabled={localLoading || !isFormValid}>
								{localLoading ? (
									<div className='flex items-center justify-center gap-2'>
										<LoadingThreeDot />
										<span>Đang thêm...</span>
									</div>
								) : (
									'Thêm danh mục'
								)}
							</Button>
						</div>
					</form>
				</div>
			</div>

			{categories.length === 0 ? (
				<div className='flex justify-center items-center h-64'>
					<div className='text-lg text-gray-500'>
						Chưa có danh mục nào
					</div>
				</div>
			) : (
				<Table
					headers={headers}
					data={categories}
					renderRow={(item) => (
						<TableRow key={item.id} className='hover:!bg-blue-200'>
							<TableCell>
								<img
									src={item.image}
									alt={item.name}
									className='w-16 h-16 rounded-full object-cover border border-gray-300'
								/>
							</TableCell>
							<TableCell className='text-textPrimary'>
								{item.name}
							</TableCell>
							<TableCell>
								<ToggleSwitch
									className=''
									color='blue'
									checked={Boolean(item.status)}
									onChange={(checked) =>
										handleToggleStatus(item.id, checked)
									}
								/>
							</TableCell>
							<TableCell>
								<div className='flex items-center gap-2'>
									<Button
										className='bg-blue-500 text-white '
										onClick={() =>
											navigate(
												`/admin/category/${item.id}`,
											)
										}>
										<FaPenClip className='w-4 h-4' />
									</Button>
									<Button
										className='bg-red-500 text-white'
										onClick={() => handleDelete(item.id)}>
										<FaTrash className='w-4 h-4' />
									</Button>
								</div>
							</TableCell>
						</TableRow>
					)}
				/>
			)}
		</div>
	);
}
