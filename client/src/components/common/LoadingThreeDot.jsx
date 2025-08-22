// src/components/common/LoadingSpinner.jsx
import React from 'react';
import { ThreeDot } from 'react-loading-indicators';
import PropTypes from 'prop-types';

const LoadingThreeDot = ({
	color = '#32cd23',
	size = 'small',
	className = '',
}) => {
	return (
		<div
			className={`flex items-center justify-center h-[24px] ${className}`}>
			<ThreeDot color={color} size={size} />
		</div>
	);
};

LoadingThreeDot.propTypes = {
	color: PropTypes.string,
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	className: PropTypes.string,
};

export default LoadingThreeDot;
