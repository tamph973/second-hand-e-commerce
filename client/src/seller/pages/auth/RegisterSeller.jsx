import React from 'react';
import FormSeller from '@/seller/components/FormSeller';
import logo from '@/assets/images/logo.png';
import SellerService from '@/services/seller.service';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const RegisterSeller = () => {
	const navigate = useNavigate();

	const handleSubmit = async (values) => {
		try {
			const res = await SellerService.registerSeller(values);
			if (res.status === 201) {
				setTimeout(() => {
					navigate('/seller/verify-cccd');
				}, 1000);
			}
		} catch (error) {
			toast.error(error);
		}
	};
	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Blue Header */}
			<div className='bg-blue-600 text-white py-4'>
				<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
					{/* Logo EcoC */}
					<Link to='/' className='flex justify-center mb-8'>
						<div className='text-4xl font-bold tracking-wide drop-shadow-lg'>
							<img
								src={logo}
								alt='Logo'
								className='h-12 w-auto'
							/>
						</div>
					</Link>

					{/* Main Title */}
					<h1 className='text-5xl font-bold mb-4 tracking-tight drop-shadow-md text-green-400'>
						Đăng ký người bán
					</h1>

					{/* Subtitle */}
					<p className='text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto'>
						Đăng ký tài khoản người bán để bắt đầu kinh doanh
					</p>
				</div>
			</div>

			{/* Main Content */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-start'>
					{/* Left Column - Benefits & Image */}
					<div className='space-y-10'>
						{/* Shop Register Image */}
						<div className='text-center lg:text-left'>
							<div className='relative'>
								<img
									src='/src/assets/images/shop-register.png'
									alt='Shop Registration'
									className='w-full max-w-lg mx-auto lg:mx-0 rounded-lg shadow-xl'
								/>
								{/* Decorative elements */}
								<div className='absolute -top-4 -right-4 w-8 h-8 bg-green-400 rounded-full opacity-20'></div>
								<div className='absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400 rounded-full opacity-20'></div>
							</div>
						</div>

						{/* Benefits Content */}
						<div className='space-y-8'>
							<h2 className='text-3xl font-bold text-gray-900 text-center lg:text-left'>
								Tại sao nên đăng ký làm người bán?
							</h2>

							<div className='space-y-6'>
								<div className='flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200'>
									<div className='flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
										<svg
											className='w-5 h-5 text-green-600'
											fill='currentColor'
											viewBox='0 0 20 20'>
											<path
												fillRule='evenodd'
												d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
												clipRule='evenodd'
											/>
										</svg>
									</div>
									<div>
										<h3 className='font-semibold text-gray-900 text-lg mb-1'>
											Bán hàng dễ dàng
										</h3>
										<p className='text-gray-600'>
											Giao diện thân thiện, quy trình đăng
											tin đơn giản chỉ trong vài phút
										</p>
									</div>
								</div>

								<div className='flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200'>
									<div className='flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
										<svg
											className='w-5 h-5 text-green-600'
											fill='currentColor'
											viewBox='0 0 20 20'>
											<path
												fillRule='evenodd'
												d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
												clipRule='evenodd'
											/>
										</svg>
									</div>
									<div>
										<h3 className='font-semibold text-gray-900 text-lg mb-1'>
											Tiếp cận khách hàng lớn
										</h3>
										<p className='text-gray-600'>
											Hàng triệu người dùng tiềm năng,
											tăng cơ hội bán hàng
										</p>
									</div>
								</div>

								<div className='flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200'>
									<div className='flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
										<svg
											className='w-5 h-5 text-green-600'
											fill='currentColor'
											viewBox='0 0 20 20'>
											<path
												fillRule='evenodd'
												d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
												clipRule='evenodd'
											/>
										</svg>
									</div>
									<div>
										<h3 className='font-semibold text-gray-900 text-lg mb-1'>
											Quản lý đơn hàng hiệu quả
										</h3>
										<p className='text-gray-600'>
											Dashboard thông minh giúp theo dõi
											đơn hàng và doanh thu
										</p>
									</div>
								</div>

								<div className='flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200'>
									<div className='flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
										<svg
											className='w-5 h-5 text-green-600'
											fill='currentColor'
											viewBox='0 0 20 20'>
											<path
												fillRule='evenodd'
												d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
												clipRule='evenodd'
											/>
										</svg>
									</div>
									<div>
										<h3 className='font-semibold text-gray-900 text-lg mb-1'>
											Hỗ trợ 24/7
										</h3>
										<p className='text-gray-600'>
											Đội ngũ hỗ trợ chuyên nghiệp sẵn
											sàng giúp đỡ mọi lúc
										</p>
									</div>
								</div>
							</div>

							{/* Stats */}
							<div className='grid grid-cols-3 gap-6 pt-8 border-t border-gray-200'>
								<div className='text-center p-4 rounded-lg bg-white shadow-sm border border-gray-100'>
									<div className='text-3xl font-bold text-green-600 mb-1'>
										10K+
									</div>
									<div className='text-sm text-gray-600 font-medium'>
										Người bán
									</div>
								</div>
								<div className='text-center p-4 rounded-lg bg-white shadow-sm border border-gray-100'>
									<div className='text-3xl font-bold text-green-600 mb-1'>
										1M+
									</div>
									<div className='text-sm text-gray-600 font-medium'>
										Sản phẩm
									</div>
								</div>
								<div className='text-center p-4 rounded-lg bg-white shadow-sm border border-gray-100'>
									<div className='text-3xl font-bold text-green-600 mb-1'>
										99%
									</div>
									<div className='text-sm text-gray-600 font-medium'>
										Hài lòng
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Right Column - Registration Form */}
					<div className='lg:pl-8'>
						<div className='bg-white rounded-2xl shadow-xl border border-gray-200 p-8 sticky top-8'>
							<FormSeller onSubmit={handleSubmit} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RegisterSeller;
