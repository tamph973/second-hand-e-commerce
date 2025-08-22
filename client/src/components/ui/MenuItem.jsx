import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function MenuItem({ path, icon, title, ...props }) {
	const renderIcon = () => {
		// Check if the icon is an imported image path or an emoji string
		if (typeof icon === 'string' && icon.includes('/')) {
			return <img src={icon} alt={title} className='w-5 h-5' />;
		}
		return <span className='text-lg'>{icon}</span>;
	};

	return (
		<Link
			to={path}
			className='flex items-center gap-2 px-4 py-2 hover:bg-gray-100'
			{...props}>
			{renderIcon()}
			<span className='flex-1 truncate'>{title}</span>
		</Link>
	);
}

MenuItem.propTypes = {
	path: PropTypes.string.isRequired,
	icon: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
};
