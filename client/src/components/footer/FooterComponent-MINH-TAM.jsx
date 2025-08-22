'use client';

import logo from '@/assets/images/logo.png';
import facebook from '@/assets/icons/icon-facebook.svg';
import github from '@/assets/icons/icon-github.png';
import appStore from '@/assets/icons/appstore.png';
import googlePlay from '@/assets/icons/googleplay.png';
import qrCode from '@/assets/images/qrcode_localhost.png';

import { Link } from 'react-router-dom';
export default function FooterComponent() {
	return (
		<footer className='border-t bg-white text-gray-600'>
			<div className='container mx-auto px-4 py-16'>
				{/* Top content */}
				<div className='grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4'>
					{/* Brand */}
					<div className='space-y-5'>
						<img
							className='h-10 w-auto'
							src={logo}
							alt='Oreka'
							loading='lazy'
						/>
						<p className='text-sm'>
							2EcoC - Nền Tảng Mua Bán Đồ Cũ Kiểm Duyệt An Toàn.
						</p>
						<div className='space-y-4'>
							<div>
								<div className='text-sm font-semibold text-gray-800'>
									Chứng nhận
								</div>
								<a
									href='http://online.gov.vn/Home/WebDetails/82526'
									target='_blank'
									rel='noreferrer'
									className='inline-block mt-2'>
									<img
										className='h-14 w-auto'
										src='https://static.oreka.vn/d/_next/static/images/dadangky-87ad36d72b86471dda80744bb5a0329c.png'
										alt='Bộ Công Thương'
										loading='lazy'
									/>
								</a>
							</div>
							<div>
								<div className='text-sm font-semibold text-gray-800'>
									Phương thức thanh toán
								</div>
								<div className='mt-3 flex gap-4'>
									<img
										loading='lazy'
										className='h-6'
										src='https://static.oreka.vn/d/_next/static/images/visa-58401bb56c50049a3e4b928c8d562fd2.svg'
										alt='visa'
									/>
									<img
										loading='lazy'
										className='h-6'
										src='https://static.oreka.vn/d/_next/static/images/vnpay-0f841d0b4c8157965bf02ffb2f56c17a.svg'
										alt='vnpay'
									/>
									<img
										loading='lazy'
										className='h-6'
										src='https://static.oreka.vn/d/_next/static/images/momo-545c294f2ea7209254359efdfcbb4933.svg'
										alt='momo'
									/>
									<img
										loading='lazy'
										className='h-6'
										src='https://static.oreka.vn/d/_next/static/images/ngan-luong-565f89d40d9b43985e3cf6cee661c997.svg'
										alt='ngân lượng'
									/>
								</div>
							</div>
							<div>
								<div className='text-sm font-semibold text-gray-800'>
									Dịch vụ giao hàng
								</div>
								<div className='mt-3 flex items-center gap-4'>
									<img
										loading='lazy'
										className='h-6'
										src='https://static.oreka.vn/d/_next/static/images/ghn-f89fc5a2da69727244a5ef610737c6e3.svg'
										alt='giao hàng nhanh'
									/>
									<img
										loading='lazy'
										className='h-6'
										src='https://static.oreka.vn/d/_next/static/images/ninjavan-47a8597cfd26db9245475f63c1fa21cb.svg'
										alt='ninjavan'
									/>
									<img
										loading='lazy'
										className='h-6'
										src='https://static.oreka.vn/d/_next/static/images/lazada-eac1506149b3cdb77dee711397c24bdc.svg'
										alt='lazada logistics'
									/>
								</div>
							</div>
						</div>
					</div>

					{/* About links */}
					<div className='space-y-4'>
						<div className='text-base font-semibold text-gray-800'>
							Về 2EcoC
						</div>
						<nav className='space-y-3 text-sm'>
							<a
								className='block hover:text-gray-800'
								href='/about-us'>
								Giới thiệu 2EcoC
							</a>
							<a
								className='block hover:text-gray-800'
								href='/faqs'>
								Các câu hỏi thường gặp
							</a>
							<a
								className='block hover:text-gray-800'
								href='/faqs/900000948046/900005933346'>
								Điều khoản dịch vụ
							</a>
							<a
								className='block hover:text-gray-800'
								href='/faqs/900000948046/900006681506'>
								Quy chế hoạt động
							</a>
							<a
								className='block hover:text-gray-800'
								href='/faqs/900000948046/900006899483'>
								Hướng dẫn an toàn sử dụng
							</a>
							<a
								className='block hover:text-gray-800'
								href='/quy-trinh-ban'>
								Hướng dẫn bán hàng
							</a>
							<a
								className='block hover:text-gray-800'
								href='/blog'>
								Blog
							</a>
						</nav>
					</div>

					{/* Policy links */}
					<div className='space-y-4'>
						<div className='text-base font-semibold text-gray-800'>
							Chính sách
						</div>
						<nav className='space-y-3 text-sm'>
							<a
								className='block hover:text-gray-800'
								href='/faqs/900000948046/900006898683'>
								Chính sách bảo mật
							</a>
							<a
								className='block hover:text-gray-800'
								href='/faqs/900000948346/900006900243'>
								Chính sách bảo vệ người mua
							</a>
							<a
								className='block hover:text-gray-800'
								href='/faqs/900000948046/900006681366'>
								Chính sách giải quyết tranh chấp
							</a>
							<a
								className='block hover:text-gray-800'
								href='/faqs/900000948046/900005933826'>
								Chính sách giao tiếp
							</a>
							<a
								className='block hover:text-gray-800'
								href='/faqs/900000948046/900006898923'>
								Những món đồ bị cấm
							</a>
							<a
								className='block hover:text-gray-800'
								href='/faqs/900000948046/900005933746'>
								Hành vi bị cấm
							</a>
						</nav>
					</div>

					{/* Apps and social */}
					<div className='space-y-5'>
						<div className='text-base font-semibold text-gray-800'>
							Tải ứng dụng
						</div>
						<div className='flex items-start gap-4'>
							<div className='space-y-4'>
								<a
									className='block'
									target='_blank'
									href='https://apps.apple.com/vn/app/oreka/id1640179871'
									rel='noreferrer'>
									<img
										className='h-12 w-auto'
										src={appStore}
										alt='App Store'
										loading='lazy'
									/>
								</a>
								<a
									className='block'
									target='_blank'
									href='https://play.google.com/store/apps/details?id=vn.oreka.orekaapp'
									rel='noreferrer'>
									<img
										className='h-12 w-auto'
										src={googlePlay}
										alt='Google Play'
										loading='lazy'
									/>
								</a>
							</div>
							<img
								className='h-28 w-28'
								src={qrCode}
								alt='QR Oreka'
								loading='lazy'
							/>
						</div>

						<div className='pt-4 text-base font-semibold text-gray-800'>
							Theo dõi chúng tôi
						</div>
						<div className='flex gap-4'>
							<Link
								to='https://www.facebook.com/TuiTenTam973'
								target='_blank'
								rel='noreferrer'>
								<img
									className='h-8 w-8'
									src={facebook}
									alt='facebook'
									loading='lazy'
								/>
							</Link>

							<Link
								to='https://github.com/tamph973'
								target='_blank'
								rel='noreferrer'>
								<img
									className='h-8 w-8'
									src={github}
									alt='youtube'
									loading='lazy'
								/>
							</Link>
						</div>
					</div>
				</div>

				{/* Bottom bar */}
				<div className='mt-12 border-t pt-6 text-xs text-gray-400'>
					<div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
						<p>
							© {new Date().getFullYear()} 2EcoC. Đã đăng ký bản
							quyền.
						</p>
						<p>
							CÔNG TY TNHH MTV 2ECOC VIỆT NAM | MSDN: 0124567890 |
							Nơi cấp: Phòng Đăng Ký Kinh Doanh - Sở Kế Hoạch và
							Đầu Tư Hà Nội - Ngày cấp: 20/08/2025
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
