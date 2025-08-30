import React from 'react';
import { Link } from 'react-router-dom';
import notFoundImage from '@/assets/images/not-found.jpg';

const NotFound = () => {
	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4'>
			<div className='max-w-7xl mx-auto'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center'>
					{/* Left Side - Image */}
					<div className='relative flex justify-center lg:justify-end'>
						<img
							src={notFoundImage} // Thay bằng đường dẫn ảnh thực tế
							alt='404 Page Not Found'
							className='max-w-full h-auto object-contain transform scale-90 lg:scale-100'
							style={{ maxHeight: '500px' }}
						/>
					</div>

					{/* Right Side - Text Message */}
					<div className='text-center lg:text-left'>
						<div className='space-y-6'>
							{/* Vietnamese Message */}
							<div className='space-y-2'>
								<h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight'>
									Xin lỗi, chúng tôi
								</h2>
								<h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight'>
									không tìm thấy trang
								</h2>
								<h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight'>
									mà bạn cần!
								</h2>
							</div>

							{/* Description */}
							<p className='text-base sm:text-lg text-gray-600 max-w-md mx-auto lg:mx-0'>
								Trang bạn đang tìm kiếm có thể đã bị di chuyển,
								xóa hoặc không tồn tại.
							</p>

							{/* Action Buttons */}
							<div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
								<a
									href='/'
									className='inline-flex items-center justify-center px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg'>
									<svg
										className='w-5 h-5 mr-2'
										fill='currentColor'
										viewBox='0 0 20 20'>
										<path d='M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' />
									</svg>
									Về Trang Chủ
								</a>

								<button
									onClick={() => window.history.back()}
									className='inline-flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg'>
									<svg
										className='w-5 h-5 mr-2'
										fill='currentColor'
										viewBox='0 0 20 20'>
										<path
											fillRule='evenodd'
											d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z'
											clipRule='evenodd'
										/>
									</svg>
									Quay Lại
								</button>
							</div>

							{/* Additional Help */}
							<div className='pt-4'>
								<p className='text-sm text-gray-500'>
									Bạn có thể thử tìm kiếm sản phẩm hoặc duyệt
									các danh mục của chúng tôi
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NotFound;
