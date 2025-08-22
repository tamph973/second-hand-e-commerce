import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@/components/modal/Modal';
import { useFormik } from 'formik';
import CustomInput from '@/components/form/CustomInput';

const removeVietnameseTones = (str) => {
	return str
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.replace(/đ/g, 'd')
		.replace(/Đ/g, 'D');
};

const AddBankAccountModal = ({ isOpen, onClose, onSuccess, banks = [] }) => {
	const formik = useFormik({
		initialValues: {
			bankCode: '',
			branch: '',
			accountNumber: '',
			accountName: '',
		},
		validate: (values) => {
			const errors = {};
			if (!values.bankCode) errors.bankCode = 'Vui lòng chọn ngân hàng';
			if (!values.branch) errors.branch = 'Vui lòng nhập chi nhánh';
			if (!values.accountNumber)
				errors.accountNumber = 'Vui lòng nhập số tài khoản';
			if (!values.accountName)
				errors.accountName = 'Vui lòng nhập tên chủ thẻ';
			return errors;
		},
		onSubmit: (values, { resetForm }) => {
			onSuccess?.(values);
			resetForm();
			onClose();
		},
	});

	const handleAccountNameChange = (e) => {
		const value = e.target.value;
		const upperNoSign = removeVietnameseTones(value).toUpperCase();
		formik.setFieldValue('accountName', upperNoSign);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='Thêm Tài Khoản Ngân Hàng'
			size='md'
			variant='form'
			showCloseButton={true}
			closeOnOverlayClick={false}>
			<form
				onSubmit={formik.handleSubmit}
				className='flex flex-col gap-4'>
				<div>
					<CustomInput
						type='select'
						id='bankCode'
						name='bankCode'
						label='Ngân hàng'
						value={formik.values.bankCode}
						onChange={formik.handleChange}
						options={banks.map((bank) => ({
							value: bank.code,
							label: bank.shortName || bank.name,
						}))}
						placeholder='Chọn ngân hàng'
					/>
					{formik.errors.bankCode && (
						<div className='text-red-500 text-sm mt-1'>
							{formik.errors.bankCode}
						</div>
					)}
				</div>
				<div>
					<CustomInput
						type='text'
						id='branch'
						name='branch'
						label='Chi nhánh'
						value={formik.values.branch}
						onChange={formik.handleChange}
						placeholder='Nhập chi nhánh (VD: CN Trà Vinh)'
					/>
					{formik.errors.branch && (
						<div className='text-red-500 text-sm mt-1'>
							{formik.errors.branch}
						</div>
					)}
				</div>
				<div>
					<CustomInput
						type='text'
						id='accountNumber'
						name='accountNumber'
						label='Số tài khoản'
						value={formik.values.accountNumber}
						onChange={formik.handleChange}
						placeholder='Nhập số tài khoản'
					/>
					{formik.errors.accountNumber && (
						<div className='text-red-500 text-sm mt-1'>
							{formik.errors.accountNumber}
						</div>
					)}
				</div>
				<div>
					<CustomInput
						type='text'
						id='accountName'
						name='accountName'
						label='Tên chủ thẻ'
						value={formik.values.accountName}
						onChange={handleAccountNameChange}
						placeholder='Nhập tên chủ thẻ (viết hoa, không dấu)'
					/>
					{formik.errors.accountName && (
						<div className='text-red-500 text-sm mt-1'>
							{formik.errors.accountName}
						</div>
					)}
				</div>
				<div className='flex justify-between mt-4'>
					<button
						type='button'
						className='px-4 py-2 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200'
						onClick={onClose}>
						Trở lại
					</button>
					<button
						type='submit'
						className='px-6 py-2 rounded bg-primary text-white font-semibold hover:bg-secondary transition'>
						Hoàn thành
					</button>
				</div>
			</form>
		</Modal>
	);
};

AddBankAccountModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onSuccess: PropTypes.func,
	banks: PropTypes.array,
};

export default AddBankAccountModal;
