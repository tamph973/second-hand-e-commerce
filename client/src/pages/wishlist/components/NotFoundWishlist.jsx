import { FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const NotFoundWishlist = () => {
	return (
		<div className='min-h-[60vh] flex items-center justify-center'>
			<div className='text-center max-w-md mx-auto px-4'>
				{/* Heart Icon */}
				<div className='mb-6'>
					<FaHeart className='w-24 h-24 mx-auto text-gray-300' />
				</div>

				{/* Main Heading */}
				<h1 className='text-2xl font-bold text-gray-800 mb-4'>
					Danh sách yêu thích trống.
				</h1>

				{/* Description Text */}
				<div className='text-gray-500 mb-8 space-y-2'>
					<p>Bạn chưa có sản phẩm nào trong danh sách yêu thích.</p>
					<p>
						Bạn sẽ tìm thấy nhiều sản phẩm thú vị trên trang
						&ldquo;Mua sắm&rdquo;.
					</p>
				</div>

				{/* Return to Shop Button */}
				<Link
					to='/'
					className='inline-block text-white px-8 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors duration-200 bg-gradient-to-r from-pink-500 to-pink-600'
					style={{
						backgroundImage: 'linear-gradient(to right, #ff4d6d, #ff6b81)',
					}}>
					Quay lại trang chủ
				</Link>
			</div>
		</div>
	);
};

export default NotFoundWishlist;
