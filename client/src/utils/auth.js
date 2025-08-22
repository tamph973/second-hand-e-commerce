import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { getAccessToken } from './localStorageUtils';
import { isAdmin } from './jwt';

const token = getAccessToken();
export const handleLogout = async (navigate, AuthService) => {
	const result = await Swal.fire({
		title: 'Bạn chắc chắn muốn đăng xuất?',
		text: 'Bạn sẽ bị đăng xuất khỏi hệ thống',
		showConfirmButton: true,
		showCancelButton: true,
		confirmButtonText: 'Đăng xuất',
		cancelButtonText: 'Hủy',
		confirmButtonColor: '#22c55e',
		cancelButtonColor: '#d33',
		icon: 'warning',
	});

	if (result.isConfirmed) {
		try {
			const res = await AuthService.logout();
			if (res.status === 200) {
				setTimeout(() => {
					if (isAdmin(token)) {
						navigate('/auth/admin/login');
					} else {
						navigate('/auth/login');
					}
					window.location.reload();
				}, 500);
			}
		} catch (error) {
			toast.error(error || 'Đăng xuất thất bại');
		}
	}
};

export const checkLoginAndNavigate = (
	navigate,
	userId,
	redirectPath = '/auth/login',
	message = 'Bạn cần đăng nhập để thực hiện thao tác này',
) => {
	if (!userId) {
		Swal.fire({
			title: 'Bạn cần đăng nhập',
			text: message,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			cancelButtonText: 'Không',
			confirmButtonText: 'Đăng nhập',
		}).then((result) => {
			if (result.isConfirmed) {
				navigate(redirectPath);
			}
		});
		return false;
	}
	return true;
};
