import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const MotionWrapper = ({ children, className }) => {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			transition={{
				duration: 0.15,
				ease: 'easeInOut',
			}}
			className={className}>
			{children}
		</motion.div>
	);
};

MotionWrapper.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};



export default MotionWrapper;
