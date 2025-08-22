import React from 'react';
import CCCDVerificationForm from '@/seller/components/CCCDVerificationForm';
import ProgressIndicator from '@/components/common/ProgressIndicator';
import { sellerRegistrationSteps } from '@/constants/progressSteps';
import { useNavigate } from 'react-router-dom';
import SellerService from '@/services/seller.service';
import toast from 'react-hot-toast';

const CCCDVerificationPage = () => {
	const navigate = useNavigate();
	const handleSubmit = async (values) => {
		try {
			const res = await SellerService.verifyCCCD(values);
			if (res.status === 200) {
				toast.success(res.data.message);
				setTimeout(() => {
					navigate('/');
				}, 1000);
			}
		} catch (error) {
			toast.error(error);
		}
	};
	const handleStepClick = (step) => {
		if (step === 0) {
			navigate('/seller/register');
		} else if (step === 1) {
			navigate('/seller/verify-cccd');
		}
	};
	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Header Section */}
			<div className='bg-white border-b border-gray-200'>
				<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
					<div className='text-center'>
						{/* Progress Indicator */}
						<ProgressIndicator
							steps={sellerRegistrationSteps}
							currentStep={1}
							variant='register'
							className='mb-6'
							onStepClick={handleStepClick}
						/>

						{/* Page Title */}
						<h1 className='text-3xl font-bold text-green-400 mb-3'>
							Xác minh CCCD
						</h1>
						<p className='text-lg text-gray-600 max-w-2xl mx-auto'>
							Xác minh thông tin căn cước công dân để hoàn tất
							đăng ký
						</p>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<div className='bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden'>
					{/* Form Header */}
					<div className='bg-gradient-to-r from-blue-50 to-green-50 px-8 py-6 border-b border-gray-200'>
						<div className='flex items-center space-x-3'>
							<div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center'>
								<svg
									className='w-6 h-6 text-white'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
									/>
								</svg>
							</div>
							<div>
								<h2 className='text-xl font-bold text-gray-900'>
									Xác minh danh tính
								</h2>
								<p className='text-gray-600 text-sm'>
									Vui lòng nhập đầy đủ thông tin và tải lên
									ảnh CCCD/CMT để xác minh tài khoản
								</p>
							</div>
						</div>
					</div>

					{/* Form Content */}
					<div className='p-8'>
						<CCCDVerificationForm onSubmit={handleSubmit} />
					</div>
				</div>

				{/* Security Notice */}
				<div className='mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4'>
					<div className='flex items-start space-x-3'>
						<svg
							className='w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0'
							fill='currentColor'
							viewBox='0 0 20 20'>
							<path
								fillRule='evenodd'
								d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
								clipRule='evenodd'
							/>
						</svg>
						<div>
							<h3 className='text-sm font-medium text-blue-900'>
								Thông tin bảo mật
							</h3>
							<p className='text-sm text-blue-700 mt-1'>
								Thông tin CCCD của bạn sẽ được mã hóa và bảo mật
								tuyệt đối. Chúng tôi chỉ sử dụng để xác minh
								danh tính và không chia sẻ với bên thứ ba.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CCCDVerificationPage;
