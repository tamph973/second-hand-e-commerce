/* eslint-disable react/prop-types */
import ImageGallery from '../../../components/common/ImageGallery';

const ProductGallery = ({ images, selectedImage, onImageSelect, title }) => {
	const handleExpand = () => {
		// Có thể mở modal fullscreen hoặc lightbox ở đây
		console.log('Expand clicked - current image:', selectedImage);
		// Fallback: mở ảnh trong tab mới
		if (images[selectedImage]) {
			window.open(images[selectedImage].url, '_blank');
		}
	};

	const handleViewAll = () => {
		// Có thể mở modal gallery hoặc chuyển đến trang gallery
		console.log('View all clicked - total images:', images.length);
		// Fallback: alert thông báo
		alert(`Xem tất cả ${images.length} ảnh sản phẩm`);
	};

	return (
		<div className='p-6'>
			<ImageGallery
				title={title}
				images={images}
				initialIndex={selectedImage || 0}
				onImageSelect={onImageSelect}
				showExpand={true}
				onExpand={handleExpand}
				showCounter={true}
				showViewAll={true}
				onViewAll={handleViewAll}
				alt='Product image'
				mainHeight={430}
				className='w-[430px]'
				thumbSize={70}
				thumbImgSize={70}
			/>
		</div>
	);
};

export default ProductGallery;
