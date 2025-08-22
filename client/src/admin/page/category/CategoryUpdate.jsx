import categoryIcon from '@/assets/icons/icon-category-setup.png';
import { useFormik } from 'formik';
import * as yup from 'yup';
import CustomInput from '@/components/form/CustomInput';
import Button from '@/components/common/Button';
import ImageDropzone from '@/components/common/ImageDropzone';
import CategoryService from '@/services/category.service';
import useAppQuery from '@/hooks/useAppQuery';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import LoadingThreeDot from '@/components/common/LoadingThreeDot';

export default function CategoryUpdate() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [localLoading, setLocalLoading] = useState(false);
	const queryClient = useQueryClient();

	const { data: category } = useAppQuery(
		['category', id],
		() => CategoryService.getCategoryById(id),
		{
			select: (res) => res.data,
		},
	);
	const { mutateAsync: updateCategory } = useMutation({
		mutationFn: (values) => CategoryService.updateCategory(id, values),
		onSuccess: (res) => {
			toast.success(res.data.message);
			queryClient.invalidateQueries(['category', id]);
			setTimeout(() => {
				window.location.reload();
				navigate(-1);
			}, 500);
		},
		onError: (err) => {
			toast.error(err || 'Cập nhật danh mục thất bại!');
		},
		onSettled: () => {
			setLocalLoading(false);
		},
	});
	const formik = useFormik({
		initialValues: {
			name: category?.name || '',
			image: category?.image ? [category.image] : [],
		},
		enableReinitialize: true,
		validationSchema: yup.object({
			name: yup.string().required('Tên danh mục không được để trống'),
			image: yup.mixed().required('Ảnh danh mục không được để trống'),
		}),
		onSubmit: async (values) => {
			setLocalLoading(true);
			await updateCategory(values);
		},
	});

	const isFormValid = formik.isValid && formik.dirty && !localLoading;
	return (
		<div className='container mx-auto text-textPrimary'>
			<div className='flex items-center gap-2 mb-4'>
				<img src={categoryIcon} alt='Cập nhật danh mục' />
				<h1 className='text-2xl font-bold'>Cập nhật danh mục</h1>
				<Button
					onClick={() => navigate(-1)}
					className='px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm font-medium flex items-center gap-2 text-textPrimary'>
					<FaArrowLeft className='w-2 h-2' />
					Quay lại
				</Button>
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
								className={`text-base font-medium text-white rounded-[99px] transition-all duration-200 ${
									isFormValid
										? 'bg-primary hover:bg-primary/80 active:bg-primary/90 shadow-md hover:shadow-lg transform hover:scale-[1.02]'
										: 'bg-gray-400 cursor-not-allowed'
								}`}
								disabled={localLoading || !isFormValid}
								aria-label='Cập nhật danh mục'>
								{localLoading ? (
									<div className='flex items-center justify-center gap-2'>
										<LoadingThreeDot />
										<span>Đang cập nhật...</span>
									</div>
								) : (
									'Cập nhật danh mục'
								)}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
