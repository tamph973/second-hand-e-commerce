import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, FreeMode } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/thumbs';

const ImageGallery = ({
	images = [],
	initialIndex = 0,
	showExpand = false,
	onExpand,
	showCounter = true,
	showViewAll = false,
	onViewAll,
	alt = '',
	title = '',
	className = '',
	mainHeight = 420,
	thumbSize = 64,
	thumbImgSize = 56,
}) => {
	const [thumbsSwiper, setThumbsSwiper] = useState(null);
	const [activeIndex, setActiveIndex] = useState(initialIndex);
	const mainSwiperRef = useRef(null);

	if (!images.length) {
		return (
			<div className='text-center text-gray-500 py-4'>
				Không có ảnh sản phẩm
			</div>
		);
	}

	const handleSlideChange = (swiper) => {
		setActiveIndex(swiper.activeIndex);
	};

	const handlePrev = () => {
		if (mainSwiperRef.current) {
			mainSwiperRef.current.slidePrev();
		}
	};

	const handleNext = () => {
		if (mainSwiperRef.current) {
			mainSwiperRef.current.slideNext();
		}
	};

	const handleExpand = () => {
		if (onExpand) {
			onExpand();
		} else {
			window.open(images[activeIndex].url, '_blank');
		}
	};

	const handleViewAll = () => {
		if (onViewAll) {
			onViewAll();
		} else {
			alert(`Xem tất cả ${images.length} ảnh`);
		}
	};

	return (
		<div className={`w-full max-w-[500px] mx-auto ${className}`}>
			{/* Main image slider */}
			<div className='relative group'>
				<Swiper
					modules={[Thumbs, FreeMode]}
					spaceBetween={0}
					thumbs={{ swiper: thumbsSwiper }}
					onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
					onSlideChange={handleSlideChange}
					initialSlide={initialIndex}
					style={{ height: mainHeight, minHeight: mainHeight }}
					className={`w-full rounded-xl overflow-hidden shadow-lg bg-white`}
				>
					{images.map((img, idx) => (
						<SwiperSlide
							key={img._id || idx}
							className='flex items-center justify-center'>
							<img
								src={img.url}
								title={title}
								alt={alt || `Image ${idx + 1}`}
								className='w-full h-full object-contain rounded-xl cursor-pointer'
								style={{ height: mainHeight, minHeight: mainHeight, maxHeight: mainHeight }}
							/>
						</SwiperSlide>
					))}
				</Swiper>

				{/* Navigation Arrows */}
				<button
					onClick={handlePrev}
					className='absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10'>
					<FaChevronLeft className='text-gray-700' />
				</button>
				<button
					onClick={handleNext}
					className='absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10'>
					<FaChevronRight className='text-gray-700' />
				</button>

				{/* Image Counter */}
				{showCounter && (
					<div
						className='absolute bottom-4 right-4 flex items-end justify-end'
						style={{ minWidth: 48, minHeight: 32 }}
					>
						<div
							className='bg-black/80 text-white px-3 py-1 rounded-lg text-base font-semibold shadow-lg z-[10]'
							style={{ minWidth: 44, textAlign: 'center', letterSpacing: 1 }}
						>
							{activeIndex + 1}<span className='mx-1 text-xs font-normal'>/</span>{images.length}
						</div>
					</div>
				)}

				{/* Expand Button */}
				{showExpand && (
					<button
						onClick={handleExpand}
						className='absolute top-4 right-4 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10'>
						<FaExpand className='text-gray-700' />
					</button>
				)}
			</div>

			{/* Thumbnails slider - Ảnh nhỏ */}
			<Swiper
				modules={[Thumbs, FreeMode]}
				onSwiper={setThumbsSwiper}
				spaceBetween={10}
				slidesPerView={5}
				freeMode={true}
				watchSlidesProgress={true}
				className='mt-4 h-20 flex justify-center'
			>
				{images.map((img, idx) => (
					<SwiperSlide
						key={img._id || idx}
						className='flex items-center justify-center'
						style={{ width: thumbSize, height: thumbSize, minWidth: thumbSize, minHeight: thumbSize, maxWidth: thumbSize, maxHeight: thumbSize }}
					>
						<img
							src={img.url}
							alt={alt || `Thumbnail ${idx + 1}`}
							title={title}
							className={`object-cover rounded-lg border ${
								activeIndex === idx
									? 'border-blue-500 ring-2 ring-blue-200'
									: 'border-gray-200 hover:border-gray-300'
							} transition-all duration-200 cursor-pointer`}
							style={{ width: thumbImgSize, height: thumbImgSize }}
							onClick={() => {
								setActiveIndex(idx);
								mainSwiperRef.current && mainSwiperRef.current.slideTo(idx);
							}}
						/>
					</SwiperSlide>
				))}
				{/* Nếu ít hơn 5 ảnh, thêm các slide trống để căn giữa */}
				{Array.from({ length: Math.max(0, 5 - images.length) }).map((_, idx) => (
					<SwiperSlide
						key={`empty-${idx}`}
						className='flex items-center justify-center opacity-0'
						style={{ width: thumbSize, height: thumbSize, minWidth: thumbSize, minHeight: thumbSize, maxWidth: thumbSize, maxHeight: thumbSize }}
					/>
				))}
			</Swiper>

			{/* View All Photos Button */}
			{showViewAll && (
				<button
					onClick={handleViewAll}
					className='mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2'>
					<FaExpand className='w-4 h-4' />
					Xem tất cả ảnh ({images.length})
				</button>
			)}
		</div>
	);
};

ImageGallery.propTypes = {
	images: PropTypes.arrayOf(
		PropTypes.shape({
			url: PropTypes.string.isRequired,
			_id: PropTypes.string,
		}),
	).isRequired,
	initialIndex: PropTypes.number,
	onImageSelect: PropTypes.func,
	showExpand: PropTypes.bool,
	onExpand: PropTypes.func,
	showCounter: PropTypes.bool,
	showViewAll: PropTypes.bool,
	onViewAll: PropTypes.func,
	alt: PropTypes.string,
	className: PropTypes.string,
	title: PropTypes.string,
	mainHeight: PropTypes.number,
	thumbSize: PropTypes.number,
	thumbImgSize: PropTypes.number,
};

export default ImageGallery;
