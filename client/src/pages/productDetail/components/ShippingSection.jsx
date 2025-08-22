import React from 'react';

const ShippingSection = () => (
	<section className=' p-6 text-textPrimary'>
		<h2 className='font-bold text-lg mb-4 border-b'>Vận chuyển & Trả hàng</h2>
		<div className='mb-6'>
			<h3 className='font-semibold text-gray-800 mb-2 flex items-center gap-2'>
				<svg
					className='w-5 h-5 text-blue-500'
					fill='none'
					stroke='currentColor'
					strokeWidth='2'
					viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M3 10h13M9 16h6m-6 0a4 4 0 01-4-4V6a4 4 0 014-4h6a4 4 0 014 4v6a4 4 0 01-4 4H9z'
					/>
				</svg>
				Vận chuyển
			</h3>
			<ul className='list-disc pl-5 text-gray-700 space-y-1'>
				<li>Miễn phí vận chuyển toàn quốc cho đơn hàng từ 500.000đ.</li>
				<li>
					Giao hàng tiêu chuẩn:{' '}
					<span className='font-medium'>2-7 ngày làm việc</span>.
				</li>
				<li>
					Giao hàng nhanh:{' '}
					<span className='font-medium'>1-2 ngày làm việc</span> (có
					tính phí).
				</li>
				<li>Nhận hàng tại cửa hàng (nếu có).</li>
			</ul>
		</div>
		<div>
			<h3 className='font-semibold text-gray-800 mb-2 flex items-center gap-2'>
				<svg
					className='w-5 h-5 text-green-500'
					fill='none'
					stroke='currentColor'
					strokeWidth='2'
					viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M19 7v4a2 2 0 01-2 2H7a2 2 0 01-2-2V7m5 4V7m4 4V7'
					/>
				</svg>
				Trả hàng & Đổi hàng
			</h3>
			<ul className='list-disc pl-5 text-gray-700 space-y-1'>
				<li>
					Đổi/trả hàng trong vòng{' '}
					<span className='font-medium'>7 ngày</span> kể từ khi nhận
					hàng.
				</li>
				<li>Sản phẩm phải còn nguyên vẹn, chưa qua sử dụng.</li>
				<li>
					Không áp dụng đổi/trả với sản phẩm khuyến mãi, thanh lý.
				</li>
				<li>
					Xem chi tiết chính sách đổi trả tại{' '}
					<a
						href='/chinh-sach-doi-tra'
						className='text-blue-600 underline hover:text-blue-800'>
						đây
					</a>
					.
				</li>
			</ul>
		</div>
	</section>
);

export default ShippingSection;
