import PropTypes from 'prop-types';

export default function MenuGroup({ title, children }) {
	return (
		<>
			<div className='border-b px-4 py-2 bg-gray-50'>
				<span className='font-semibold text-gray-700'>{title}</span>
			</div>
			{children}
		</>
	);
}

MenuGroup.propTypes = {
	title: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
};
