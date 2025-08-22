import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordInput = ({
	id,
	label,
	name,
	value,
	onChange,
	onBlur,
	placeholder,
	className = '',
	isRequired,
	...props
}) => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className='relative z-0 w-full'>
			{label && (
				<label
					htmlFor={id}
					className='block mb-2 text-sm font-medium text-gray-900'>
					{label}
					{isRequired && <span className='text-red-500'>*</span>}
				</label>
			)}
			<input
				type={showPassword ? 'text' : 'password'}
				name={name}
				id={id}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				placeholder={placeholder}
				className={`h-[45px] bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 ${className}`}
				{...props}
			/>
			<div
				onClick={() => setShowPassword((prev) => !prev)}
				className='absolute right-4 top-[40px] text-xl text-gray-600 cursor-pointer'>
				{showPassword ? <FaEyeSlash /> : <FaEye />}
			</div>
		</div>
	);
};

PasswordInput.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	className: PropTypes.string,
	value: PropTypes.any,
	onChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func,
	placeholder: PropTypes.string,
	isRequired: PropTypes.bool,
};

export default PasswordInput;
