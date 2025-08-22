import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';

import Button from '@/components/common/Button';
import CustomInput from '@/components/form/CustomInput';
import { changePasswordSchema } from '@/validators/validationSchema';
import { changePasswordFields } from '@/configs/fieldsConfig';
import LoadingThreeDot from '@/components/common/LoadingThreeDot';
import Modal from '@/components/modal/Modal';

const ChangePasswordModal = ({ isOpen, onClose, onSubmit }) => {
	const [localLoading, setLocalLoading] = useState(false);

	const formik = useFormik({
		initialValues: {
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		},
		validationSchema: changePasswordSchema,
		enableReinitialize: false,
		onSubmit: async (values) => {
			setLocalLoading(true);
			try {
				await onSubmit(values);
				// Modal sẽ được đóng từ component cha khi thành công
			} finally {
				setLocalLoading(false);
			}
		},
	});

	const handleClose = () => {
		// Chỉ cho phép đóng khi không đang loading
		if (!localLoading) {
			formik.resetForm();
			onClose();
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title='Đổi mật khẩu'
			variant='form'
			size='lg'
			showCloseButton={true}
			closeOnOverlayClick={!localLoading} // Không cho phép click outside khi đang loading
		>
			<div className='space-y-6'>
				{/* Password Requirements */}
				<div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
					<p className='text-sm text-blue-800'>
						<strong>Yêu cầu mật khẩu:</strong> Tối thiểu 8 ký tự, có
						ít nhất 1 chữ cái, 1 số và 1 ký tự đặc biệt.
						<br />
						<code className='text-blue-600 font-mono'>
							Ví dụ: 1234abc@
						</code>
					</p>
				</div>

				{/* Form */}
				<form onSubmit={formik.handleSubmit} className='space-y-4'>
					{changePasswordFields.map(
						({ name, label, type, placeholder }) => (
							<div key={name}>
								<CustomInput
									id={name}
									name={name}
									label={label}
									type={type || 'password'}
									value={formik.values[name]}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									placeholder={
										placeholder ||
										`Nhập ${label.toLowerCase()}`
									}
									disabled={localLoading}
								/>
								{formik.touched[name] &&
									formik.errors[name] && (
										<p className='text-sm text-red-500 mt-1'>
											{formik.errors[name]}
										</p>
									)}
							</div>
						),
					)}

					{/* Forgot Password Link */}
					<div className='text-center'>
						<Link
							to='/auth/forgot-password'
							state={{ email: formik.values.email }}
							className='text-sm text-lime-600 hover:text-lime-700 underline font-medium'>
							Quên mật khẩu?
						</Link>
					</div>

					{/* Submit Button */}
					<div className='flex justify-center pt-4'>
						<Button
							type='submit'
							className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
								!formik.isValid || !formik.dirty || localLoading
									? 'bg-gray-300 text-gray-500 cursor-not-allowed'
									: 'bg-lime-600 hover:bg-lime-700 text-white shadow-md hover:shadow-lg'
							}`}
							disabled={
								!formik.isValid || !formik.dirty || localLoading
							}>
							{localLoading ? (
								<div className='flex items-center space-x-2'>
									<LoadingThreeDot />
								</div>
							) : (
								'Đổi mật khẩu'
							)}
						</Button>
					</div>
				</form>
			</div>
		</Modal>
	);
};

ChangePasswordModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
};

export default ChangePasswordModal;
