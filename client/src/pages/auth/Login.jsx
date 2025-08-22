import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';

import MetaTitle from '@/components/common/MetaTitle';
import CustomInput from '@/components/form/CustomInput';
import Button from '@/components/common/Button';
import LoadingThreeDot from '@/components/common/LoadingThreeDot';

import GoogleLoginButton from './components/GoogleLoginButton';
import FacebookLoginButton from './components/FacebookLoginButton';
import { loginSchema } from '@/validators/validationSchema';
import { resetState } from '@/store/auth/authSlice';
import AuthService from '@/services/auth.service';
import { isAdmin } from '@/utils/jwt';
import { getAccessToken } from '@/utils/localStorageUtils';
import { useAppMutation } from '@/hooks/useAppMutation';
import undrawLogin from '@/assets/images/undraw_login.png';
import { loginFields } from '@/constants/formFields';

export default function Login() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const { error, message, loading } = useSelector((state) => state.auth);
	const [localLoading, setLocalLoading] = useState(false);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	// Kiểm tra URL để hiển thị thông báo xác thực
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const verifyStatus = params.get('verify');
		if (verifyStatus === 'true') {
			toast.success('Xác thực email thành công');
		} else if (verifyStatus === 'false') {
			toast.error('Xác thực email thất bại!');
		}

		if (verifyStatus) {
			window.history.replaceState({}, document.title, location.pathname);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.search]);

	const { mutateAsync: login, isPending } = useAppMutation({
		mutationFn: (values) => AuthService.login(values),
		onSuccess: (res) => {
			if (res.status === 200) {
				toast.success(res.data.message);
				// Kiểm tra role của user sau khi đăng nhập thành công
				const token = getAccessToken();
				if (isAdmin(token)) {
					// Nếu là admin, chuyển hướng đến dashboard
					setTimeout(() => {
						navigate('/admin/dashboard');
						window.location.reload();
					}, 500);
				} else {
					// Nếu là user thường, chuyển hướng đến trang chủ
					setTimeout(() => {
						navigate('/');
						// window.location.reload();
					}, 500);
				}
			}
		},
		onError: (err) => {
			toast.error(err || 'Đã có lỗi xảy ra');
		},
	});

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		validationSchema: loginSchema,
		onSubmit: async (values) => {
			await login(values);
		},
	});

	// Loading delay effect
	useEffect(() => {
		if (loading) {
			setLocalLoading(true);
		} else if (!loading && localLoading) {
			// Delay để spinner mượt hơn
			const timer = setTimeout(() => {
				setLocalLoading(false);
			}, 500); // delay 1 giây sau khi loading = false

			return () => clearTimeout(timer);
		}
	}, [loading, localLoading]);

	// Xử lý lỗi
	useEffect(() => {
		if (error) {
			toast.error(message);
			dispatch(resetState());
		}
	}, [error, message, dispatch]);

	return (
		<>
			<MetaTitle title={'Đăng nhập'} />
			<div
				className='min-h-screen flex items-center justify-center p-4 py-12 relative overflow-hidden'
				style={{
					background:
						'linear-gradient(135deg, #f8faff 0%, #f0f4ff 25%, #e6f3ff 50%, #f0f4ff 75%, #f8faff 100%)',
				}}>
				{/* Animated background elements */}
				<div className='absolute inset-0 overflow-hidden pointer-events-none'>
					<div
						className='absolute -top-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse'
						style={{
							background:
								'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.15) 100%)',
						}}></div>
					<div
						className='absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000'
						style={{
							background:
								'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
						}}></div>
					<div
						className='absolute top-1/2 left-1/4 w-64 h-64 rounded-full blur-2xl animate-pulse delay-500'
						style={{
							background:
								'linear-gradient(135deg, rgba(190, 242, 100, 0.10) 0%, rgba(20, 184, 166, 0.10) 100%)',
						}}></div>
				</div>
				<div className='max-w-7xl w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative z-10'>
					<div className='flex flex-col lg:flex-row min-h-[800px]'>
						{/* Image Section */}
						<div
							className='lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative overflow-hidden'
							style={{
								background:
									'linear-gradient(135deg, #f0f4ff 0%, #e6f3ff 50%, #f0f4ff 100%)',
							}}>
							{/* Enhanced background decoration */}
							<div className='absolute top-0 left-0 w-full h-full'>
								<div
									className='absolute top-10 left-10 w-24 h-24 rounded-full blur-xl animate-pulse'
									style={{
										background:
											'linear-gradient(135deg, #bef264 0%, #a3e635 100%)',
									}}></div>
								<div
									className='absolute bottom-10 right-10 w-36 h-36 rounded-full blur-xl animate-pulse delay-700'
									style={{
										background:
											'linear-gradient(135deg, #5eead4 0%, #14b8a6 100%)',
									}}></div>
								<div
									className='absolute top-1/3 right-1/4 w-20 h-20 rounded-full blur-lg animate-pulse delay-300'
									style={{
										background:
											'linear-gradient(135deg, #93c5fd 0%, #3b82f6 100%)',
									}}></div>
								<div
									className='absolute bottom-1/3 left-1/4 w-16 h-16 rounded-full blur-lg animate-pulse delay-1000'
									style={{
										background:
											'linear-gradient(135deg, #c084fc 0%, #9333ea 100%)',
									}}></div>
							</div>

							<div className='text-center relative z-10'>
								<div className='mb-10 transform hover:scale-105 transition-all duration-500 hover:rotate-1'>
									<img
										src={undrawLogin}
										alt='Login Illustration'
										className='w-full max-w-lg mx-auto drop-shadow-2xl filter brightness-105 contrast-105'
									/>
								</div>
								<div className='space-y-6'>
									<h1 className='text-4xl lg:text-6xl font-black leading-tight tracking-tight'>
										<span
											className='bg-clip-text text-transparent'
											style={{
												backgroundImage:
													'linear-gradient(135deg, #1e293b 0%, #3b82f6 50%, #1e293b 100%)',
											}}>
											Chào bạn trở lại!
										</span>
									</h1>
									<p className='text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-lg mx-auto font-medium'>
										Đăng nhập để tiếp tục trải nghiệm{' '}
										<span className='font-bold text-blue-600'>
											mua sắm thông minh
										</span>
									</p>
									<div className='flex justify-center space-x-6 text-sm text-gray-500 font-medium'>
										<div className='flex items-center space-x-2'>
											<div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
											<span>Đăng nhập nhanh</span>
										</div>
										<div className='flex items-center space-x-2'>
											<div className='w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-100'></div>
											<span>Bảo mật cao</span>
										</div>
									</div>
									<div className='mt-10 flex justify-center items-center'>
										<div className='flex space-x-3'>
											<div
												className='w-4 h-4 rounded-full animate-dot-bounce-1 shadow-lg'
												style={{
													background:
														'linear-gradient(135deg, #10b981 0%, #059669 100%)',
												}}></div>
											<div
												className='w-4 h-4 rounded-full animate-dot-bounce-2 shadow-lg'
												style={{
													background:
														'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
												}}></div>
											<div
												className='w-4 h-4 rounded-full animate-dot-bounce-3 shadow-lg'
												style={{
													background:
														'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
												}}></div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Form Section */}
						<div
							className='lg:w-1/2 flex items-center justify-center p-8 lg:p-20 relative'
							style={{
								background:
									'linear-gradient(135deg, #f8faff 0%, #f0f4ff 25%, #e6f3ff 50%, #f0f4ff 75%, #f8faff 100%)',
							}}>
							{/* Subtle background decoration for form */}
							<div className='absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none'>
								<div
									className='absolute top-20 right-20 w-32 h-32 rounded-full blur-2xl'
									style={{
										background:
											'linear-gradient(135deg, #f8faff 0%, #f0f4ff 25%, #e6f3ff 50%, #f0f4ff 75%, #f8faff 100%)',
									}}></div>
								<div
									className='absolute bottom-20 left-20 w-24 h-24 rounded-full blur-xl'
									style={{
										background:
											'linear-gradient(135deg, #f8faff 0%, #f0f4ff 25%, #e6f3ff 50%, #f0f4ff 75%, #f8faff 100%)',
									}}></div>
							</div>
							<div className='w-full max-w-lg relative z-10'>
								<form
									onSubmit={formik.handleSubmit}
									className='space-y-8 bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-white/50'>
									<div className='text-center mb-10'>
										<div
											className='inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 shadow-2xl transform hover:scale-105 transition-transform duration-300'
											style={{
												background:
													'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
											}}>
											<svg
												className='w-10 h-10 text-white'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth='2'
													d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'></path>
											</svg>
										</div>
										<h2 className='text-4xl font-black text-gray-800 mb-4 tracking-tight'>
											Đăng nhập
										</h2>
										<p className='text-gray-600 text-xl font-medium leading-relaxed'>
											Đăng nhập để tiếp tục <br />
											<span className='text-blue-600 font-bold'>
												hành trình mua sắm
											</span>{' '}
											của bạn
										</p>
									</div>

									<div className='space-y-6'>
										{loginFields.map((field, index) => (
											<div
												key={index}
												className='relative group'>
												<CustomInput
													{...field}
													value={
														formik.values[
															field.name
														]
													}
													onChange={
														formik.handleChange
													}
													onBlur={formik.handleBlur}
													className='w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none text-gray-800 placeholder-gray-400 bg-gray-50/50 focus:bg-white hover:border-gray-300 hover:shadow-md font-medium text-lg'
												/>
												{/* {formik.touched[field.name] &&
													formik.errors[
														field.name
													] && (
														<div className='flex items-center mt-3 text-red-500 bg-red-50 px-4 py-2 rounded-xl border border-red-200'>
															<p className='text-sm font-semibold'>
																{
																	formik
																		.errors[
																		field
																			.name
																	]
																}
															</p>
														</div>
													)} */}
											</div>
										))}
									</div>

									<Button
										type='submit'
										className={`w-full px-8 py-5 rounded-2xl font-black text-xl transition-all duration-300 mt-10 ${
										
											!formik.dirty ||
											isPending
												? 'opacity-60 cursor-not-allowed bg-gray-300 text-gray-500 shadow-none'
												: 'cursor-pointer hover:from-blue-700 hover:via-purple-700 hover:to-teal-700 text-white shadow-2xl hover:shadow-3xl transform hover:scale-[1.03] active:scale-[0.97] animate-pulse hover:animate-none'
										}`}
										style={{
											background:
												'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
										}}
										disabled={
											!formik.isValid ||
											!formik.dirty ||
											isPending
										}>
										{isPending ? (
											<div className='flex items-center justify-center h-[32px]'>
												<LoadingThreeDot />
											</div>
										) : (
											<span className='flex items-center justify-center'>
												<svg
													className='w-6 h-6 mr-3'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth='2.5'
														d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'></path>
												</svg>
												Đăng nhập ngay ✨
											</span>
										)}
									</Button>

									{/* Enhanced Divider */}
									<div className='relative flex items-center w-full my-10'>
										<div className='flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent'></div>
										<span className='px-6 text-base font-bold text-gray-500 bg-white/90 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm'>
											Hoặc đăng nhập với
										</span>
										<div className='flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent'></div>
									</div>

									{/* Social Login Buttons */}
									<div className='space-y-5'>
										<GoogleLoginButton />
										<FacebookLoginButton />
									</div>

									{/* Login Links */}
									<div className='text-center space-y-5 pt-8 border-t border-gray-200 mt-10'>
										<p className='text-gray-600 text-lg font-medium'>
											Bạn chưa có tài khoản?
											<Link
												to='/auth/register'
												className='ml-2 font-black text-blue-600 hover:text-blue-700 transition-all duration-200 hover:underline hover:scale-105 inline-block'>
												Đăng ký ngay →
											</Link>
										</p>

										<Link
											to='/auth/forgot-password'
											className='inline-block font-bold text-purple-600 hover:text-purple-700 transition-all duration-200 hover:underline text-base hover:scale-105'>
											🔒 Quên mật khẩu?
										</Link>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
