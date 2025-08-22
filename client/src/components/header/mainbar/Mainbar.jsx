import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import QuickActions from './QuickActions';

import logo from '@/assets/images/logo.png';
import UserDropdown from './UserDropdown';
import AuthService from '@/services/auth.service';
import useAppQuery from '@/hooks/useAppQuery';
import { getAccessToken, getAuthLocalStorage } from '@/utils/localStorageUtils';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import Button from '@/components/common/Button';
import { checkLoginAndNavigate } from '@/utils/auth';
import { isSeller } from '@/utils/jwt';

export default function Mainbar() {
	const navigate = useNavigate();
	const location = useLocation();
	const { userId } = getAuthLocalStorage();
	const access_token = getAccessToken();

	// Chỉ lấy lại nếu thay đổi trạng thái đăng nhập, lấy thông tin khi mà có token (đã đăng nhập)
	const { data: user, isLoading: isLoadingUser } = useAppQuery(
		['user'],
		() => AuthService.getAuthUser(),
		{
			select: (res) => res.data,
			refetchOnWindowFocus: false,
			enabled: !!userId,
		},
	);
	const isAuthenticated = !!user;

	const handleLogout = async () => {
		Swal.fire({
			title: 'Bạn chắc chắn muốn đăng xuất?',
			text: 'Bạn sẽ bị đăng xuất khỏi hệ thống',
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

	const handleCreateProduct = () => {
		// Kiểm tra xem đã đăng nhập chưa
		if (
			!checkLoginAndNavigate(
				navigate,
				userId,
				'/auth/login',
				'Bạn cần đăng nhập để đăng bán sản phẩm',
			)
		) {
			return;
		}

		// Kiểm tra xem đã đăng ký làm seller chưa
		if (!isSeller(access_token)) {
			toast.error('Cần đăng ký hồ sơ người bán để đăng bán sản phẩm');
			return;
		}

		setTimeout(() => {
			navigate('/seller/products/create');
		}, 500);
	};

	// Xử lý chuyển về trang chủ
	const handleGoHome = (e) => {
		e.preventDefault();

		// Nếu đang ở trang chủ, không làm gì
		if (location.pathname === '/') {
			return;
		}

		// Chuyển về trang chủ và reset URL
		navigate('/', { replace: true });
		window.location.reload();
	};

	return (
		<div className='container mx-auto flex h-16 items-center justify-between bg-white px-4'>
			<Link to='/' onClick={handleGoHome}>
				<img src={logo} alt='logo' className='h-10 w-auto' />
			</Link>
			<div className='flex-1 mx-4'>
				<SearchBar />
			</div>
			{/* Quick action  */}
			<QuickActions />
			<div className='flex items-center gap-2'>
				{isAuthenticated ? (
					<UserDropdown user={user} onLogout={handleLogout} />
				) : (
					<>
						<Link
							to='/auth/register'
							className='px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium'>
							Đăng ký
						</Link>
						<Link
							to='/auth/login'
							className='px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium'>
							Đăng nhập
						</Link>
					</>
				)}
				<Button
					onClick={handleCreateProduct}
					className='flex items-center gap-2 bg-primaryBg hover:opacity-90 text-white font-bold px-4 py-2 rounded-lg uppercase'>
					Đăng bán
				</Button>
			</div>
		</div>
	);
}
