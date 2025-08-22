import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import {
	sellerRegisterFields,
	privateProfileFields,
	publicProfileFields,
} from '@/constants/formFields';
import { useState } from 'react';
import shopRegister from '@/assets/images/shop-register.png';
import LoadingThreeDot from '@/components/common/LoadingThreeDot';

const personalFields = [
	{
		...publicProfileFields.find((f) => f.name === 'fullName'),
		required: true,
	},
	{ ...privateProfileFields.find((f) => f.name === 'email'), required: true },
	{
		...privateProfileFields.find((f) => f.name === 'phoneNumber'),
		required: true,
	},
];

export default function FormSeller({ onSubmit }) {
	const [loading, setLoading] = useState(false);
	const [sellerType, setSellerType] = useState('PERSONAL');

	// Xác định các trường hiển thị theo loại hình
	const fields =
		sellerType === 'BUSINESS' ? sellerRegisterFields : personalFields;

	const initialValues = fields.reduce(
		(acc, field) => {
			acc[field.name] = '';
			return acc;
		},
		{ sellerType },
	);

	const formik = useFormik({
		initialValues,
		enableReinitialize: true,
		validate: (values) => {
			const errors = {};
			fields.forEach((field) => {
				if (field.required !== false && !values[field.name]) {
					errors[
						field.name
					] = `Vui lòng nhập ${field.label.toLowerCase()}`;
				}
			});
			return errors;
		},
		onSubmit: async (values) => {
			setLoading(true);
			try {
				await onSubmit({ ...values, sellerType });
			} finally {
				setLoading(false);
			}
		},
	});

	return (
		<form onSubmit={formik.handleSubmit} className='space-y-6'>
			{/* Title Section */}
			<div className='text-center mb-8'>
				<div className='flex justify-center mb-4'>
					<img
						src={shopRegister}
						alt='Shop Registration'
						className='w-16 h-16'
					/>
				</div>
				<h2 className='text-2xl font-bold text-green-600 mb-3'>
					Đăng ký bán hàng
				</h2>
				<p className='text-gray-600 text-sm leading-relaxed'>
					Vui lòng chọn loại hình và điền đầy đủ thông tin để đăng ký
					trở thành người bán trên hệ thống.
				</p>
			</div>

			{/* Seller Type Selection */}
			<div className='mb-8'>
				<label className='block text-sm font-medium text-gray-700 mb-4'>
					Loại hình kinh doanh
				</label>
				<div className='grid grid-cols-2 gap-4'>
					<label
						className={`relative cursor-pointer group ${
							sellerType === 'PERSONAL'
								? 'ring-2 ring-green-500 bg-green-50'
								: 'bg-gray-50 hover:bg-gray-100'
						} border-2 border-gray-200 rounded-lg p-4 transition-all duration-200`}>
						<input
							type='radio'
							name='sellerType'
							value='PERSONAL'
							checked={sellerType === 'PERSONAL'}
							onChange={() => setSellerType('PERSONAL')}
							className='sr-only text-green-500'
						/>
						<div className='flex items-center space-x-3'>
							<div
								className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
									sellerType === 'PERSONAL'
										? 'border-green-500 bg-green-500'
										: 'border-gray-300'
								}`}>
								{sellerType === 'PERSONAL' && (
									<div className='w-2 h-2 bg-white rounded-full'></div>
								)}
							</div>
							<div>
								<div
									className={`font-medium ${
										sellerType === 'PERSONAL'
											? 'text-green-700'
											: 'text-gray-700'
									}`}>
									Cá nhân
								</div>
								<div className='text-xs text-gray-500 mt-1'>
									Bán hàng cá nhân
								</div>
							</div>
						</div>
					</label>

					<label
						className={`relative cursor-pointer group ${
							sellerType === 'BUSINESS'
								? 'ring-2 ring-green-500 bg-green-50'
								: 'bg-gray-50 hover:bg-gray-100'
						} border-2 border-gray-200 rounded-lg p-4 transition-all duration-200`}>
						<input
							type='radio'
							name='sellerType'
							value='BUSINESS'
							checked={sellerType === 'BUSINESS'}
							onChange={() => setSellerType('BUSINESS')}
							className='sr-only text-green-500'
						/>
						<div className='flex items-center space-x-3'>
							<div
								className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
									sellerType === 'BUSINESS'
										? 'border-green-500 bg-green-500'
										: 'border-gray-300'
								}`}>
								{sellerType === 'BUSINESS' && (
									<div className='w-2 h-2 bg-white rounded-full'></div>
								)}
							</div>
							<div>
								<div
									className={`font-medium ${
										sellerType === 'BUSINESS'
											? 'text-green-700'
											: 'text-gray-700'
									}`}>
									Doanh nghiệp
								</div>
								<div className='text-xs text-gray-500 mt-1'>
									Cửa hàng/Doanh nghiệp
								</div>
							</div>
						</div>
					</label>
				</div>
			</div>

			{/* Form Fields */}
			<div className='space-y-5'>
				{fields.map((field) => (
					<div key={field.id || field.name}>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							{field.label}{' '}
							{field.required && (
								<span className='text-red-500'>*</span>
							)}
						</label>
						<input
							type={field.type || 'text'}
							name={field.name}
							value={formik.values[field.name]}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							placeholder={field.placeholder || field.label}
							className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-950 ${
								formik.touched[field.name] &&
								formik.errors[field.name]
									? 'border-red-300'
									: 'border-gray-300'
							}`}
						/>
						{formik.touched[field.name] &&
							formik.errors[field.name] && (
								<div className='text-red-500 text-sm mt-1'>
									{formik.errors[field.name]}
								</div>
							)}
					</div>
				))}
			</div>

			{/* Submit Button */}
			<div className='pt-4'>
				<button
					type='submit'
					disabled={loading}
					className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
						loading
							? 'bg-gray-400 cursor-not-allowed'
							: 'bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
					}`}>
					{loading ? <LoadingThreeDot /> : 'Bước tiếp theo'}
				</button>
			</div>

			{/* Terms */}
			<div className='text-center pt-4'>
				<p className='text-xs text-gray-500'>
					Bằng việc đăng ký, bạn đồng ý với{' '}
					<a
						href='#'
						className='text-green-600 hover:text-green-700 underline'>
						Điều khoản sử dụng
					</a>{' '}
					và{' '}
					<a
						href='#'
						className='text-green-600 hover:text-green-700 underline'>
						Chính sách bảo mật
					</a>
				</p>
			</div>
		</form>
	);
}

FormSeller.propTypes = {
	onSubmit: PropTypes.func.isRequired,
};
