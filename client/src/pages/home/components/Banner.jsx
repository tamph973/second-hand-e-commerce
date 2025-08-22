import { Swiper, SwiperSlide } from 'swiper/react';
import {
	Navigation,
	Pagination,
	Autoplay,
	EffectFade,
	A11y,
} from 'swiper/modules';
import PropTypes from 'prop-types';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { Link } from 'react-router-dom';
import shopImage from '@/assets/icons/icon-shop.svg';
import { motion } from 'framer-motion';

const GradientButton = ({ href, className, children }) => (
	<Link
		to={href}
		className={`inline-block text-white font-semibold py-3 px-8 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 ${className}`}
		style={{
			background: className.includes('green')
				? 'linear-gradient(to right, #10B981, #3B82F6)'
				: className.includes('purple')
				? 'linear-gradient(to right, #8B5CF6, #EC4899)'
				: className.includes('blue')
				? 'linear-gradient(to right, #3B82F6, #6366F1)'
				: className.includes('red')
				? 'linear-gradient(to right, #dc2626, #f87171)'
				: 'linear-gradient(to right, #1E90FF, #87CEFA)',
		}}>
		{children}
	</Link>
);
GradientButton.propTypes = {
	href: PropTypes.string.isRequired,
	className: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
};

export default function Banner() {
	const slideVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1, transition: { duration: 0.5 } },
	};

	const textVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5, delay: 0.2 },
		},
	};

	const buttonVariants = {
		hidden: { opacity: 0, scale: 0.8 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: { duration: 0.5, delay: 0.4 },
		},
	};
	return (
		<div className='w-full h-[400px] md:h-[500px] font-poppins rounded-2xl overflow-hidden shadow-lg bg-white'>
			<Swiper
				modules={[Navigation, Pagination, Autoplay, EffectFade, A11y]}
				spaceBetween={0}
				slidesPerView={1}
				loop={true}
				autoplay={{
					delay: 5000,
					disableOnInteraction: false,
				}}
				navigation
				pagination={{ clickable: true }}
				effect='fade'
				fadeEffect={{ crossFade: true }}
				className='w-full h-full rounded-2xl overflow-hidden shadow-lg'>
				{/* Slide 1: Kiểm duyệt chất lượng */}
				<SwiperSlide>
					<motion.div
						variants={slideVariants}
						initial='hidden'
						animate='visible'
						className='relative flex flex-col md:flex-row items-center justify-between h-full bg-gradient-to-r from-green-50 to-blue-50 px-6 md:px-16'>
						<motion.div
							variants={textVariants}
							className='relative z-10 max-w-lg text-center md:text-left'>
							<span className='inline-block px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-4'>
								Chất Lượng Đảm Bảo
							</span>
							<h2 className='text-3xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight'>
								Đồ Cũ,{' '}
								<span className='text-green-600'>
									Chất Lượng Mới!
								</span>
							</h2>
							<p className='text-lg md:text-xl text-gray-600 mb-8'>
								Mọi sản phẩm đều được kiểm duyệt kỹ lưỡng để đảm
								bảo chất lượng tốt nhất.
							</p>
							<motion.div variants={buttonVariants}>
								<GradientButton
									href='/products'
									className='green'>
									Khám Phá Ngay
								</GradientButton>
							</motion.div>
						</motion.div>
						<div className='relative w-full md:w-1/2 h-[200px] md:h-[400px] mt-6 md:mt-0'>
							<img
								src='https://images.pexels.com/photos/6894011/pexels-photo-6894011.jpeg'
								alt='Kiểm duyệt chất lượng'
								className='absolute inset-0 w-full h-full object-cover rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-500'
								loading='lazy'
							/>
						</div>
					</motion.div>
				</SwiperSlide>

				{/* Slide 2: Gợi ý thông minh với AI */}
				<SwiperSlide>
					<motion.div
						variants={slideVariants}
						initial='hidden'
						animate='visible'
						className='relative flex flex-col md:flex-row items-center justify-between h-full bg-gradient-to-r from-purple-50 to-pink-50 px-6 md:px-16'>
						<motion.div
							variants={textVariants}
							className='relative z-10 max-w-lg text-center md:text-left'>
							<span className='inline-block px-4 py-2 rounded-full bg-purple-100 text-purple-800 text-sm font-medium mb-4'>
								Công Nghệ AI
							</span>
							<h2 className='text-3xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight'>
								Mua Sắm Thông Minh{' '}
								<span className='text-purple-600'>Với AI</span>
							</h2>
							<p className='text-lg md:text-xl text-gray-600 mb-8'>
								Gợi ý sản phẩm cá nhân hóa nhờ công nghệ máy học
								tiên tiến.
							</p>
							<motion.div variants={buttonVariants}>
								<GradientButton
									href='/products'
									className='purple'>
									Mua Sắm Bây Giờ
								</GradientButton>
							</motion.div>
						</motion.div>
						<div className='relative w-full md:w-1/2 h-[200px] md:h-[400px] mt-6 md:mt-0'>
							<img
								src='https://images.pexels.com/photos/29502371/pexels-photo-29502371.jpeg'
								alt='Gợi ý thông minh'
								className='absolute inset-0 w-full h-full object-cover rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-500'
								loading='lazy'
							/>
						</div>
					</motion.div>
				</SwiperSlide>

				{/* Slide 3: Giao dịch an toàn */}
				<SwiperSlide>
					<motion.div
						variants={slideVariants}
						initial='hidden'
						animate='visible'
						className='relative flex flex-col md:flex-row items-center justify-between h-full bg-gradient-to-r from-blue-50 to-indigo-50 px-6 md:px-16'>
						<motion.div
							variants={textVariants}
							className='relative z-10 max-w-lg text-center md:text-left'>
							<span className='inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4'>
								An Toàn & Tin Cậy
							</span>
							<h2 className='text-3xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight'>
								Giao Dịch{' '}
								<span className='text-blue-600'>An Toàn</span>
							</h2>
							<p className='text-lg md:text-xl text-gray-600 mb-8'>
								Mua sắm đồ cũ với sự bảo vệ và tin cậy tuyệt
								đối.
							</p>
							<motion.div variants={buttonVariants}>
								<GradientButton
									href='/products'
									className='blue'>
									Bắt Đầu Ngay
								</GradientButton>
							</motion.div>
						</motion.div>
						<div className='relative w-full md:w-1/2 h-[200px] md:h-[400px] mt-6 md:mt-0'>
							<img
								src='https://media.istockphoto.com/id/874379488/vi/anh/kh%C3%A1i-ni%E1%BB%87m-thanh-to%C3%A1n-an-to%C3%A0n.jpg?s=1024x1024&w=is&k=20&c=ncXdGO8jBv6k5HGNh3WcqSqQ-8_yqM4B13FCVc5xm-g='
								alt='Giao dịch an toàn'
								className='absolute inset-0 w-full h-full object-cover rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-500'
								loading='lazy'
							/>
						</div>
					</motion.div>
				</SwiperSlide>
				{/* Slide 4: Đăng ký bán hàng */}
				<SwiperSlide>
					<motion.div
						variants={slideVariants}
						initial='hidden'
						animate='visible'
						className='flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-orange-50 to-pink-100 rounded-2xl p-8 md:p-12 h-full shadow-lg'>
						{/* Left: Text content */}
						<motion.div
							variants={textVariants}
							className='flex-1 max-w-xl'>
							<h2 className='text-3xl md:text-4xl font-extrabold mb-4 drop-shadow-lg text-secondary'>
								Trở thành người bán cùng{' '}
								<span className='tracking-tighter'>
									<strong className='text-[#1e90ff]'>
										2
									</strong>
									<strong className='text-primary'>
										EcoC
									</strong>
								</span>
							</h2>
							<p className='text-lg md:text-xl mb-6 font-medium text-gray-700'>
								Tham gia nền tảng bán đồ cũ an toàn, được kiểm
								duyệt và hỗ trợ bởi công nghệ máy học.
								<br />
								<span className='font-semibold text-red-600'>
									Đăng ký ngay để bắt đầu!
								</span>
							</p>
							<ul className='mb-8 space-y-3'>
								<li className='flex items-center text-base md:text-lg text-gray-800'>
									<span className='text-2xl mr-3 mt-0.5 text-orange-500'>
										✔️
									</span>
									<span>
										<b className='text-gray-900 font-semibold'>
											An toàn:
										</b>{' '}
										Quy trình kiểm duyệt chặt chẽ
									</span>
								</li>
								<li className='flex items-center text-base md:text-lg text-gray-800'>
									<span className='text-2xl mr-3 mt-0.5 text-orange-500'>
										✔️
									</span>
									<span>
										<b className='text-gray-900 font-semibold'>
											Thông minh:
										</b>{' '}
										Gợi ý giá & phân loại sản phẩm bằng máy
										học
									</span>
								</li>
								<li className='flex items-center text-base md:text-lg text-gray-800'>
									<span className='text-2xl mr-3 mt-0.5 text-orange-500'>
										✔️
									</span>
									<span>
										<b className='text-gray-900 font-semibold'>
											Dễ dàng:
										</b>{' '}
										Quy trình đăng ký và bán hàng đơn giản
									</span>
								</li>
							</ul>
							<motion.div variants={buttonVariants}>
								<GradientButton
									href='/seller/register'
									className='red'>
									Đăng ký bán hàng
								</GradientButton>
							</motion.div>
						</motion.div>
						{/* Right: Image */}
						<div className='flex-1 flex justify-center mt-8 md:mt-0'>
							<img
								src={shopImage}
								alt='Đăng ký bán hàng'
								className='w-80 h-80 object-contain rounded-xl shadow-md bg-white/60'
							/>
						</div>
					</motion.div>
				</SwiperSlide>
			</Swiper>
		</div>
	);
}
