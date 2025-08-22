import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState } from 'react';
import logo from '@/assets/images/logo.png';
import MenuItem from '@/components/ui/MenuItem';
import MenuGroup from '@/components/ui/MenuGroup';
import { adminMenuItems } from '@/constants/menuItems';

export default function Sidebar({ isSidebarOpen, toggleSidebar }) {
	const location = useLocation();
	const [expandedMenus, setExpandedMenus] = useState({
		orders: false,
		refunds: false,
		categories: false,
		brands: false,
		products: false,
		vendorProducts: false,
		offers: false,
		notifications: false,
		customers: false,
		vendors: false,
		delivery: false,
		employees: false,
		reports: false,
		blogs: false,
		pages: false,
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

	const renderSubMenuItem = (subItem, index) => (
		<Link
			key={index}
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

	const renderSubMenu = (item) => {
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

	const renderMenuItem = (item) => {
		if (item.type === 'single') {
			return (
				<div className='flex items-center gap-2'>
					<MenuItem
						key={item.key}
						to={item.path}
						icon={item.icon}
						title={item.title}
						className={`${
							isActive(item.path)
								? 'bg-blue-600 text-white hover:bg-blue-700'
								: 'text-gray-700 hover:bg-gray-100'
						} flex-1 px-4 py-3 rounded-lg transition-colors`}
					/>
				</div>
			);
		}

		if (item.type === 'submenu') {
			return renderSubMenu(item);
		}

		return null;
	};

	return (
		<>
			<aside
				className={`fixed inset-y-0 left-0 z-30 w-80 bg-white border-r border-gray-200 transform ${
					isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
				} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 overflow-y-auto`}>
				{/* Header */}
				<div className='flex items-center justify-between p-4 border-b border-gray-200'>
					<Link
						to='/admin/dashboard'
						className='flex items-center gap-2'>
						<img src={logo} alt='Logo' className='h-8 w-auto' />
						<span className='text-lg font-semibold text-gray-800'>
							Admin Panel
						</span>
					</Link>
					<button
						onClick={toggleSidebar}
						className='p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 md:hidden'>
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

				{/* Search */}
				<div className='p-4 border-b border-gray-200'>
					<div className='relative'>
						<input
							type='text'
							placeholder='Tìm kiếm menu...'
							className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
						/>
						<svg
							className='absolute left-3 top-2.5 w-4 h-4 text-gray-400'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
							/>
						</svg>
					</div>
				</div>

				{/* Navigation */}
				<nav className='p-4 space-y-4'>
					{adminMenuItems.map((group) => (
						<MenuGroup
							key={group.key}
							title={group.title}
							className='group'>
							<div className='space-y-1' key={group.key}>
								{group.items.map((item) =>
									renderMenuItem(item),
								)}
							</div>
						</MenuGroup>
					))}
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
						<span>Back to Website</span>
					</Link>
				</div>
			</aside>

			{/* Overlay */}
			{isSidebarOpen && (
				<div
					className='fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden'
					onClick={toggleSidebar}
				/>
			)}
		</>
	);
}

Sidebar.propTypes = {
	isSidebarOpen: PropTypes.bool.isRequired,
	toggleSidebar: PropTypes.func.isRequired,
};
