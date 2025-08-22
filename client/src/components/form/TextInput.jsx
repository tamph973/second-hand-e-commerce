import React from 'react';
import PropTypes from 'prop-types';

const TextInput = ({
	id,
	label,
	name,
	value,
	onChange,
	onBlur,
	placeholder,
	className = '',
	isValid,
	isInvalid,
	isRequired,
	...props
}) => (
	<div className='relative z-0 w-full'>
		{label && (
			<label
				htmlFor={id}
				className='block mb-2 text-sm font-medium text-textPrimary'>
				{label}
				{isRequired && <span className='text-red-500'>*</span>}
			</label>
		)}
		<input
			type='text'
			name={name}
			id={id}
			value={value}
			onChange={onChange}
			onBlur={onBlur}
			placeholder={placeholder}
			className={`h-[45px] bg-gray-50 border border-gray-300 text-textPrimary text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 ${className}`}
			{...props}
		/>
		{isValid && (
			<span className='absolute right-4 top-[40px] text-green-500'>
				<svg
					width='20'
					height='20'
					fill='none'
					stroke='currentColor'
					strokeWidth='2'
					viewBox='0 0 24 24'>
					<path
						d='M5 13l4 4L19 7'
						strokeLinecap='round'
						strokeLinejoin='round'
					/>
				</svg>
			</span>
		)}
		{isInvalid && (
			<span className='absolute right-4 top-[40px] text-red-500'>
				<svg
					width='20'
					height='20'
					fill='none'
					stroke='currentColor'
					strokeWidth='2'
					viewBox='0 0 24 24'>
					<path
						d='M6 18L18 6M6 6l12 12'
						strokeLinecap='round'
						strokeLinejoin='round'
					/>
				</svg>
			</span>
		)}
	</div>
);

TextInput.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	className: PropTypes.string,
	value: PropTypes.any,
	onChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func,
	placeholder: PropTypes.string,
	isValid: PropTypes.bool,
	isInvalid: PropTypes.bool,
	isRequired: PropTypes.bool,
};

export default TextInput;
