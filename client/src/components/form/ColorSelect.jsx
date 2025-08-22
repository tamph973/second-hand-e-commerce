/* eslint-disable react/prop-types */
import React from 'react';
import chroma from 'chroma-js';
import Select from 'react-select';
import { COLOR_OPTIONS } from '@/constants/productOptions';

const DEFAULT_COLOR = '#888888';

const colourStyles = {
	control: (styles, state) => ({
		...styles,
		backgroundColor: state.isDisabled ? '#f2f2f2' : 'white',
		borderRadius: 8,
		minHeight: 48,
		width: '100%',
		cursor: state.isDisabled ? 'not-allowed' : 'default',
		borderColor: state.isFocused ? '#3182ce' : '#e2e8f0',
		boxShadow: state.isFocused ? '0 0 0 2px #bee3f8' : 'none',
		'&:hover': { borderColor: '#3182ce' },
		zIndex: 1000,
	}),
	option: (styles, { data, isDisabled, isFocused, isSelected }) => {
		const color = chroma.valid(data.color)
			? chroma(data.color)
			: chroma(DEFAULT_COLOR);
		return {
			...styles,
			backgroundColor: isDisabled
				? undefined
				: isSelected
				? data.color || DEFAULT_COLOR
				: isFocused
				? color.alpha(0.1).css()
				: undefined,
			color: isDisabled
				? '#ccc'
				: isSelected
				? chroma.contrast(color, 'white') > 2
					? 'white'
					: 'black'
				: data.color || DEFAULT_COLOR,
			cursor: isDisabled ? 'not-allowed' : 'default',
			':active': {
				...styles[':active'],
				backgroundColor: !isDisabled
					? isSelected
						? data.color || DEFAULT_COLOR
						: color.alpha(0.3).css()
					: undefined,
			},
		};
	},
	multiValue: (styles, { data }) => {
		const color = chroma.valid(data.color)
			? chroma(data.color)
			: chroma(DEFAULT_COLOR);
		return {
			...styles,
			backgroundColor: color.alpha(0.1).css(),
		};
	},
	multiValueLabel: (styles, { data }) => ({
		...styles,
		color: data.color || DEFAULT_COLOR,
	}),
	multiValueRemove: (styles, { data }) => ({
		...styles,
		color: data.color || DEFAULT_COLOR,
		':hover': {
			backgroundColor: data.color || DEFAULT_COLOR,
			color: 'white',
		},
	}),
};

const ColorSelect = ({ isMulti = true, ...props }) => (
	<Select
		closeMenuOnSelect={!isMulti}
		isDisabled={props.isDisabled}
		isMulti={isMulti}
		options={COLOR_OPTIONS}
		styles={colourStyles}
		{...props}
	/>
);

export default ColorSelect;
