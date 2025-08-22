import ImageGallery from './ImageGallery';
import PropTypes from 'prop-types';

const ProductImageGallery = ({ images = [], alt = '', title = '' }) => {
	return (
		<ImageGallery
			images={images}
			alt={alt}
			showExpand={false}
			showCounter={true}
			showViewAll={false}
			title={title}
			mainHeight={350}
			thumbSize={70}
			thumbImgSize={70}
			className='w-[350px] h-[395px]'
		/>
	);
};

ProductImageGallery.propTypes = {
	images: PropTypes.arrayOf(
		PropTypes.shape({
			url: PropTypes.string.isRequired,
			_id: PropTypes.string,
		}),
	).isRequired,
	alt: PropTypes.string,
	title: PropTypes.string,
};

export default ProductImageGallery;
