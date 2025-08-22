import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '@/assets/images/avatar-default.avif';
import AuthService from '@/services/auth.service';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const AdminDropdown = () => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);
	const navigate = useNavigate();

	const handleLogout = async () => {
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
						navigate('/auth/admin/login');
					}, 500);
				}
			} catch (error) {
				toast.error(error || 'Đăng xuất thất bại');
			}
		}
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div className='relative' ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className='flex items-center gap-2'>
				<img
					src={avatar}
					alt='User Avatar'
					className='w-8 h-8 rounded-full'
				/>
			</button>

			{isOpen && (
				<div className='absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl z-20'>
					<div className='px-4 py-2 border-b'>
						<p className='font-bold'>Admin</p>
						<p className='text-sm text-gray-500'>Master Admin</p>
					</div>
					<Link
						to='/admin/settings'
						className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
						onClick={() => setIsOpen(false)}>
						Settings
					</Link>
					<button
						onClick={handleLogout}
						className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
						Logout
					</button>
				</div>
			)}
		</div>
	);
};

AdminDropdown.propTypes = {};

export default AdminDropdown;
