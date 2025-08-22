import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { ThreeDot } from 'react-loading-indicators';
import { useFormik } from 'formik';
import * as yup from 'yup';
import useCountdown from '@/hooks/useCountdown';
import { useAppMutation } from '@/hooks/useAppMutation';

import { forgotPassword, verifyOTP } from '@/store/auth/authSlice';

import MetaTitle from '@/components/common/MetaTitle';
import { showToast } from '@/components/common/CustomToast';
import CustomInput from '@/components/form/CustomInput';
import Button from '@/components/common/Button';
import AuthService from '@/services/auth.service';
import toast from 'react-hot-toast';
import LoadingThreeDot from '@/components/common/LoadingThreeDot';

const OTP_COUNTDOWN_TIME = 120; // 2 minutes

const ForgotPassword = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const [otpSent, setOtpSent] = useState(false);
	const [initialEmail, setInitialEmail] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { countdown, resetCountdown, startCountdown } =
		useCountdown(OTP_COUNTDOWN_TIME);

	const forgotPasswordSchema = yup.object({
		email: yup.string().required('Email không được để trống'),
		otp: yup
			.string()
			.required('Mã xác nhận không được để trống')
			.matches(/^\d{6}$/, 'Mã xác nhận phải gồm 6 chữ số'),
	});

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			email: initialEmail || '',
			otp: '',
		},
		validationSchema: forgotPasswordSchema,
		onSubmit: async (values) => {
			setIsSubmitting(true);
			try {
				await verifyOTPMutation(values);
			} catch (error) {
				// Error handled in mutation
			} finally {
				setIsSubmitting(false);
			}
		},
	});

	// Mutation cho việc gửi OTP
	const { mutateAsync: sendOTPMutation, isPending: isSendingOTP } =
		useAppMutation({
			mutationFn: (values) => AuthService.forgotPassword(values),
			onSuccess: (res) => {
				toast.success(res.message || 'Gửi mã OTP thành công');
				setOtpSent(true);
				startCountdown();
				// Focus vào input OTP sau khi gửi thành công
				setTimeout(() => {
					document.getElementById('otp')?.focus();
				}, 100);
			},
			onError: (error) => {
				toast.error(error || 'Gửi mã OTP thất bại');
				resetCountdown();
				setOtpSent(false);
			},
		});

	// Mutation cho việc verify OTP
	const { mutateAsync: verifyOTPMutation, isPending: isVerifyingOTP } =
		useAppMutation({
			mutationFn: (values) => AuthService.verifyOTP(values),
			onSuccess: (res) => {
				toast.success(res.data?.message || 'Xác thực OTP thành công');
				// Delay navigation để user thấy toast
				setTimeout(() => {
					navigate('/auth/reset-password', {
						state: {
							email: formik.values.email,
							accessResetPassword: true,
						},
					});
				}, 1000);
			},
			onError: (error) => {
				toast.error(error || 'Xác thực OTP thất bại');
			},
		});

	// Xử lý gửi mã OTP
	const handleSendOTP = useCallback(
		async (email) => {
			if (!email) return;
			await sendOTPMutation({ email });
		},
		[sendOTPMutation],
	);

	useEffect(() => {
		if (location.state?.email) {
			setInitialEmail(location.state.email);
		}
	}, [location.state]);

	useEffect(() => {
		document.getElementById('email')?.focus();
	}, []);

	// Disable form khi đang loading
	const isFormDisabled = isSendingOTP || isVerifyingOTP || isSubmitting;

	return (
		<>
			<MetaTitle title={'Quên mật khẩu'} />
			<div className='container w-full p-6 mx-auto border-base-2 rounded-2xl'>
				<div className='w-full max-w-[800] h-auto'>
					<h2 className='mb-6 text-2xl font-bold text-center text-lime-500'>
						Quên mật khẩu?
					</h2>
					<div className='flex flex-col items-center mx-auto login-card rounded-2xl'>
						<form
							onSubmit={formik.handleSubmit}
							action=' '
							method='post'
							className='w-[500px] mx-auto bg-white rounded-[12px] border-2 border-lime-200 drop-shadow-md flex flex-col gap-5 p-8'>
							{/* Email */}
							<div>
								<CustomInput
									type='email'
									label='Email'
									id='email'
									name='email'
									value={formik.values.email}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									disabled={isFormDisabled}
									className={
										isFormDisabled ? 'opacity-60' : ''
									}
								/>
								{formik.touched.email &&
									formik.errors.email && (
										<p className='text-sm text-red-500'>
											{formik.errors.email}
										</p>
									)}
							</div>

							{/* Gửi mã otp */}
							<div className='flex items-end gap-4 verify-otp'>
								{/* Input OTP */}
								<div className='flex-1'>
									<CustomInput
										type='text'
										label='Nhập mã xác thực'
										placeholder='Nhập mã xác thực'
										id='otp'
										name='otp'
										value={formik.values.otp}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										disabled={!otpSent || isFormDisabled}
										className={`${
											!otpSent || isFormDisabled
												? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
												: 'bg-white text-black border-gray-400 cursor-text focus:border-teal-500'
										}`}
									/>
								</div>

								{/* Button gửi mã */}
								<Button
									onClick={() =>
										handleSendOTP(formik.values.email)
									}
									className={`h-[45px] text-sm w-[140px] text-center transition-all duration-200 ${
										countdown > 0 ||
										!formik.values.email ||
										isSendingOTP
											? 'opacity-50 cursor-not-allowed bg-gray-400 text-gray-200'
											: 'cursor-pointer bg-teal-500 hover:bg-teal-600 text-white shadow-md hover:shadow-lg'
									}`}
									title={
										!formik.values.email
											? 'Vui lòng nhập email trước khi gửi mã'
											: ''
									}
									disabled={
										countdown > 0 ||
										!formik.values.email ||
										isSendingOTP
									}>
									{isSendingOTP ? (
										<div className='flex items-center justify-center'>
											<LoadingThreeDot />
										</div>
									) : countdown > 0 ? (
										`Gửi lại (${countdown}s)`
									) : (
										'Gửi mã'
									)}
								</Button>
							</div>

							<Button
								type='submit'
								className={`w-full px-4 py-2 transition-all duration-200 ${
									/^\d{6}$/.test(formik.values.otp) &&
									!isFormDisabled
										? 'cursor-pointer bg-teal-500 hover:bg-teal-600 text-white shadow-md hover:shadow-lg'
										: 'opacity-50 cursor-not-allowed bg-gray-400 text-gray-200'
								}`}
								disabled={
									!/^\d{6}$/.test(formik.values.otp) ||
									isVerifyingOTP ||
									isSubmitting
								}>
								{isVerifyingOTP || isSubmitting ? (
									<div className='flex items-center justify-center h-[24px]'>
										<LoadingThreeDot />
									</div>
								) : (
									'Xác nhận'
								)}
							</Button>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default ForgotPassword;
