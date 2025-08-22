import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';

import logo from '@/assets/images/logo.png'; // Thay bằng logo phù hợp

import MetaTitle from '@/components/common/MetaTitle';
import CustomInput from '@/components/form/CustomInput';
import Button from '@/components/common/Button';
import LoadingThreeDot from '@/components/common/LoadingThreeDot';

import { loginSchema } from '@/validators/validationSchema';
import AuthService from '@/services/auth.service';
import { isAdmin } from '@/utils/jwt';
import { getAccessToken } from '@/utils/localStorageUtils';

export default function AdminLogin() {
	const navigate = useNavigate();
	const { loading } = useSelector((state) => state.auth);
	const [localLoading, setLocalLoading] = useState(false);

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		validationSchema: loginSchema,
		onSubmit: async (values) => {
			setLocalLoading(true);
			try {
				const res = await AuthService.login(values);
				const token = getAccessToken();
				if (res.status === 200 && isAdmin(token)) {
					toast.success('Đăng nhập quản trị viên thành công!');
					setTimeout(() => {
						navigate('/admin/dashboard', {
							state: {
								accessAdmin: true,
							},
						});
					}, 500);
				} else {
					toast.error('Tài khoản của bạn không có quyền quản trị!');
					setLocalLoading(false);
				}
			} catch (error) {
				toast.error(error);
				setLocalLoading(false);
			} finally {
				setLocalLoading(false);
			}
		},
	});

	useEffect(() => {
		if (loading) {
			setLocalLoading(true);
		} else if (!loading && localLoading) {
			const timer = setTimeout(() => {
				setLocalLoading(false);
			}, 500);
			return () => clearTimeout(timer);
		}
	}, [loading, localLoading]);

	return (
		<>
			<MetaTitle title={'Đăng nhập Quản trị viên'} />
			<div className='flex items-center justify-center w-full h-screen bg-gray-50'>
				<div className='flex w-full max-w-4xl h-[80vh] bg-white shadow-lg rounded-lg overflow-hidden'>
					{/* Left Side */}
					<div
						className='relative hidden w-1/2 bg-cover md:flex'
						style={{
							backgroundImage:
								"url('https://img.freepik.com/free-vector/account-concept-illustration_114360-399.jpg?ga=GA1.1.1126539911.1750442104&semt=ais_hybrid&w=740')",
						}}>
						<div className='absolute inset-0 bg-slate-800 opacity-60'></div>
						<div className='relative z-10 flex flex-col items-center justify-center w-full p-12 text-center text-white'>
							<img
								src={logo}
								alt='Logo'
								className='w-1/2 h-auto mb-6'
							/>
							<h1 className='text-3xl font-bold'>
								Nền tảng Đồ cũ Thông minh
							</h1>
							<p className='mt-4 text-lg max-w-sm'>
								Nơi công nghệ máy học và sự kiểm duyệt tạo nên
								một cộng đồng mua bán bền vững và đáng tin cậy.
							</p>
						</div>
					</div>

					{/* Right Side - Login Form */}
					<div className='w-full md:w-1/2 p-8 flex flex-col justify-center'>
						<h2 className='text-4xl font-semibold text-gray-800 mb-6'>
							Đăng nhập
						</h2>
						<p className='text-gray-600 mb-6'>
							Chào mừng bạn đến với hệ thống quản trị viên
						</p>

						<form
							onSubmit={formik.handleSubmit}
							className='space-y-4'>
							{/* Email */}
							<div>
								<CustomInput
									type='email'
									label='Email'
									id='email'
									name='email'
									value={formik.values.email}
									onChange={formik.handleChange}
									placeholder='Enter your email'
									className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
								/>
								{formik.touched.email &&
									formik.errors.email && (
										<p className='text-sm text-red-500 mt-1'>
											{formik.errors.email}
										</p>
									)}
							</div>

							{/* Password */}
							<div>
								<CustomInput
									type='password'
									label='Mật khẩu'
									id='password'
									placeholder={'Nhập mật khẩu'}
									name='password'
									value={formik.values.password}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									autoComplete='password'
								/>
								{formik.touched.password &&
									formik.errors.password && (
										<p className='text-sm text-red-500 mt-1'>
											{formik.errors.password}
										</p>
									)}
							</div>

							{/* <div className='flex items-center justify-between text-sm'>
								<div className='flex items-center'>
									<input type='checkbox' className='mr-2' />
									<span className='text-gray-600'>
										Remember me
									</span>
								</div>
								<Link
									to='/auth/forgot-password'
									className='text-blue-600 hover:underline'>
									Forgot password?
								</Link>
							</div> */}
							{/* 
							<div className='flex items-center'>
								<input type='checkbox' className='mr-2' />
								<span className='text-gray-600'>
									I&apos;m not a robot
								</span>
								<img
									src='https://www.google.com/recaptcha/api2/anchor?ar=1'
									alt='reCAPTCHA'
									className='w-16 h-auto ml-2'
								/>
							</div> */}

							<Button
								type='submit'
								className={`w-full py-2 rounded-md text-white font-semibold transition-colors ${
									!formik.isValid ||
									!formik.dirty ||
									localLoading
										? 'bg-gray-400 cursor-not-allowed'
										: 'bg-blue-600 hover:bg-blue-700'
								}`}
								disabled={
									!formik.isValid ||
									!formik.dirty ||
									localLoading
								}>
								{localLoading ? (
									<LoadingThreeDot />
								) : (
									'Đăng nhập'
								)}
							</Button>

							<div className='text-sm text-gray-600 mt-4'>
								Email: admin@admin.com
								<br />
								Password: Admin@123
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}
