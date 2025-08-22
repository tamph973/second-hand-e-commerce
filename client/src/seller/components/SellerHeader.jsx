import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import logo from '@/assets/images/logo.png';
import { notifications } from '@/seller/constants/menuItems';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import AuthService from '@/services/auth.service';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function SellerHeader({ toggleSidebar }) {
	const [isNotificationOpen, setIsNotificationOpen] = useState(false);
	const [isLanguageOpen, setIsLanguageOpen] = useState(false);
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
	const { user } = useSelector((state) => state.user);
	const navigate = useNavigate();
	const handleLogout = async () => {
		Swal.fire({
			title: 'Bạn chắc chắn muốn đăng xuất?',
			icon: 'warning',
			showCancelButton: true,
			cancelButtonText: 'Hủy',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Đăng xuất',
			confirmButtonColor: '#22c55e',
		}).then(async (result) => {
			if (result.isConfirmed) {
				const res = await AuthService.logout();
				try {
					if (res.status === 200) {
						setTimeout(() => {
							navigate('/auth/login');
							window.location.reload();
						}, 500);
					}
				} catch (error) {
					toast.error(error);
				}
			}
		});
	};

	return (
		<header className='bg-white border-b border-gray-200 px-6 py-4'>
			<div className='flex items-center justify-between'>
				{/* Left side - Logo and menu toggle */}
				<div className='flex items-center gap-4'>
					<button
						onClick={toggleSidebar}
						className='p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 lg:hidden'>
						<svg
							className='w-6 h-6'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M4 6h16M4 12h16M4 18h16'
							/>
						</svg>
					</button>
					<Link
						to='/seller/dashboard'
						className='flex items-center gap-3'>
						<img src={logo} alt='Logo' className='h-8 w-auto' />
						<span className='text-xl font-bold text-blue-600'>
							Dành cho người bán
						</span>
					</Link>
				</div>

				{/* Right side - Actions */}
				<div className='flex items-center gap-4'>
					{/* Notifications */}
					<div className='relative'>
						<button
							onClick={() =>
								setIsNotificationOpen(!isNotificationOpen)
							}
							className='p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 relative'>
							<svg
								className='w-6 h-6'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 6 6v4.5l2.25 2.25a.75.75 0 0 1-.75 1.25H3a.75.75 0 0 1-.75-.75V14.25a.75.75 0 0 1 1.25-.75L6 14.25V9.75a6 6 0 0 1 6-6z'
								/>
							</svg>
							<span className='absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full'></span>
						</button>

						{/* Notification dropdown */}
						{isNotificationOpen && (
							<div className='absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50'>
								<div className='p-4 border-b border-gray-200'>
									<h3 className='text-lg font-semibold text-gray-800'>
										Thông báo
									</h3>
								</div>
								<div className='max-h-96 overflow-y-auto'>
									{notifications.map((notification) => (
										<div
											key={notification.id}
											className='p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer'>
											<div className='flex items-start justify-between'>
												<div className='flex-1'>
													<p className='text-sm font-medium text-gray-800 mb-1'>
														{notification.title}
													</p>
													<p className='text-xs text-gray-500'>
														{notification.time}
													</p>
												</div>
												{notification.isNew && (
													<span className='ml-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full'>
														Mới
													</span>
												)}
											</div>
										</div>
									))}
								</div>
								<div className='p-4 border-t border-gray-200'>
									<Link
										to='/seller/notifications'
										className='text-sm text-blue-600 hover:text-blue-800 font-medium'>
										Xem tất cả thông báo
									</Link>
								</div>
							</div>
						)}
					</div>

					{/* Help */}
					<button className='p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100'>
						<svg
							className='w-6 h-6'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
							/>
						</svg>
					</button>

					{/* Language selector */}
					<div className='relative'>
						<button
							onClick={() => setIsLanguageOpen(!isLanguageOpen)}
							className='flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100'>
							<span className='text-sm font-medium'>
								Tiếng Việt
							</span>
							<svg
								className='w-4 h-4'
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

						{isLanguageOpen && (
							<div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50'>
								<div className='py-2'>
									<button className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100'>
										Tiếng Việt
									</button>
									<button className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100'>
										English
									</button>
								</div>
							</div>
						)}
					</div>

					{/* User menu */}
					<div className='relative'>
						<button
							onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
							className='flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100'>
							<div className='w-8 h-8 rounded-full flex items-center justify-center border'>
								<img
									src={user?.avatar?.url}
									alt='avatar'
									className='w-full h-full rounded-full'
								/>
							</div>
							<span className='text-sm font-medium'>
								{user?.fullName}
							</span>
							<svg
								className='w-4 h-4'
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

						{isUserMenuOpen && (
							<div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50'>
								<div className='py-2'>
									<Link
										to='/user/profile'
										className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
										Thông tin tài khoản
									</Link>
									<Link
										to='/seller/settings'
										className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
										Cài đặt
									</Link>
									<hr className='my-2' />
									<button
										onClick={handleLogout}
										className='w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100'>
										Đăng xuất
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}

SellerHeader.propTypes = {
	toggleSidebar: PropTypes.func.isRequired,
};
