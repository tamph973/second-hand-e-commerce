import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { cccdVerificationFields } from '@/constants/formFields';
import CustomInput from '@/components/form/CustomInput';
import ImageDropzone from '@/components/common/ImageDropzone';
import Button from '@/components/common/Button';
import { useState } from 'react';
import LoadingThreeDot from '@/components/common/LoadingThreeDot';
import { useEffect } from 'react';

export default function CCCDVerificationForm({ onSubmit }) {
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const initialValues = cccdVerificationFields.reduce((acc, field) => {
		acc[field.name] = field.type === 'checkbox' ? false : '';
		return acc;
	}, {});

	const formik = useFormik({
		initialValues,
		validate: (values) => {
			const errors = {};
			cccdVerificationFields.forEach((field) => {
				if (field.required && !values[field.name]) {
					errors[
						field.name
					] = `Vui lòng nhập ${field.label.toLowerCase()}`;
				}
				if (
					field.type === 'checkbox' &&
					field.required &&
					!values[field.name]
				) {
					errors[field.name] = 'Bạn cần đồng ý với điều khoản';
				}
			});
			return errors;
		},
		onSubmit: async (values) => {
			setLoading(true);
			await onSubmit(values);
			setLoading(false);
		},
	});

	return (
		<form onSubmit={formik.handleSubmit} className='space-y-6'>
			{/* Form Fields */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				{cccdVerificationFields.map((field) => {
					// Full width fields
					if (
						field.name === 'idNumber' ||
						field.name === 'fullName' ||
						field.name === 'placeOfIssue'
					) {
						return (
							<div key={field.id} className='md:col-span-2'>
								<CustomInput
									{...field}
									value={formik.values[field.name]}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									error={
										formik.touched[field.name] &&
										formik.errors[field.name]
									}
									fullWidth
								/>
								{field.helper && (
									<div className='text-xs text-gray-500 mt-1'>
										{field.helper}
									</div>
								)}
							</div>
						);
					}

					if (field.type === 'select') {
						return (
							<div key={field.id} className='w-full'>
								<CustomInput
									type='select'
									{...field}
									value={formik.values[field.name]}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									error={
										formik.touched[field.name] &&
										formik.errors[field.name]
									}
									fullWidth
								/>
								{field.helper && (
									<div className='text-xs text-gray-500 mt-1'>
										{field.helper}
									</div>
								)}
							</div>
						);
					}

					if (field.type === 'imageDropzone') {
						return (
							<div key={field.id} className='md:col-span-2'>
								<div className='bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors'>
									<ImageDropzone
										{...field}
										maxFiles={1}
										minFiles={1}
										accept='image/*'
										label={field.label}
										value={formik.values[field.name] || []}
										onChange={(files) => {
											formik.setFieldValue(
												field.name,
												files.slice(0, 1),
											);
										}}
										error={
											formik.touched[field.name] &&
											formik.errors[field.name]
										}
									/>
									{formik.touched[field.name] &&
										formik.errors[field.name] && (
											<div className='text-red-500 text-xs mt-2'>
												{formik.errors[field.name]}
											</div>
										)}
									<div className='mt-3 text-xs text-gray-500'>
										<strong>Lưu ý:</strong> Vui lòng tải lên
										ảnh CCCD/CMT rõ ràng, không bị mờ hoặc
										che khuất thông tin
									</div>
								</div>
							</div>
						);
					}

					if (field.type === 'checkbox') {
						return (
							<div key={field.id} className='md:col-span-2'>
								<div className='flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200'>
									<input
										type='checkbox'
										id={field.id}
										name={field.name}
										checked={formik.values[field.name]}
										onChange={formik.handleChange}
										className='mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2'
									/>
									<div className='flex-1'>
										<label
											htmlFor={field.id}
											className='text-sm text-gray-700 cursor-pointer'>
											{field.label}{' '}
											{field.link && (
												<a
													href={field.link.href}
													target='_blank'
													rel='noopener noreferrer'
													className='text-blue-600 underline hover:text-blue-800'>
													{field.link.label}
												</a>
											)}
										</label>
										{formik.touched[field.name] &&
											formik.errors[field.name] && (
												<div className='text-red-500 text-xs mt-1'>
													{formik.errors[field.name]}
												</div>
											)}
									</div>
								</div>
							</div>
						);
					}

					// Default: text/date input (half width)
					return (
						<div key={field.id} className='w-full'>
							<CustomInput
								{...field}
								value={formik.values[field.name]}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								error={
									formik.touched[field.name] &&
									formik.errors[field.name]
								}
								fullWidth
							/>
							{field.helper && (
								<div className='text-xs text-gray-500 mt-1'>
									{field.helper}
								</div>
							)}
						</div>
					);
				})}
			</div>

			{/* Submit Button */}
			<div className='pt-6 border-t border-gray-200'>
				<Button
					type='submit'
					disabled={loading}
					className='w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl'
					style={{
						background:
							'linear-gradient(to right, #007bff, #00bfff)',
					}}>
					{loading ? (
						<div className='flex items-center justify-center space-x-2'>
							<LoadingThreeDot />
						</div>
					) : (
						<div className='flex items-center justify-center space-x-2'>
							<svg
								className='w-5 h-5'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
								/>
							</svg>
							<span>Hoàn tất xác minh</span>
						</div>
					)}
				</Button>
			</div>
		</form>
	);
}

CCCDVerificationForm.propTypes = {
	onSubmit: PropTypes.func.isRequired,
};
