import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CustomInput from '@/components/form/CustomInput';
import Button from '@/components/common/Button';
import { useAddressQuery } from '@/hooks/useAddressQuery';

const AddressSelectForm = ({ onSelect, initialValue }) => {
	const [address, setAddress] = useState(
		initialValue || {
			provinceCode: '',
			provinceName: '',
			districtCode: '',
			districtName: '',
			wardCode: '',
			wardName: '',
			detail: '',
		},
	);

	const {
		provinces = [],
		districts = [],
		wards = [],
	} = useAddressQuery(address.provinceCode, address.districtCode);

	// Khi chọn tỉnh, reset phường/xã
	const handleProvinceChange = (e) => {
		const code = e.target.value;
		const province = provinces.find((p) => p.code === code);
		setAddress((prev) => ({
			...prev,
			provinceCode: code,
			provinceName: province ? province.name : '',
			districtCode: '',
			districtName: '',
			wardCode: '',
			wardName: '',
		}));
	};

	const handleDistrictChange = (e) => {
		const code = e.target.value;
		const district = districts.find((d) => d.code === code);
		setAddress((prev) => ({
			...prev,
			districtCode: code,
			districtName: district ? district.name : '',
			wardCode: '',
			wardName: '',
		}));
	};

	const handleWardChange = (e) => {
		const code = e.target.value;
		const ward = wards.find((w) => w.code === code);
		setAddress((prev) => ({
			...prev,
			wardCode: code,
			wardName: ward ? ward.name : '',
		}));
	};
	const handleDetailChange = (e) => {
		setAddress((prev) => ({ ...prev, detail: e.target.value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSelect(address);
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-3'>
			<CustomInput
				type='select'
				id='provinceCode'
				name='provinceCode'
				label='Tỉnh/Thành phố'
				placeholder='Tỉnh/Thành phố'
				value={address.provinceCode}
				onChange={handleProvinceChange}
				options={provinces.map((p) => ({
					value: p.code,
					label: p.name,
				}))}
				isRequired={true}
			/>
			<CustomInput
				type='select'
				id='districtCode'
				name='districtCode'
				label='Quận/Huyện'
				placeholder='Quận/Huyện'
				value={address.districtCode}
				onChange={handleDistrictChange}
				options={districts.map((d) => ({
					value: d.code,
					label: d.name,
				}))}
				isRequired={true}
				disabled={!address.provinceCode}
			/>
			<CustomInput
				type='select'
				id='wardCode'
				name='wardCode'
				label='Phường/Xã'
				placeholder='Phường/Xã'
				value={address.wardCode}
				onChange={handleWardChange}
				options={wards.map((w) => ({
					value: w.code,
					label: w.name,
				}))}
				isRequired={true}
				disabled={!address.provinceCode}
			/>
			<CustomInput
				id='detail'
				name='detail'
				label='Địa chỉ cụ thể (không bắt buộc)'
				type='text'
				value={address.detail}
				onChange={handleDetailChange}
				placeholder='Nhập địa chỉ cụ thể'
				isRequired={false}
			/>
			<div className='flex justify-end pt-2'>
				<Button
					type='submit'
					className='bg-primary text-white rounded px-6 py-2'>
					XONG
				</Button>
			</div>
		</form>
	);
};

AddressSelectForm.propTypes = {
	onSelect: PropTypes.func.isRequired,
	onCancel: PropTypes.func,
	initialValue: PropTypes.object,
};

export default AddressSelectForm;
