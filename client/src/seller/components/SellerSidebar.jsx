import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { sellerMenuItems } from '@/seller/constants/menuItems';

export default function SellerSidebar({ isSidebarOpen, toggleSidebar }) {
	const location = useLocation();
	const [expandedMenus, setExpandedMenus] = useState({
		overview: true,
		shop: false,
		products: false,
		purchase: false,
		inventory: false,
		orders: false,
		accounting: false,
		account: false,
	});

	const toggleMenu = (menuKey) => {
		setExpandedMenus((prev) => ({
			...prev,
			[menuKey]: !prev[menuKey],
		}));
	};

	const isActive = (path) => location.pathname === path;
	const isMenuActive = (paths) =>
		paths.some((path) => location.pathname.startsWith(path));

	const getBadgeColor = (color) => {
		const colors = {
			info: 'bg-blue-100 text-blue-800',
			success: 'bg-green-100 text-green-800',
			warning: 'bg-yellow-100 text-yellow-800',
			danger: 'bg-red-100 text-red-800',
		};
		return colors[color] || colors.info;
	};

	const renderSubMenuItem = (subItem) => (
		<Link
			key={subItem.key}
			to={subItem.path}
			className={`flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
				isActive(subItem.path)
					? 'bg-blue-100 text-blue-700'
					: 'text-gray-600 hover:bg-gray-50'
			}`}
			title={subItem.title}>
			<span className='flex-1 truncate'>{subItem.title}</span>
			{subItem.badge && (
				<span
					className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor(
						subItem.badgeColor,
					)}`}>
					{subItem.badge}
				</span>
			)}
		</Link>
	);

	const renderMenuItem = (item) => {
		const isExpanded = expandedMenus[item.key];
		const isMenuOpen = isMenuActive(item.subItems.map((sub) => sub.path));

		return (
			<div key={item.key} className='space-y-1'>
				<button
					onClick={() => toggleMenu(item.key)}
					className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
						isMenuOpen
							? 'bg-blue-600 text-white'
							: 'text-gray-700 hover:bg-gray-100'
					}`}
					title={item.title}>
					<div className='flex items-center gap-3'>
						<span className='text-lg'>{item.icon}</span>
						<span className='flex-1 truncate'>{item.title}</span>
					</div>
					<svg
						className={`w-4 h-4 transition-transform ${
							isExpanded ? 'rotate-180' : ''
						}`}
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M19 9l-7 7-7-7'
						/>
					</svg>
				</button>
				{isExpanded && (
					<div className='ml-8 space-y-1'>
						{item.subItems.map(renderSubMenuItem)}
					</div>
				)}
			</div>
		);
	};

	return (
		<>
			<aside
				className={`fixed inset-y-0 left-0 z-30 w-80 bg-white border-r border-gray-200 transform ${
					isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
				} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 overflow-y-auto`}>
				{/* Header */}
				<div className='flex items-center justify-between p-6 border-b border-gray-200'>
					<Link
						to='/seller/dashboard'
						className='flex items-center gap-2'>
						<span className='text-2xl font-bold text-blue-600'>
							Quản lý bán hàng
						</span>
					</Link>
					<button
						onClick={toggleSidebar}
						className='p-1 rounded-md text-red-700 hover:text-gray-700 hover:bg-gray-100 lg:hidden'>
						<svg
							className='w-5 h-5'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M6 18L18 6M6 6l12 12'
							/>
						</svg>
					</button>
				</div>

				{/* Navigation */}
				<nav className='p-4 space-y-4'>
					{sellerMenuItems.map(renderMenuItem)}
				</nav>

				{/* Footer */}
				<div className='p-4 border-t border-gray-200 mt-auto'>
					<Link
						to='/'
						className='flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'>
						<svg
							className='w-5 h-5'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-7-4h4m-4 4h4'
							/>
						</svg>
						<span>Quay lại trang chủ</span>
					</Link>
				</div>
			</aside>

			{/* Overlay for mobile */}
			{isSidebarOpen && (
				<div
					className='fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden'
					onClick={toggleSidebar}
				/>
			)}
		</>
	);
}

SellerSidebar.propTypes = {
	isSidebarOpen: PropTypes.bool.isRequired,
	toggleSidebar: PropTypes.func.isRequired,
};
