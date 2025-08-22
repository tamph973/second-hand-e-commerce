// components/admin/Topbar.jsx
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import UserDropdown from './UserDropdown';

const Topbar = ({ toggleSidebar }) => {
	return (
		<header className='flex items-center justify-between h-16 px-4 bg-white shadow-md z-10'>
			<div className='flex items-center gap-4'>
				<button
					onClick={toggleSidebar}
					className='text-gray-500 md:hidden'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='w-6 h-6'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M4 6h16M4 12h16m-7 6h7'
						/>
					</svg>
				</button>
			</div>

			<div className='flex items-center gap-4'>
				<Link to='/' className='text-gray-500 hover:text-blue-600'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='w-6 h-6'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-7-4h4m-4 4h4'
						/>
					</svg>
				</Link>
				<UserDropdown />
			</div>
		</header>
	);
};

Topbar.propTypes = {
	toggleSidebar: PropTypes.func.isRequired,
};

export default Topbar;
