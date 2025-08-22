import { useState } from 'react';
import { FiInfo } from 'react-icons/fi';
import { FaEdit, FaSave } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { Card, Avatar, FileInput, HelperText } from 'flowbite-react';
import { useFormik } from 'formik';
import LoadingThreeDot from '@/components/common/LoadingThreeDot';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

import Button from '@/components/common/Button';
import CustomInput from '@/components/form/CustomInput';
import convertDate from '@/utils/convertDate';

import UploadService from '@/services/upload.service';
import { publicProfileFields } from '@/constants/formFields';
import UserService from '@/services/user.service';
import { FaCircleCheck } from 'react-icons/fa6';
import ChangeEmailModal from './components/email/ChangeEmailModal';
import VerifyChangeEmailModal from './components/email/VerifyChangeEmailModal';
import useAppQuery from '@/hooks/useAppQuery';
import ModalVerifyPhoneOTP from './components/phone/ModalVerifyPhoneOTP';
import AuthService from '@/services/auth.service';
import { useModal } from '@/hooks/useModal';
import ModalPhoneOTP from './components/phone/ModalPhoneOTP';
import { useSelector } from 'react-redux';
import { formatDate, formatDateForInput } from '@/utils/helpers';

const roleLabels = {
	USER: 'Khách hàng',
	ADMIN: 'Quản trị viên',
	SELLER: 'Người bán',
};

export default function UserProfile() {
	const [avatar, setAvatar] = useState(null);
	const [preview, setPreview] = useState(null);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isEdit, setIsEdit] = useState(true);
	const [isOpenChangeEmail, setIsOpenChangeEmail] = useState(false);
	const [isOpenVerifyChangeEmail, setIsOpenVerifyChangeEmail] =
		useState(false);

	const {
		isOpen: isOpenPhoneOTP,
		open: openPhoneOTP,
		close: closePhoneOTP,
	} = useModal();
	const {
		isOpen: isOpenVerifyPhoneOTP,
		open: openVerifyPhoneOTP,
		close: closeVerifyPhoneOTP,
	} = useModal();

	const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
	const [newEmail, setNewEmail] = useState('');

	// const { data: user, isLoading: isLoadingUser } = useAppQuery(
	// 	['user'],
	// 	() => AuthService.getAuthUser(),
	// 	{
	// 		select: (res) => res.data,
	// 	},
	// );

	const { user } = useSelector((state) => state.user);
	const handleSendOtp = (email) => {
		setNewEmail(email);
		setIsOpenChangeEmail(false); // Đóng ChangeEmailModal
		setTimeout(() => setIsOpenVerifyChangeEmail(true), 100); // Mở VerifyOtpModal sau khi modal cũ đóng
	};

	const handleGoBack = () => {
		setIsOpenVerifyChangeEmail(false); // Đóng VerifyOtpModal
		setIsOpenChangeEmail(true); // Mở lại ChangeEmailModal
	};

	const handleSubmitPhoneOTP = async (phone) => {
		try {
			const res = await AuthService.sendPhoneOTP({ phoneNumber: phone });
			if (res.status === 200) {
				toast.success(res.data.message);
				closePhoneOTP();
				formik.setFieldValue('phoneNumber', phone);
				openVerifyPhoneOTP();
			}
		} catch (error) {
			toast.error(error || 'Có lỗi xảy ra khi gửi mã xác minh');
		}
	};

	const handleVerifyPhoneOTP = async (otp) => {
		try {
			const res = await AuthService.verifyPhoneOTP({
				phoneNumber: formik.values.phoneNumber,
				otp,
			});
			if (res.status === 200) {
				toast.success(res.data.message);
				closeVerifyPhoneOTP();
			}
		} catch (error) {
			toast.error(error || 'Có lỗi xảy ra khi xác minh mã OTP');
		}
	};

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			fullName: user?.fullName || '',
			email: user?.email || '',
			phoneNumber: user?.phoneNumber || '',
			dob: formatDateForInput(user?.dob) || '',
			gender: user?.gender || null,
			address: user?.address || '',
		},
		onSubmit: async (values) => {
			const isUnchanged =
				values.fullName === user?.fullName &&
				values.phoneNumber === user?.phoneNumber &&
				values.dob === formatDateForInput(user?.dob) &&
				values.gender === user?.gender &&
				!avatar;

			if (isUnchanged) {
				setIsEdit(true);
				return;
			}

			setIsUpdating(true);
			try {
				let avatarRes = user?.avatar;
				let uploadAvatarPromise = avatar
					? UploadService.uploadAvatar(avatar)
					: Promise.resolve(null);

				const [uploadResult] = await Promise.all([uploadAvatarPromise]);

				if (uploadResult?.avatar) {
					avatarRes = uploadResult.avatar;
				}

				const res = await UserService.updateUser({
					...values,
					avatar: avatarRes,
				});

				if (res.status === 200) {
					toast.success(res.data.message);
					setIsEdit(true);
					setPreview(null);
					setAvatar(null);
					window.location.reload();
				}
			} catch (error) {
				toast.error(error || 'Có lỗi xảy ra khi cập nhật thông tin');
			} finally {
				setIsUpdating(false);
			}
		},
	});

	const handleUploadAvatar = (file) => {
		const maxSize = 2 * 1024 * 1024;
		if (file.size > maxSize) {
			toast.error('Kích thước ảnh vượt quá 2MB');
			return;
		}

		setAvatar(file);
		setPreview(URL.createObjectURL(file));
	};

	const resetForm = () => {
		formik.resetForm();
		setIsEdit(true);
		setPreview(null);
		setAvatar(null);
	};

	return (
		<>
			<form onSubmit={formik.handleSubmit}>
				<Card
					className='gap-4 p-2 rounded-2xl shadow-md !bg-white !border-none'
					role='region'
					aria-labelledby='profile-heading'>
					<div className='flex items-center justify-between mb-4 pb-2 border-b'>
						<div>
							<h1 className='text-2xl font-bold text-lime-500'>
								Thông tin cá nhân
							</h1>
							<p className='text-gray-900'>
								Quản lý thông tin cá nhân của bạn
							</p>
						</div>
						<div className='flex justify-end gap-3'>
							{isEdit ? (
								<button
									type='button'
									onClick={() => setIsEdit(false)}
									className='flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600 duration-200 shadow-md focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-[99px] px-5 py-2.5 text-center'
									aria-label='Chỉnh sửa thông tin cá nhân'>
									<FaEdit /> Sửa
								</button>
							) : (
								<>
									<Button
										type='submit'
										disabled={isUpdating}
										aria-label='Lưu thông tin cá nhân'
										className={`flex items-center gap-2 bg-green-500 ${
											isUpdating ? 'input-disabled' : ''
										} `}>
										{isUpdating ? (
											<LoadingThreeDot />
										) : (
											<>
												<FaSave /> Lưu
											</>
										)}
									</Button>
									<Button
										className='flex items-center gap-2 bg-red-500 text-white px-4 py-2 hover:bg-red-600 transition-all duration-200 shadow-md'
										type='button'
										onClick={resetForm}
										disabled={isUpdating}>
										<MdCancel /> Hủy
									</Button>
								</>
							)}
						</div>
					</div>

					<div className='flex gap-6'>
						{/* Avatar */}
						<div className='flex flex-col items-center gap-3 w-full sm:w-64 md:w-80 mb-4'>
							<Avatar
								img={preview || user?.avatar?.url || avatar}
								rounded
								size='lg'
								bordered
							/>
							<h3 className='font-bold text-lg text-gray-600'>
								{user?.fullName}
							</h3>
							{!isEdit && (
								<>
									<FileInput
										id='file-upload-helper-text'
										onChange={(e) =>
											handleUploadAvatar(
												e.target.files[0],
											)
										}
										aria-label='Tải lên ảnh đại diện'
									/>
									<HelperText className='mt-1'>
										SVG, PNG, JPG or GIF (Kích thước ảnh
										vượt quá 2MB).
									</HelperText>
								</>
							)}
							<div className='flex items-center gap-1'>
								<p className='text-sm text-gray-600'>
									Vai trò:
								</p>
								<p className='text-sm text-gray-600'>
									{user?.role.includes('SELLER')
										? roleLabels['SELLER']
										: roleLabels['USER']}
								</p>
							</div>
							<p className='text-sm text-gray-600'>
								Tham gia: {convertDate(user?.createdAt)}
							</p>
							<p className='text-sm text-gray-600 tracking-wide'>
								Đăng nhập gần đây lúc{' '}
								{convertDate(user?.lastLogin)}
							</p>
						</div>
						{/* Thông tin cá nhân */}
						<div className='flex-1 space-y-4'>
							<Card className='!bg-white !border-none'>
								<h4 className='font-semibold text-gray-700 flex items-center gap-2 mb-2 '>
									<FiInfo size={16} /> Hồ sơ cá nhân
								</h4>
								<div className='space-y-4'>
									{publicProfileFields.map((field) => (
										<div key={field.id}>
											<CustomInput
												{...field}
												value={
													formik.values[field.name]
												}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												disabled={isEdit}
												className={`w-full px-4 py-2 transition-all ${
													isEdit
														? 'input-disabled'
														: ''
												}`}
											/>
											{field.helper && (
												<p className='text-xs text-gray-500 mt-1'>
													{field.helper}
												</p>
											)}
										</div>
									))}
								</div>
							</Card>
							{/* Thông tin bảo mật */}
							<Card className='!bg-white !border-none'>
								<h4 className='font-semibold text-gray-700 flex items-center gap-2 mb-2 '>
									<FiInfo size={16} /> Thông tin bảo mật
								</h4>
								<div className='space-y-4'>
									{/* Email */}
									<div className='flex items-center gap-x-4 py-2'>
										<span className='min-w-[120px] text-gray-700'>
											Địa chỉ email
										</span>
										{formik.values.email && (
											<>
												<span className='font-medium text-gray-600'>
													{formik.values.email}
												</span>
												<span
													className='flex items-center gap-1 text-green-500 text-sm ml-2'
													title='Email đã xác minh'>
													<FaCircleCheck /> Đã xác
													minh
												</span>
												<button
													className='ml-6 text-blue-600 duration-200 text-sm font-medium hover:underline'
													onClick={() => {
														setIsOpenChangeEmail(
															true,
														);
													}}>
													Thay đổi
												</button>
											</>
										)}
									</div>
									{/* Số điện thoại */}
									<div className='flex items-center gap-2'>
										<span className='w-40 text-gray-600'>
											Số điện thoại
										</span>
										{formik.values.phoneNumber &&
										user.isPhoneVerified ? (
											<div className='flex items-center gap-2'>
												<span className='font-medium text-gray-600'>
													{formik.values.phoneNumber}
												</span>
												<span
													className='flex items-center gap-1 text-green-500 text-sm ml-2'
													title='Email đã xác minh'>
													<FaCircleCheck /> Đã xác
													minh
												</span>
											</div>
										) : (
											<button
												type='button'
												className='text-blue-600 duration-200 text-sm font-medium hover:underline'
												onClick={openPhoneOTP}>
												+ Thêm mới
											</button>
										)}
									</div>
									{/* Xác minh danh tính */}
									<div className='flex items-center gap-2'>
										<span className='w-40 text-gray-600'>
											Xác minh danh tính
										</span>
										{user?.sellerVerification
											.isVerified && (
											<span className='text-green-500'>
												Đã hoàn thành xác minh danh tính
											</span>
										)}
										{!user?.sellerVerification
											.isVerified && (
											<button
												type='button'
												className='border border-blue-600 text-blue-600 rounded-full px-4 py-1 hover:bg-blue-50 transition'
												onClick={() => {
													/* handle verify identity */
												}}>
												Bắt đầu
											</button>
										)}
									</div>
								</div>
							</Card>
						</div>
					</div>
				</Card>
			</form>

			<ChangeEmailModal
				isOpen={isOpenChangeEmail}
				onClose={() => setIsOpenChangeEmail(false)}
				onOpen={() => setIsOpenChangeEmail(true)}
				onSendOtp={handleSendOtp}
				currentEmail={formik.values.email}
				isLoading={isUpdatingEmail}
			/>
			<VerifyChangeEmailModal
				isOpen={isOpenVerifyChangeEmail}
				onClose={() => setIsOpenVerifyChangeEmail(false)}
				onGoBack={handleGoBack}
				currentEmail={formik.values.email}
				newEmail={newEmail}
				isLoading={isUpdatingEmail}
			/>
			<ModalPhoneOTP
				isOpen={isOpenPhoneOTP}
				onClose={closePhoneOTP}
				onSubmit={handleSubmitPhoneOTP}
			/>
			<ModalVerifyPhoneOTP
				isOpen={isOpenVerifyPhoneOTP}
				onClose={closeVerifyPhoneOTP}
				phoneNumber={formik.values.phoneNumber}
				onSubmit={handleVerifyPhoneOTP}
			/>
		</>
	);
}

UserProfile.propTypes = {
	user: PropTypes.shape({
		name: PropTypes.string,
		email: PropTypes.string,
		mobile: PropTypes.string,
		role: PropTypes.oneOf(['USER', 'ADMIN', 'SELLER']),
		avatar: PropTypes.shape({
			url: PropTypes.string,
		}),
		createdAt: PropTypes.string,
		last_login: PropTypes.string,
	}),
	error: PropTypes.string,
	message: PropTypes.string,
};
