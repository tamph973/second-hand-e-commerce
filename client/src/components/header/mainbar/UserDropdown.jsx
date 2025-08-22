import React, { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import MenuGroup from '@/components/ui/MenuGroup';
import MenuItem from '@/components/ui/MenuItem';
import { userMenuItems } from '@/constants/menuItems';
import avatar from '@/assets/images/avatar-default.avif';
const UserDropdown = ({ user, onLogout }) => {
	const [showDropdown, setShowDropdown] = useState(false);
	const timeoutRef = useRef(null);
	const handleMouseEnter = () => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		setShowDropdown(true);
	};

	const handleMouseLeave = useCallback(() => {
		timeoutRef.current = setTimeout(() => {
			setShowDropdown(false);
		}, 200);
	}, []);

	return (
		<div
			className='relative'
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}>
			<button
				aria-haspopup='true'
				aria-expanded={showDropdown}
				className='flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-200 bg-slate-100'
				onClick={() => setShowDropdown((v) => !v)}>
				<div className='flex items-center gap-2 max-w-[180px]'>
					<img
						src={user?.avatar?.url || avatar}
						alt='avatar'
						className='w-8 h-8 rounded-full'
					/>
					<span className='overflow-hidden text-ellipsis whitespace-nowrap'>
						{user.fullName || 'Người dùng'}
					</span>
				</div>
				<svg width='16' height='16' fill='currentColor'>
					<path d='M4 6l4 4 4-4' />
				</svg>
			</button>
			{showDropdown && (
				<div className='absolute right-0 w-60 bg-white border rounded-lg shadow-lg z-50 text-gray-800 max-h-[300px] overflow-y-auto	'>
					{userMenuItems.map((item, index) => (
						<MenuGroup key={index} title={item.group}>
							{item.items
								.filter((menuItem) =>
									user.role.some((role) =>
										menuItem.roles.includes(role),
									),
								)
								.map((item) => (
									<MenuItem
										key={item.key}
										path={item.path}
										icon={item.icon}
										title={item.title}
									/>
								))}
						</MenuGroup>
					))}
					<div className='border-t mt-2'>
						<Link
							to='/help'
							className='block px-4 py-2 hover:bg-gray-100'>
							Trợ giúp
						</Link>
						<Link
							to='/feedback'
							className='block px-4 py-2 hover:bg-gray-100'>
							Đóng góp ý kiến
						</Link>
						<button
							onClick={onLogout}
							className='block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 disabled:opacity-50'>
							Đăng xuất
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

UserDropdown.propTypes = {
	user: PropTypes.object.isRequired,
	onLogout: PropTypes.func.isRequired,
};

export default UserDropdown;
