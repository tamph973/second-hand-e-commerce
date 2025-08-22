import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import AuthService from '@/services/auth.service';
import Button from '@/components/common/Button';
import icon_google from '@/assets/icons/icon-google.svg';
import toast from 'react-hot-toast';

export default function GoogleLoginButton() {
	const navigate = useNavigate();

	const handleGoogleLogin = useGoogleLogin({
		onSuccess: async (tokenResponse) => {
			try {
				const res = await AuthService.getUserInfoGoogle(
					tokenResponse.access_token,
				);
				const data = {
					fullName: res.name,
					email: res.email,
					avatar: res.picture,
					type_login: 'google',
				};

				const googleAuth = await AuthService.authSocial(data);
				if (googleAuth.status === 200) {
					toast.success('Đăng nhập thành công với Google');
					setTimeout(() => {
						navigate('/');
						window.location.reload();
					}, 1000);
				}
			} catch (error) {
				toast.error('Đăng nhập Google thất bại');
			}
		},
		onError: (error) => {
			console.error('Google login failed:', error);
			toast.error('Đăng nhập Google thất bại');
		},
	});

	return (
		<Button
			onClick={() => handleGoogleLogin()}
			className='w-full flex items-center justify-center px-6 py-4 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 group shadow-sm hover:shadow-md'>
			<div className='flex items-center justify-center space-x-3'>
				<img
					src={icon_google}
					alt='Google icon'
					className='w-6 h-6 transition-transform duration-200 group-hover:scale-110'
				/>
				<span className='text-gray-700 font-semibold text-lg group-hover:text-gray-900 transition-colors duration-200'>
					Đăng nhập với Google
				</span>
			</div>
		</Button>
	);
}
