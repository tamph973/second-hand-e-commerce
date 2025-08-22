import React from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';

const customStyles = {
	menu: (provided) => ({
		...provided,
		maxHeight: 240,
	}),
	menuPortal: (base) => ({
		...base,
		zIndex: 9999,
	}),
	control: (provided, state) => ({
		...provided,
		minHeight: 45,
		borderColor: state.isFocused ? '#3b82f6' : '#d1d5db', // Tailwind blue-500, gray-300
		boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : provided.boxShadow,
		'&:hover': { borderColor: '#3b82f6' },
		fontSize: 16,
		borderRadius: 8,
		backgroundColor: '#f9fafb',
	}),
	option: (provided, state) => ({
		...provided,
		backgroundColor: state.isSelected
			? '#3b82f6'
			: state.isFocused
			? '#e0e7ff'
			: 'white',
		color: state.isSelected ? 'white' : '#111827', // Tailwind text-gray-900
		fontSize: 16,
	}),
};

const SelectInput = ({
	id,
	label,
	name,
	value,
	onChange,
	onBlur,
	placeholder,
	className = '',
	options = [],
	isRequired,
	isMulti = false,
	disabled = false,
	...props
}) => (
	<div className={`relative z-0 w-full ${className}`}>
		{label && (
			<label
				htmlFor={id}
				className='block mb-2 text-sm font-medium text-gray-900'>
				{label}
				{isRequired && <span className='text-red-500'>*</span>}
			</label>
		)}
		<ReactSelect
			inputId={id}
			name={name}
			noOptionsMessage={() => 'Không có dữ liệu'}
			value={
				// Fix: Ensure value is an array for isMulti, and find the matching option
				isMulti
					? options.filter((opt) =>
							Array.isArray(value)
								? value.includes(opt.value)
								: false,
					  ) // Convert value to array and filter options
					: options.find((opt) => opt.value === value) || null // Single select logic
			}
			onChange={(selected) => {
				if (isMulti) {
					onChange({
						target: {
							name,
							value: selected
								? selected.map((opt) => opt.value)
								: [],
						},
					});
				} else {
					onChange({
						target: {
							name,
							value: selected ? selected.value : '',
						},
					});
				}
			}}
			onBlur={onBlur}
			options={options}
			placeholder={placeholder}
			isClearable
			isMulti={isMulti}
			styles={customStyles}
			menuPortalTarget={document.body}
			isDisabled={disabled}
			{...props}
		/>
	</div>
);

SelectInput.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	className: PropTypes.string,
	value: PropTypes.any,
	onChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func,
	placeholder: PropTypes.string,
	options: PropTypes.array,
	isRequired: PropTypes.bool,
	isMulti: PropTypes.bool,
	disabled: PropTypes.bool,
};

export default SelectInput;
