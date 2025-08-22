import Button from '@/components/common/Button';
import { FaAngleRight, FaShieldAlt, FaBell, FaUserCog } from 'react-icons/fa';
import { useModal } from '@/hooks/useModal';
import ChangePasswordModal from './components/ChangePasswordModal';
import toast from 'react-hot-toast';
import { useAppMutation } from '@/hooks/useAppMutation';
import AuthService from '@/services/auth.service';
import useAppQuery from '@/hooks/useAppQuery';
import { formatTimeSince } from '@/utils/helpers';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export default function UserSetting() {
	const navigate = useNavigate();
	const { isOpen, open, close } = useModal();
	const queryClient = useQueryClient();
	const { data: auth } = useAppQuery(
		['auth'],
		() => AuthService.getAuthUser(),
		{
			select: (res) => res.data,
			refetchOnWindowFocus: false,
		},
	);

	const time = formatTimeSince(auth?.passwordUpdatedAt);

	const { mutateAsync: changePassword } = useAppMutation({
		mutationFn: (data) => AuthService.changePassword(data),
		onSuccess: (res) => {
			toast.success(res.message || 'Đổi mật khẩu thành công');
			queryClient.invalidateQueries(['auth']);
			setTimeout(() => {
				navigate('/auth/login');
			}, 1000);
			window.location.reload();
			close();
		},
		onError: (error) => {
			toast.error(error || 'Đổi mật khẩu thất bại');
		},
	});

	return (
		<>
			<section className='bg-white rounded-2xl shadow-lg p-8'>
				<div className='flex flex-col items-start justify-between mb-8'>
					<h1 className='text-3xl font-bold text-lime-600 mb-2'>
						Thiết lập tài khoản
					</h1>
					<span className='text-gray-600 text-base'>
						Quản lý mật khẩu và cài đặt bảo mật
					</span>
				</div>

				<div className='space-y-6'>
					{/* Password Settings */}
					<div className='bg-gradient-to-r from-lime-50 to-green-50 rounded-xl p-6 border border-lime-100 hover:shadow-md transition-all duration-300 cursor-pointer'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center space-x-4'>
								<div className='bg-lime-100 p-3 rounded-full'>
									<FaShieldAlt className='text-lime-600 text-xl' />
								</div>
								<div className='flex flex-col'>
									<h4 className='text-lg font-semibold text-gray-800 mb-1'>
										Đổi mật khẩu
									</h4>
									<span className='text-sm text-gray-500'>
										Lần đổi gần nhất: {time}
									</span>
								</div>
							</div>
							<Button
								type='button'
								className='bg-white hover:bg-lime-50 border border-lime-200 text-lime-600 px-4 py-3 rounded-lg transition-all duration-200 hover:shadow-sm flex items-center space-x-2'
								onClick={open}>
								<span className='text-sm font-medium'>
									Thay đổi
								</span>
								<FaAngleRight className='text-sm' />
							</Button>
						</div>
					</div>

					{/* Notification Settings */}
					<div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 hover:shadow-md transition-all duration-300 cursor-pointer'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center space-x-4'>
								<div className='bg-blue-100 p-3 rounded-full'>
									<FaBell className='text-blue-600 text-xl' />
								</div>
								<div className='flex flex-col'>
									<h4 className='text-lg font-semibold text-gray-800 mb-1'>
										Thông báo
									</h4>
									<span className='text-sm text-gray-500'>
										Quản lý cài đặt thông báo
									</span>
								</div>
							</div>
							<Button
								type='button'
								className='bg-white hover:bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-lg transition-all duration-200 hover:shadow-sm flex items-center space-x-2'
								onClick={() => {}}>
								<span className='text-sm font-medium'>
									Cài đặt
								</span>
								<FaAngleRight className='text-sm' />
							</Button>
						</div>
					</div>

					{/* Privacy Settings */}
					<div className='bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 hover:shadow-md transition-all duration-300 cursor-pointer'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center space-x-4'>
								<div className='bg-purple-100 p-3 rounded-full'>
									<FaUserCog className='text-purple-600 text-xl' />
								</div>
								<div className='flex flex-col'>
									<h4 className='text-lg font-semibold text-gray-800 mb-1'>
										Quyền riêng tư
									</h4>
									<span className='text-sm text-gray-500'>
										Kiểm soát thông tin cá nhân
									</span>
								</div>
							</div>
							<Button
								type='button'
								className='bg-white hover:bg-purple-50 border border-purple-200 text-purple-600 px-4 py-3 rounded-lg transition-all duration-200 hover:shadow-sm flex items-center space-x-2'
								onClick={() => {}}>
								<span className='text-sm font-medium'>
									Quản lý
								</span>
								<FaAngleRight className='text-sm' />
							</Button>
						</div>
					</div>
				</div>
			</section>
			<ChangePasswordModal
				isOpen={isOpen}
				onClose={close}
				onSubmit={changePassword}
			/>
		</>
	);
}
