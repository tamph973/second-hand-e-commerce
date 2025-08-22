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
const headers = [
	{
		label: 'Ảnh danh mục',
		key: 'image',
	},
	{
		label: 'Tên danh mục con',
		key: 'name',
	},
	{
		label: 'Danh mục cha',
		key: 'categoryId',
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

export default function SubCategory() {
	const navigate = useNavigate();
	// Lấy tất cả danh mục cha
	const { data: categories = [] } = useAppQuery(
		['categories', 'parent'],
		() =>
			CategoryService.getAllCategory({
				parentId: 'null',
			}),
		{
			select: (res) => res.data,
			refetchOnWindowFocus: false,
		},
	);
	// Lấy tất cả danh mục con
	const {
		data: subCategories = [],
		isLoading,
		error,
	} = useAppQuery(
		['categories', 'sub'],
		() => CategoryService.getSubCategories(),
		{ select: (res) => res.data, refetchOnWindowFocus: false },
	);

	const formik = useFormik({
		initialValues: {
			name: '',
			image: null,
			parentId: '',
		},
		validationSchema: yup.object({
			name: yup.string().required('Tên danh mục con không được để trống'),
			image: yup.mixed().required('Ảnh danh mục con không được để trống'),
			parentId: yup.string().required('Danh mục cha không được để trống'),
		}),
		onSubmit: async (values) => {
			try {
				const res = await CategoryService.createCategory(values);
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

	const handleToggleStatus = async (id, status) => {
		try {
			const res = await CategoryService.updateCategory(id, { status });
			if (res.status === 200) {
				toast.success(res.data.message);
				setTimeout(() => {
					window.location.reload();
				}, 500);
			}
		} catch (error) {
			toast.error(error);
		}
	};

	const handleDelete = async (id) => {
		try {
			const res = await CategoryService.deleteCategory(id);
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
							<div className='flex flex-col gap-4 w-1/2'>
								<div className=' '>
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
									{formik.touched.name &&
										formik.errors.name && (
											<p className='text-sm text-red-500'>
												{formik.errors.name}
											</p>
										)}
								</div>
								<div className=''>
									<CustomInput
										type='select'
										label='Danh mục cha'
										id='parentId'
										name='parentId'
										placeholder='Chọn danh mục'
										value={formik.values.parentId}
										onChange={formik.handleChange}
										options={categories.map((category) => ({
											label: category.name,
											value: category._id,
										}))}
									/>
									{formik.touched.parentId &&
										formik.errors.parentId && (
											<p className='text-sm text-red-500'>
												{formik.errors.parentId}
											</p>
										)}
								</div>
							</div>
							<div className='w-1/2'>
								<ImageDropzone
									maxFiles={1}
									multiple={false}
									label='Ảnh danh mục'
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
								Thêm danh mục
							</Button>
						</div>
					</form>
				</div>
			</div>

			{subCategories.length === 0 ? (
				<div className='flex justify-center items-center h-64'>
					<div className='text-lg text-gray-500'>
						Chưa có danh mục nào
					</div>
				</div>
			) : (
				<Table
					headers={headers}
					data={subCategories}
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
							<TableCell className='text-textPrimary'>
								{item.parentId.name}
							</TableCell>
							<TableCell>
								<ToggleSwitch
									checked={item.status}
									color='blue'
									onChange={() =>
										handleToggleStatus(
											item._id,
											!item.status,
										)
									}
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
										onClick={() => handleDelete(item._id)}>
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
