import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { ThreeDot } from 'react-loading-indicators';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { resetState } from '@/store/auth/authSlice';

import MetaTitle from '@/components/common/MetaTitle';
import BreadCrumb from '@/components/common/BreadCrumb';
import CustomInput from '@/components/form/CustomInput';
import Button from '@/components/common/Button';
import { useAppMutation } from '@/hooks/useAppMutation';
import AuthService from '@/services/auth.service';
import toast from 'react-hot-toast';

const ResetPassword = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [localLoading, setLocalLoading] = useState(false);
	const resetPasswordSchema = yup.object({
		email: yup.string().email(''),
		newPassword: yup
			.string()
			.min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
			.matches(/[a-zA-Z]/, 'Mật khẩu phải chứa ít nhất 1 chữ cái')
			.matches(/[0-9]/, 'Mật khẩu phải chứa ít nhất 1 số')
			.matches(
				/[!@#$%^&*()_+[\]{}|;:'",.<>?/\\]/,
				'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt',
			)
			.required('Mật khẩu không được để trống'),
		confirmPassword: yup
			.string()
			.oneOf(
				[yup.ref('newPassword'), null],
				'Mật khẩu xác nhận không khớp',
			)
			.required('Vui lòng nhập lại mật khẩu'),
	});

	const { mutateAsync: resetPasswordMutation } = useAppMutation({
		mutationFn: (values) => AuthService.resetPassword(values),
		onSuccess: (res) => {
			toast.success(res.message);
			navigate('/auth/login');
		},
		onError: (error) => {
			toast.error(error);
		},
	});

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			email: '',
			newPassword: '',
			confirmPassword: '',
		},
		validationSchema: resetPasswordSchema,
		onSubmit: (values) => handleResetPassword(values),
	});

	const handleResetPassword = async (values) => {
		resetPasswordMutation(values);
	};

	useEffect(() => {
		if (resetPasswordMutation.isPending) {
			setLocalLoading(true);
		} else if (!resetPasswordMutation.isPending && localLoading) {
			// Delay để spinner mượt hơn
			const timer = setTimeout(() => {
				setLocalLoading(false);
			}, 1000); // delay 1 giây sau khi loading = false

			return () => clearTimeout(timer);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [resetPasswordMutation.isPending]);

	useEffect(() => {
		if (!location.state || !location.state?.accessResetPassword) {
			navigate('/');
		}
		if (location.state || location.state?.email) {
			formik.values.email = location.state?.email;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location]);

	return (
		<>
			<MetaTitle title={'Đặt lại mật khẩu'} />

			<div className='container w-full p-6 mx-auto border-base-2 rounded-2xl '>
				<div className='w-full max-w-[800] h-auto'>
					<h2 className='mb-6 text-2xl font-bold text-center text-lime-500'>
						Đặt lại mật khẩu
					</h2>
					<div className='flex flex-col items-center mx-auto login-card rounded-2xl'>
						<form
							onSubmit={formik.handleSubmit}
							action=' '
							method='post'
							className='w-[500px] mx-auto bg-white rounded-[12px] border-2 border-lime-200 drop-shadow-md flex flex-col gap-5 p-8'>
							{/* Mật khẩu mới */}
							<div>
								<CustomInput
									type='password'
									label='Mật khẩu'
									id='newPassword'
									name='newPassword'
									value={formik.values.newPassword}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								/>
								{formik.touched.newPassword &&
									formik.errors.newPassword && (
										<p className='text-sm text-red-500'>
											{formik.errors.newPassword}
										</p>
									)}
								<p className='mt-1 text-xs italic text-gray-500'>
									(*) Mật khẩu tối thiểu 8 ký tự, có ít nhất 1
									chữ, 1 số và 1 ký tự đặc biệt. (VD:
									1234abc@)
								</p>
							</div>

							{/* Xác nhận lại mật khẩu */}
							<div>
								<CustomInput
									type='password'
									label='Xác nhận lại mật khẩu'
									id='confirmPassword'
									name='confirmPassword'
									value={formik.values.confirmPassword}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								/>
								{formik.touched.confirmPassword &&
									formik.errors.confirmPassword && (
										<p className='text-sm text-red-500'>
											{formik.errors.confirmPassword}
										</p>
									)}
								<p className='mt-1 text-xs italic text-gray-500'>
									(*) Mật khẩu tối thiểu 8 ký tự, có ít nhất 1
									chữ, 1 số và 1 ký tự đặc biệt. (VD:
									1234abc@)
								</p>
							</div>

							<Button
								type='submit'
								className={`w-full px-4 py-2 transition-all ${
									!formik.isValid ||
									!formik.dirty ||
									localLoading
										? 'opacity-50 cursor-not-allowed bg-gray-400 text-gray-200'
										: 'cursor-pointer bg-teal-500 hover:bg-teal-600 text-white'
								}`}
								disabled={
									!formik.isValid ||
									!formik.dirty ||
									localLoading
								}>
								{localLoading ? (
									<div className='flex items-center justify-center h-[24px]'>
										<ThreeDot
											color='#7f907f'
											size='small'
										/>
									</div>
								) : (
									'Đặt lại mật khẩu'
								)}
							</Button>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default ResetPassword;
