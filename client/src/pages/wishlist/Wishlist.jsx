import ProductCard from '@/components/cards/ProductCard';
import NotFoundWishlist from '@/pages/wishlist/components/NotFoundWishlist';
import useAppQuery from '@/hooks/useAppQuery';
import WishlistService from '@/services/wishlist.service';
import { useEffect } from 'react';
import { useAppMutation } from '@/hooks/useAppMutation';
import { useQueryClient } from '@tanstack/react-query';
import ModalConfirm from '@/components/modal/ModalConfirm';
import { useModal } from '@/hooks/useModal';
const Wishlist = () => {
	const queryClient = useQueryClient();
	const { isOpen, open, close } = useModal();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const { data: wishlist = [] } = useAppQuery(
		['wishlist', 'wishlistItems'],
		() => WishlistService.getWishlist(),
		{
			select: (res) => res.data.wishlistItems,
		},
	);
	console.log(wishlist);

	const { mutateAsync: clearWishlist } = useAppMutation({
		mutationFn: () => WishlistService.clearWishlist(),
		onSuccess: () => {
			queryClient.invalidateQueries(['wishlist']);
			close();
		},
	});

	return (
		<>
			{' '}
			<div className='container mx-auto px-4 py-8'>
				<div className='flex items-center justify-between bg-white p-4 rounded-lg shadow-md'>
					<h1 className='text-2xl font-bold text-black'>Yêu thích</h1>
					<button
						className='bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed'
						disabled={wishlist.length === 0}
						onClick={open}>
						Xóa tất cả
					</button>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4'>
					{wishlist.map((item) => (
						<ProductCard key={item._id} product={item.productId} />
					))}
				</div>
				{/* Không có sản phẩm nào trong danh sách yêu thích */}
				{wishlist.length === 0 && <NotFoundWishlist />}
			</div>
			{wishlist.length > 0 && (
				<ModalConfirm
					isOpen={isOpen}
					onClose={close}
					onConfirm={() => {
						clearWishlist();
					}}
					title='Xác nhận'
					message='Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi danh sách yêu thích không?'
					confirmText='Xóa'
					cancelText='Hủy'
					variant='error'
				/>
			)}
		</>
	);
};

export default Wishlist;
