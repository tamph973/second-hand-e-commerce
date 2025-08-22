import React from 'react';
import PropTypes from 'prop-types';
import TextInput from './TextInput';
import PasswordInput from './PasswordInput';
import ReactSelect from './ReactSelect';
import ColorSelect from './ColorSelect';

const CustomInput = (props) => {
	const { type = 'text', ...rest } = props;
	if (type === 'select') {
		return <ReactSelect {...rest} />;
	}
	if (type === 'password') {
		return <PasswordInput {...rest} />;
	}
	if (type === 'color-select') {
		return <ColorSelect {...rest} />;
	}
	// default: text, number, email, etc.
	return <TextInput type={type} {...rest} />;
};

CustomInput.propTypes = {
	type: PropTypes.string,
};

export default CustomInput;
