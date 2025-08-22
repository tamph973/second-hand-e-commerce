import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ThreeDot } from 'react-loading-indicators';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';

import { register, resetState } from '@/store/auth/authSlice';

import MetaTitle from '@/components/common/MetaTitle';
import { showToast } from '@/components/common/CustomToast';
import CustomInput from '@/components/form/CustomInput';
import Button from '@/components/common/Button';
import { registerSchema } from '@/validators/validationSchema';
import GoogleLoginButton from './components/GoogleLoginButton';
import FacebookLoginButton from './components/FacebookLoginButton';
import { registerFields } from '@/constants/formFields';
import toast from 'react-hot-toast';
import AuthService from '@/services/auth.service';
import LoadingThreeDot from '@/components/common/LoadingThreeDot';
import undrawSignUp from '@/assets/images/undraw_sign-up.png';
import { RiErrorWarningFill } from 'react-icons/ri';

const Register = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { error, message, loading } = useSelector((state) => state.auth);
	const [localLoading, setLocalLoading] = useState(false);

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			fullName: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
		validationSchema: registerSchema,
		onSubmit: async (values) => {
			try {
				const res = await AuthService.register(values);
				if (res.status === 201) {
					toast.success(res.data.message);
					setTimeout(() => {
						navigate('/auth/login', {
							state: {
								email: formik.values.email,
							},
						});
					}, 1000);
				}
			} catch (error) {
				toast.error(error);
			}
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
			}, 1000); // delay 1 giây sau khi loading = false

			return () => clearTimeout(timer);
		}
	}, [loading, localLoading]);

	return (
		<>
			<MetaTitle title={'Đăng ký'} />
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
										src={undrawSignUp}
										alt='Sign Up Illustration'
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
											Chào mừng bạn!
										</span>
									</h1>
									<p className='text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-lg mx-auto font-medium'>
										Tham gia cộng đồng mua bán đồ cũ{' '}
										<span className='font-bold text-blue-600'>
											thông minh với AI
										</span>
									</p>
									<div className='flex justify-center space-x-6 text-sm text-gray-500 font-medium'>
										<div className='flex items-center space-x-2'>
											<div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
											<span>Miễn phí đăng ký</span>
										</div>
										<div className='flex items-center space-x-2'>
											<div className='w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-100'></div>
											<span>Giao dịch an toàn</span>
										</div>
									</div>
									<div className='mt-10 flex justify-center items-center'>
										<div className='flex space-x-3'>
											<div
												className='w-4 h-4 rounded-full shadow-lg animate-dot-bounce-1'
												style={{
													background:
														'linear-gradient(135deg, #10b981 0%, #059669 100%)',
												}}></div>
											<div
												className='w-4 h-4 rounded-full shadow-lg animate-dot-bounce-2'
												style={{
													background:
														'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
												}}></div>
											<div
												className='w-4 h-4 rounded-full shadow-lg animate-dot-bounce-3'
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
							className='lg:w-1/2 flex items-center justify-center p-8 lg:p-20  relative'
							style={{
								background:
									'linear-gradient(135deg, #f8faff 0%, #f0f4ff 25%, #e6f3ff 50%, #f0f4ff 75%, #f8faff 100%)',
							}}>
							{/* Subtle background decoration for form */}
							<div className='absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none'>
								<div
									className='absolute top-20 right-20 w-32 h-32  rounded-full blur-2xl'
									style={{
										background:
											'linear-gradient(135deg, #f8faff 0%, #f0f4ff 25%, #e6f3ff 50%, #f0f4ff 75%, #f8faff 100%)',
									}}></div>
								<div
									className='absolute bottom-20 left-20 w-24 h-24  rounded-full blur-xl'
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
													d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'></path>
											</svg>
										</div>
										<h2 className='text-4xl font-black text-gray-800 mb-4 tracking-tight'>
											Đăng ký
										</h2>
										<p className='text-gray-600 text-xl font-medium leading-relaxed'>
											Tạo tài khoản để tham gia <br />
											<span className='text-blue-600 font-bold'>
												trải nghiệm mua sắm
											</span>{' '}
											tuyệt vời
										</p>
									</div>

									<div className='space-y-6'>
										{registerFields.map((field, index) => (
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
												{formik.touched[field.name] &&
													formik.errors[
														field.name
													] && (
														<div className='flex items-center mt-3 gap-1 text-red-500 bg-red-50 px-4 py-2 rounded-xl border border-red-200'>
															<RiErrorWarningFill className='w-4 h-4' />
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
													)}
											</div>
										))}
									</div>

									<Button
										type='submit'
										className={`w-full px-8 py-5 rounded-2xl font-black text-xl transition-all duration-300 mt-10 ${
											!formik.isValid ||
											!formik.dirty ||
											localLoading
												? 'opacity-60 cursor-not-allowed bg-gray-300 text-gray-500 shadow-none'
												: 'cursor-pointer  hover:from-blue-700 hover:via-purple-700 hover:to-teal-700 text-white shadow-2xl hover:shadow-3xl transform  hover:scale-[1.03] active:scale-[0.97] animate-pulse hover:animate-none'
										}`}
										style={{
											background:
												'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
										}}
										disabled={
											!formik.isValid ||
											!formik.dirty ||
											localLoading
										}>
										{!localLoading ? (
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
														d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'></path>
												</svg>
												Đăng ký ngay ✨
											</span>
										) : (
											<div className='flex items-center justify-center h-[32px]'>
												<LoadingThreeDot />
											</div>
										)}
									</Button>

									{/* Enhanced Divider */}
									<div className='relative flex items-center w-full my-10'>
										<div className='flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent'></div>
										<span className='px-6 text-base font-bold text-gray-500 bg-white/90 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm'>
											Hoặc đăng ký với
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
											Bạn đã có tài khoản?
											<Link
												to='/auth/login'
												className='ml-2 font-black text-blue-600 hover:text-blue-700 transition-all duration-200 hover:underline hover:scale-105 inline-block'>
												Đăng nhập ngay →
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
};

Register.propTypes = {
	isValid: PropTypes.bool,
	isInvalid: PropTypes.bool,
	errorMsg: PropTypes.string,
};

export default Register;
