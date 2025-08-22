import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ children, type = 'button', className = '', ...props }) => {
	return (
		<button
			type={type || 'button'}
			className={`focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-[99px] px-5 py-2.5 text-center transition-all ${className}`}
			{...props}>
			{children}
		</button>
	);
};

Button.propTypes = {
	children: PropTypes.node.isRequired,
	type: PropTypes.string,
	className: PropTypes.string,
};

export default Button;
