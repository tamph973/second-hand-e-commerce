import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { ToggleSwitch } from 'flowbite-react';
import toast from 'react-hot-toast';

import Button from '@/components/common/Button';
import CustomInput from '@/components/form/CustomInput';
import LoadingThreeDot from '@/components/common/LoadingThreeDot';

import { addressFields } from '@/configs/fieldsConfig';
import { addressSchema } from '@/validators/validationSchema';
import { useAddressQuery } from '@/hooks/useAddressQuery';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import AddressService from '@/services/address.service';

const AddressForm = ({
	onSuccess,
	onCancel,
	initialValues = null,
	isEdit = false,
}) => {
	const queryClient = useQueryClient();
	const [localLoading, setLocalLoading] = useState(false);
	const firstInputRef = useRef(null);

	const { mutateAsync: addAddress } = useMutation({
		mutationFn: (values) => AddressService.createAddress(values),
		onSuccess: (res) => {
			toast.success(res?.data?.message || 'Thêm địa chỉ thành công!');
			queryClient.invalidateQueries(['address']);
			onSuccess?.();
		},
		onError: (err) => {
			toast.error(err?.message || 'Thêm địa chỉ thất bại!');
		},
		onSettled: () => {
			setLocalLoading(false);
		},
	});

	const { mutateAsync: updateAddress } = useMutation({
		mutationFn: ({ id, data }) => AddressService.updateAddress(id, data),
		onSuccess: (res) => {
			toast.success(res?.data?.message || 'Cập nhật địa chỉ thành công!');
			queryClient.invalidateQueries(['address']);
			onSuccess?.();
		},
		onError: (err) => {
			toast.error(err?.message || 'Cập nhật địa chỉ thất bại!');
		},
		onSettled: () => {
			setLocalLoading(false);
		},
	});
	const formik = useFormik({
		initialValues: initialValues || {
			fullName: '',
			phoneNumber: '',
			provinceCode: '',
			provinceName: '',
			districtCode: '',
			districtName: '',
			wardCode: '',
			wardName: '',
			addressDetail: '',
			isDefault: true,
		},
		validationSchema: addressSchema,
		enableReinitialize: true,
		onSubmit: async (values) => {
			setLocalLoading(true);
			if (isEdit && initialValues?._id) {
				await updateAddress({ id: initialValues._id, data: values });
			} else {
				await addAddress(values);
			}
		},
	});
	const {
		provinces,
		districts,
		wards,
		isLoading: loadingProvinces,
		isError: errorProvinces,
		refetch: refetchProvinces,
		isLoading1: loadingWards,
		isError1: errorWards,
		refetch1: refetchWards,
		isLoading2: loadingDistricts,
		isError2: errorDistricts,
		refetch2: refetchDistricts,
	} = useAddressQuery(formik.values.provinceCode, formik.values.districtCode);

	useEffect(() => {
		setTimeout(() => {
			if (firstInputRef.current) {
				firstInputRef.current.focus();
			}
		}, 100);
	}, []);

	const isFormValid = formik.isValid && formik.dirty && !localLoading;

	const handleChangeProvince = (e) => {
		formik.handleChange(e);
		// Tìm provinceName trong provinces
		const province = provinces.find((p) => p.code === e.target.value);
		if (province) {
			formik.setFieldValue('provinceName', province.name);
		}
	};

	const handleChangeDistrict = (e) => {
		formik.handleChange(e);
		const district = districts.find((d) => d.code === e.target.value);
		if (district) {
			formik.setFieldValue('districtName', district.name);
		}
	};

	const handleChangeWard = (e) => {
		formik.handleChange(e);
		const ward = wards.find((w) => w.code === e.target.value);
		if (ward) {
			formik.setFieldValue('wardName', ward.name);
		}
	};

	return (
		<form
			onSubmit={formik.handleSubmit}
			className='space-y-2'
			autoComplete='off'
			noValidate>
			{addressFields.map((field) => (
				<div key={field.name}>
					<CustomInput
						{...field}
						id={field.name}
						value={formik.values[field.name]}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						placeholder={field.placeholder}
						disabled={localLoading}
						isRequired={true}
					/>
					{formik.touched[field.name] &&
						formik.errors[field.name] && (
							<div className='text-red-500 text-sm'>
								{formik.errors[field.name]}
							</div>
						)}
				</div>
			))}

			{/* Tỉnh/Thành phố */}
			<div className='space-y-1'>
				<CustomInput
					type='select'
					id='provinceCode'
					name='provinceCode'
					placeholder='Tỉnh/Thành phố'
					value={
						formik.values.provinceCode ||
						initialValues?.provinceCode
					}
					onChange={handleChangeProvince}
					options={provinces.map((p) => ({
						value: p.code,
						label: p.name,
					}))}
					label='Tỉnh/Thành phố'
					isRequired={true}
				/>
				{errorProvinces && (
					<div className='text-red-500 text-sm'>
						Lỗi tải tỉnh/thành phố.{' '}
						<button type='button' onClick={refetchProvinces}>
							Thử lại
						</button>
					</div>
				)}
				{formik.touched.provinceCode && formik.errors.provinceCode && (
					<div className='text-red-500 text-sm'>
						{formik.errors.provinceCode}
					</div>
				)}
			</div>
			{/* Quận/Huyện */}
			<div className='space-y-1'>
				<CustomInput
					type='select'
					id='districtCode'
					name='districtCode'
					placeholder='Quận/Huyện'
					value={formik.values.districtCode}
					onChange={handleChangeDistrict}
					options={districts.map((d) => ({
						value: d.code,
						label: d.name,
					}))}
					label='Quận/Huyện'
					isRequired={true}
				/>
				{errorDistricts && (
					<div className='text-red-500 text-sm'>
						Lỗi tải quận/huyện.{' '}
						<button type='button' onClick={refetchDistricts}>
							Thử lại
						</button>
					</div>
				)}
				{formik.touched.districtCode && formik.errors.districtCode && (
					<div className='text-red-500 text-sm'>
						{formik.errors.districtCode}
					</div>
				)}
			</div>

			{/* Xã/Phường */}
			<div className='space-y-1'>
				<CustomInput
					type='select'
					id='wardCode'
					name='wardCode'
					placeholder='Xã/Phường'
					value={formik.values.wardCode}
					onChange={handleChangeWard}
					options={wards.map((w) => ({
						value: w.code,
						label: w.name,
					}))}
					label='Xã/Phường'
					isRequired={true}
				/>
				{errorWards && (
					<div className='text-red-500 text-sm'>
						Lỗi tải xã/phường.{' '}
						<button type='button' onClick={refetchWards}>
							Thử lại
						</button>
					</div>
				)}
				{formik.touched.wardCode && formik.errors.wardCode && (
					<div className='text-red-500 text-sm'>
						{formik.errors.wardCode}
					</div>
				)}
			</div>

			{/* Địa chỉ chi tiết */}
			<div className='space-y-1'>
				<CustomInput
					id='addressDetail'
					name='addressDetail'
					label='Địa chỉ chi tiết (Không bắt buộc)'
					type='text'
					value={formik.values.addressDetail}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					placeholder='Nhập địa chỉ chi tiết'
					className='!bg-white !text-gray-900'
					disabled={localLoading}
					isRequired={false}
				/>
				{formik.touched.addressDetail &&
					formik.errors.addressDetail && (
						<div className='text-red-500 text-sm'>
							{formik.errors.addressDetail}
						</div>
					)}
			</div>

			<div className='pt-2'>
				<ToggleSwitch
					checked={formik.values.isDefault}
					color='blue'
					onChange={(checked) =>
						formik.setFieldValue('isDefault', checked)
					}
					label='Đặt làm địa chỉ mặc định'
					className='!bg-white !text-textPrimary !ring-offset-0'
					disabled={localLoading}
				/>
			</div>

			<div className='flex gap-3 pt-4'>
				<Button
					type='submit'
					className={`flex-1 text-base font-medium text-white rounded-[99px] transition-all duration-200 ${
						isFormValid
							? 'bg-teal-600 hover:bg-teal-700 active:bg-teal-800 shadow-md hover:shadow-lg transform hover:scale-[1.02]'
							: 'bg-gray-400 cursor-not-allowed'
					}`}
					disabled={localLoading || !isFormValid}
					aria-label={isEdit ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ'}>
					{localLoading ? (
						<div className='flex items-center justify-center gap-2'>
							<LoadingThreeDot />
							<span>
								{isEdit ? 'Đang cập nhật...' : 'Đang thêm...'}
							</span>
						</div>
					) : isEdit ? (
						'Cập nhật địa chỉ'
					) : (
						'Thêm địa chỉ'
					)}
				</Button>
				<Button
					type='button'
					onClick={onCancel}
					className='w-32 text-base font-medium rounded-[99px] bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-200'
					disabled={localLoading}
					aria-label='Đóng'>
					Đóng
				</Button>
			</div>
		</form>
	);
};

AddressForm.propTypes = {
	onSuccess: PropTypes.func,
	onCancel: PropTypes.func.isRequired,
	initialValues: PropTypes.object,
	isEdit: PropTypes.bool,
};

AddressForm.defaultProps = {
	isEdit: false,
};

export default AddressForm;
