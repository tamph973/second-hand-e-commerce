import { useNavigate } from 'react-router-dom';
import { LoginSocialFacebook } from 'reactjs-social-login';
import AuthService from '@/services/auth.service';
import Button from '@/components/common/Button';
import icon_facebook from '@/assets/icons/icon-facebook.svg';
import toast from 'react-hot-toast';

export default function FacebookLoginButton() {
	const navigate = useNavigate();

	const handleFacebookLogin = async (response) => {
		try {
			const result = await AuthService.getUserInfoFacebook(
				response.data.accessToken,
			);
			const user = {
				fullName: result.name,
				email: result.email,
				avatar: result.picture?.data?.url || '',
				type_login: 'facebook',
			};

			const facebookAuth = await AuthService.authSocial(user);
			if (facebookAuth.status === 200) {
				toast.success('Đăng nhập thành công với Facebook');
				setTimeout(() => {
					navigate('/');
					window.location.reload();
				}, 1000);
			}
		} catch (error) {
			console.error('Facebook login error:', error);
			toast.error('Đăng nhập Facebook thất bại');
		}
	};

	return (
		<LoginSocialFacebook
			isOnlyGetToken
			appId={import.meta.env.VITE_REACT_APP_FACEBOOK_CLIENT_ID}
			onResolve={(response) => handleFacebookLogin(response)}>
			<Button className='w-full flex items-center justify-center px-6 py-4 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 group shadow-sm hover:shadow-md hover:text-black'>
				<div className='flex items-center justify-center space-x-3'>
					<img
						src={icon_facebook}
						alt='Facebook icon'
						className='w-6 h-6 transition-transform duration-200 group-hover:scale-110'
					/>
					<span className='text-gray-700 font-semibold text-lg group-hover:text-gray-900 transition-colors duration-200'>
						Đăng nhập với Facebook
					</span>
				</div>
			</Button>
		</LoginSocialFacebook>
	);
}
