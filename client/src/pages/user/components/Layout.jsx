import { useSelector } from 'react-redux';
import {
	Sidebar,
	SidebarItem,
	SidebarItemGroup,
	SidebarItems,
} from 'flowbite-react';
import { Avatar } from 'flowbite-react';
import Swal from 'sweetalert2';
import {
	MdAccountCircle,
	MdChat,
	MdListAlt,
	MdLocationPin,
	MdLogout,
} from 'react-icons/md';
import { CiBank } from 'react-icons/ci';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaCircleCheck } from 'react-icons/fa6';
import LoadingThreeDot from '@/components/common/LoadingThreeDot';
import AuthService from '@/services/auth.service';
import useAppQuery from '@/hooks/useAppQuery';
import toast from 'react-hot-toast';
import { BiSolidDiscount } from 'react-icons/bi';

export default function Layout() {
	const navigate = useNavigate();
	const { data: user, isLoading: isLoadingUser } = useAppQuery(
		['user'],
		() => AuthService.getAuthUser(),
		{
			select: (res) => res.data,
			refetchOnWindowFocus: false,
		},
	);
	const { loading, error } = useSelector((state) => state.auth);

	// Show loading state while fetching user data
	if (loading) {
		return <LoadingThreeDot />;
	}

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
		<div className='bg-gray-200'>
			<div className='max-w-[1410px] relative px-5 py-5 mx-auto'>
				<div className='grid grid-cols-12'>
					<div className='col-span-3 mr-6 '>
						<Sidebar
							aria-label='Sidebar with logo branding example'
							className='sticky w-full overflow-y-auto h-full rounded-2xl shadow-md mb-6 '>
							<div className='flex gap-3 items-center p-4'>
								<Avatar
									img={user?.avatar?.url}
									rounded
									size='md'
									bordered
								/>
								<div>
									<p className='mb-0 text-body-3 font-medium uppercase  text-slate-200 flex items-center justify-center gap-1'>
										<span>{user?.fullName}</span>
										{user?.isEmailVerified && (
											<FaCircleCheck
												className='text-green-500'
												title='Email đã xác thực'
											/>
										)}
									</p>
								</div>
							</div>
							<SidebarItems>
								<SidebarItemGroup>
									<SidebarItem>
										<NavLink
											end
											to='/user/profile'
											className={({ isActive }) =>
												'flex gap-2 items-center transition-all cursor-pointer hover:text-blue-500' +
												(isActive
													? ' !font-bold text-blue-500 relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[1px] ps-2 before:rounded-full before:h-full before:bg-blue-500'
													: '')
											}>
											<MdAccountCircle size={24} /> Tài
											khoản của tôi
										</NavLink>
									</SidebarItem>
									{/* Quản lý ví của tôi */}
									<SidebarItem>
										<NavLink
											end
											to='/user/wallet'
											className={({ isActive }) =>
												'flex gap-2 items-center transition-all cursor-pointer hover:text-blue-500' +
												(isActive
													? ' !font-bold text-blue-500 relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[1px] ps-2 before:rounded-full before:h-full before:bg-blue-500'
													: '')
											}>
											<CiBank size={24} /> Tiền của tôi
										</NavLink>
									</SidebarItem>
									<SidebarItem>
										<NavLink
											end
											to='/user/settings'
											className={({ isActive }) =>
												'flex gap-2 items-center transition-all cursor-pointer hover:text-blue-500' +
												(isActive
													? ' !font-bold text-blue-500 relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[1px] ps-2 before:rounded-full before:h-full before:bg-blue-500'
													: '')
											}>
											<MdAccountCircle size={24} /> Mật
											khẩu và bảo mật
										</NavLink>
									</SidebarItem>
									<SidebarItem>
										<NavLink
											to='/user/purchases'
											end
											className={({ isActive }) =>
												'flex gap-2 items-center transition-all cursor-pointer hover:text-blue-500' +
												(isActive
													? ' !font-bold text-blue-500 relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[1px] ps-2 before:rounded-full before:h-full before:bg-blue-500'
													: '')
											}>
											<MdListAlt size={24} /> Đơn hàng của
											tôi
										</NavLink>
									</SidebarItem>

									<SidebarItem>
										<NavLink
											to='/user/discounts'
											end
											className={({ isActive }) =>
												'flex gap-2 items-center transition-all cursor-pointer hover:text-blue-500' +
												(isActive
													? ' !font-bold text-blue-500 relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[1px] ps-2 before:rounded-full before:h-full before:bg-blue-500'
													: '')
											}>
											<BiSolidDiscount size={24} /> Mã giảm giá
										</NavLink>	
									</SidebarItem>
									<SidebarItem>
										<NavLink
											to='/user/messages'
											end
											className={({ isActive }) =>
												'flex gap-2 items-center transition-all cursor-pointer hover:text-blue-500' +
												(isActive
													? ' !font-bold text-blue-500 relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[1px] ps-2 before:rounded-full before:h-full before:bg-blue-500'
													: '')
											}>
											<MdChat size={24} /> Tin nhắn
										</NavLink>
									</SidebarItem>

									<SidebarItem>
										<NavLink
											to='/user/address'
											end
											className={({ isActive }) =>
												'flex gap-2 items-center transition-all cursor-pointer hover:text-blue-500' +
												(isActive
													? ' !font-bold text-blue-500 relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[1px] ps-2 before:rounded-full before:h-full before:bg-blue-500'
													: '')
											}>
											<MdLocationPin size={24} /> Địa chỉ
											của tôi
										</NavLink>
									</SidebarItem>

									<SidebarItem>
										<button
											onClick={handleLogout}
											className='flex w-full gap-2 items-center text-left text-red-500 transition-all hover:text-red-600 cursor-pointer px-2 py-1'>
											<MdLogout size={24} /> Đăng xuất
										</button>
									</SidebarItem>
								</SidebarItemGroup>
							</SidebarItems>
						</Sidebar>
					</div>

					<div className='col-span-9'>
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	);
}
