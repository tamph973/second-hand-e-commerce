import React, { useState, useEffect } from 'react';
import emptyCart from '@/assets/images/empty-cart.jpg';
import { useDispatch, useSelector } from 'react-redux';
import {
	getCart,
	toggleAllSelection,
	toggleProductSelection,
} from '@/store/cart/cartSlice';
import {
	formatPriceVND,
	renderAttributes,
	renderCondition,
} from '@/utils/helpers';
import { FaShieldAlt, FaTrash } from 'react-icons/fa';
import Button from '@/components/common/Button';

import CartService from '@/services/cart.service';
import toast from 'react-hot-toast';
import ModalConfirm from '@/components/modal/ModalConfirm';
import { useModal } from '@/hooks/useModal';
import { Link } from 'react-router-dom';
import tenPercent from '@/assets/icons/10-percent.png';
import hundredPercent from '@/assets/icons/100-percent.png';
import { calculateTotalPrice, getSelectedCartItems } from '@/utils/cartHelpers';
import { useNavigate } from 'react-router-dom';
import ProgressIndicator from '@/components/common/ProgressIndicator';
import { checkoutSteps } from '@/constants/progressSteps';
const CartPage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const cart = useSelector((state) => state.cart);
	const selected = useSelector((state) => state.cart.selected);
	const { isOpen, open, close } = useModal();
	const [productId, setProductId] = useState(null);
	const [variantId, setVariantId] = useState(null);
	const [paymentType, setPaymentType] = useState('deposit'); // deposit: đặt cọc trước 10%, full: thanh toán 100%

	useEffect(() => {
		dispatch(getCart());
	}, [dispatch]);

	const handleProductCheckboxChange = (sellerId, productId, variantId) => {
		dispatch(toggleProductSelection({ sellerId, productId, variantId }));
	};

	const handleSelectAllChange = () => {
		dispatch(toggleAllSelection());
	};

	const areAllSelected = () => {
		if (!hasVisibleProducts) return false;
		return cart.items.every((seller) =>
			seller.products
				.filter((product) => !product._destroy)
				.every((product) =>
					selected[seller.sellerId]?.some(
						(item) =>
							item.productId === product.id &&
							item.variantId === product.variantId,
					),
				),
		);
	};

	const handleDeleteProduct = async (productId, variantId) => {
		try {
			const res = await CartService.removeCartItem(productId, variantId);
			if (res.status === 200) {
				toast.success(res.data.message);
				dispatch(getCart());
				close();
			}
		} catch (error) {
			toast.error(error);
		}
	};

	const handleIncreaseQuantity = async (productId, quantity, variantId) => {
		try {
			const res = await CartService.updateCartItemQuantity({
				productId,
				quantity: quantity + 1,
				variantId,
			});
			if (res.status === 200) {
				dispatch(getCart());
			}
		} catch (error) {
			toast.error(error);
		}
	};

	const handleDecreaseQuantity = async (productId, quantity, variantId) => {
		if (quantity === 1) {
			open();
			setProductId(productId);
			return;
		}
		try {
			const res = await CartService.updateCartItemQuantity({
				productId,
				quantity: quantity - 1,
				variantId,
			});
			if (res.status === 200) {
				dispatch(getCart());
			}
		} catch (error) {
			toast.error(error);
		}
	};

	const isRequirePrepay =
		calculateTotalPrice(cart.items, selected) >= 2000000;

	const hasVisibleProducts = cart.items.some((item) =>
		item.products.some((product) => !product._destroy),
	);

	// Thay đổi: Không tạo đơn hàng, chỉ chuyển đến checkout
	const handleProceedToCheckout = () => {
		const selectedItems = getSelectedCartItems(cart.items, selected);

		// Kiểm tra có sản phẩm được chọn không
		if (!hasSelectedProducts) {
			toast.error('Vui lòng chọn ít nhất một sản phẩm');
			return;
		}

		// Chuyển đến checkout với thông tin giỏ hàng đã chọn
		navigate('/checkout', {
			state: {
				selectedItems,
				fromCart: true,
			},
		});
	};

	const hasSelectedProducts = getSelectedCartItems(cart.items, selected).some(
		(seller) => seller.products.length > 0,
	);

	return (
		<>
			<div className='container mx-auto px-4 py-6 text-gray-900 bg-gray-50 min-h-screen'>
				<ProgressIndicator
					steps={checkoutSteps}
					currentStep={0}
					className='mb-6'
				/>

				<div className='flex flex-col md:flex-row gap-6'>
					{/* Danh sách sản phẩm */}
					<div className='flex-1'>
						<div className='bg-white rounded-2xl shadow-xl p-6 border border-gray-100'>
							<h2 className='text-3xl font-bold mb-6 text-blue-800'>
								Giỏ hàng của bạn
							</h2>
							<label className='flex items-center mb-6'>
								<input
									type='checkbox'
									className='h-6 w-6 border-2 border-blue-500 rounded-full focus:ring-2 focus:ring-blue-300 transition cursor-pointer text-blue-600'
									checked={areAllSelected()}
									onChange={handleSelectAllChange}
								/>
								<span className='ml-3 text-gray-700 font-semibold text-lg'>
									Chọn tất cả
								</span>
							</label>
							{!hasVisibleProducts ? (
								<div className='flex flex-col items-center py-12'>
									<img
										src={emptyCart}
										className='w-48 h-48 mb-6 rounded-lg shadow-md'
										alt='empty'
									/>
									<div className='text-gray-500 text-xl font-medium'>
										Không có sản phẩm nào trong giỏ hàng
									</div>
									<Link
										to='/products'
										className='mt-6 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition'>
										Mua sắm ngay
									</Link>
								</div>
							) : (
								cart.items
									.filter((item) =>
										item.products.some(
											(product) => !product._destroy,
										),
									)
									.map((item) => (
										<div
											key={item.sellerId}
											className='mb-6 bg-gray-50 rounded-xl p-4 shadow-md hover:shadow-lg transition'>
											<div className='flex items-center mb-4'>
												<span className='font-bold text-xl text-blue-700'>
													{item.fullName}
												</span>
												<span className='ml-4 text-gray-600 text-base'>
													{item.address}
												</span>
											</div>
											{item.products
												.filter(
													(product) =>
														!product._destroy,
												)
												.map((product) => (
													<div
														key={
															product.id +
															product.variantId
														}
														className='flex items-center py-4 border-b border-gray-200 last:border-b-0 hover:bg-white rounded-lg p-2 transition'>
														<input
															type='checkbox'
															className='h-5 w-5 mr-4 rounded-full border-2 border-blue-500 text-blue-600 focus:ring-2 focus:ring-blue-300 transition cursor-pointer'
															checked={
																selected[
																	item
																		.sellerId
																]?.some(
																	(item) =>
																		item.productId ===
																			product.id &&
																		item.variantId ===
																			product.variantId,
																) || false
															}
															onChange={() =>
																handleProductCheckboxChange(
																	item.sellerId,
																	product.id,
																	product.variantId ||
																		null,
																)
															}
															aria-label='Chọn sản phẩm'
														/>
														<img
															src={
																product.thumbnail
															}
															alt={product.title}
															className='w-24 h-24 object-cover rounded-xl border border-gray-200 hover:scale-105 transition-transform'
														/>
														<div className='flex-1 ml-4'>
															<Link
																to={`/products/${product.slug}-${product.id}`}
																title={
																	product.title
																}
																className='font-semibold text-lg text-blue-900 hover:text-blue-600 cursor-pointer line-clamp-2 w-[410px]'>
																{product.title}
															</Link>
															<div className='text-gray-600 text-sm mb-2'>
																{renderCondition(
																	product.condition,
																)}{' '}
																|{' '}
																{renderAttributes(
																	product.attributes,
																)}
															</div>
															<div className='font-bold text-xl text-orange-600'>
																{formatPriceVND(
																	product.amount,
																)}
															</div>
														</div>
														<div className='flex items-center mr-4'>
															<button
																className='w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xl hover:bg-gray-200 transition'
																onClick={() =>
																	handleDecreaseQuantity(
																		product.id,
																		product.quantity,
																		product.variantId,
																	)
																}>
																-
															</button>
															<span className='mx-4 text-lg font-medium'>
																{
																	product.quantity
																}
															</span>
															<button
																onClick={() =>
																	handleIncreaseQuantity(
																		product.id,
																		product.quantity,
																		product.variantId,
																	)
																}
																className='w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xl hover:bg-gray-200 transition'>
																+
															</button>
														</div>
														<button
															className='ml-4 text-gray-500 hover:text-red-600 text-xl transition-colors'
															title='Xóa sản phẩm'
															onClick={() => {
																open();
																setProductId(
																	product.id,
																);
																setVariantId(
																	product.variantId,
																);
															}}>
															<FaTrash />
														</button>
													</div>
												))}
										</div>
									))
							)}
						</div>
					</div>
					{/* Thông tin đơn hàng */}
					<div className='w-full md:w-[400px]'>
						<div className='flex items-center gap-3 p-4 mb-6 rounded-xl bg-green-50 text-green-700 shadow-md'>
							<div className='flex items-center justify-center'>
								<FaShieldAlt className='text-green-500 text-2xl' />
							</div>
							<div>
								<div className='font-semibold text-green-800 text-lg'>
									Bảo vệ người mua
								</div>
								<div className='text-green-700 text-sm leading-snug'>
									Được hoàn tiền đầy đủ nếu hàng không như mô
									tả hoặc không được giao
								</div>
							</div>
						</div>
						<div className='bg-white rounded-2xl shadow-xl p-6 mb-6'>
							<div className='font-semibold text-xl mb-4 text-blue-800'>
								Tóm tắt giỏ hàng
							</div>
							<div className='flex justify-between mb-3 text-gray-700'>
								<span>Tổng tiền hàng:</span>
								<span className='font-bold text-lg'>
									{formatPriceVND(
										calculateTotalPrice(
											cart.items,
											selected,
										),
									)}
								</span>
							</div>
							<div className='flex justify-between text-xl font-bold border-t pt-4 text-blue-900'>
								<span>Tổng tiền tạm tính:</span>
								<span className='text-orange-600'>
									{formatPriceVND(
										calculateTotalPrice(
											cart.items,
											selected,
										),
									)}
								</span>
							</div>

							{/* Đặt cọc nếu đơn hàng có giá trị trên 2 triệu */}
							{isRequirePrepay && (
								<div className='mt-6'>
									<div className='font-semibold text-lg mb-4 text-blue-800'>
										Đặt cọc trước cho đơn hàng từ 2 triệu
										đồng
									</div>
									<div className='grid grid-cols-1 gap-4'>
										<div
											className={`relative p-5 border-2 rounded-xl transition-all duration-200 ${
												paymentType === 'deposit'
													? 'border-blue-500 bg-blue-50 shadow-md'
													: 'border-gray-200 hover:border-gray-300'
											}`}
											onClick={() =>
												setPaymentType('deposit')
											}>
											<input
												type='radio'
												name='paymentType'
												value='deposit'
												checked={
													paymentType === 'deposit'
												}
												onChange={() =>
													setPaymentType('deposit')
												}
												className='absolute top-4 right-4 w-5 h-5 text-blue-500 cursor-pointer'
											/>
											<div className='flex items-center gap-2 cursor-pointer'>
												<img
													src={tenPercent}
													alt='10%'
													width={40}
													height={40}
													className='rounded-full'
												/>
												<div>
													<h3 className='font-bold text-lg text-gray-900'>
														Đặt cọc trước 10%
													</h3>
													<p className='text-gray-600 text-sm mt-1'>
														Thanh toán trước 10% giá
														trị đơn hàng, ít nhất
														200.000₫
													</p>
												</div>
											</div>
										</div>
										<div
											className={`relative p-5 border-2 rounded-xl transition-all duration-200 ${
												paymentType === 'full'
													? 'border-blue-500 bg-blue-50 shadow-md'
													: 'border-gray-200 hover:border-gray-300'
											}`}
											onClick={() =>
												setPaymentType('full')
											}>
											<input
												type='radio'
												name='paymentType'
												value='full'
												checked={paymentType === 'full'}
												onChange={() =>
													setPaymentType('full')
												}
												className='absolute top-4 right-4 w-5 h-5 text-blue-500 cursor-pointer'
											/>
											<div className='flex items-center gap-2 cursor-pointer'>
												<img
													src={hundredPercent}
													alt='100%'
													width={40}
													height={40}
													className='rounded-full'
												/>
												<div>
													<h3 className='font-bold text-lg text-gray-900'>
														Thanh toán 100%
													</h3>
													<p className='text-gray-600 text-sm mt-1'>
														Thanh toán toàn bộ giá
														trị đơn hàng
													</p>
												</div>
											</div>
										</div>
									</div>
									<div className='mt-4 p-3 bg-gray-50 rounded-lg text-gray-600 text-sm'>
										<span className='font-medium'>
											Lưu ý:
										</span>{' '}
										Để bảo vệ quyền lợi, hệ thống yêu cầu{' '}
										<span className='font-bold text-blue-700'>
											thanh toán trước 10% hoặc 100% cho
											đơn hàng trên 2.000.000₫
										</span>
										. Đảm bảo hoàn tiền 100% nếu sản phẩm
										không đúng mô tả.
									</div>
								</div>
							)}
							<Button
								onClick={handleProceedToCheckout}
								className='w-full mt-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed'
								disabled={!hasSelectedProducts}>
								Xác nhận đặt hàng
							</Button>
						</div>
					</div>
				</div>
			</div>
			<ModalConfirm
				variant='error'
				isOpen={isOpen}
				onClose={close}
				message='Bạn có chắc chắn muốn xóa sản phẩm khỏi giỏ hàng không?'
				onConfirm={() => handleDeleteProduct(productId, variantId)}
				confirmText='Xóa'
				cancelText='Huỷ'
			/>
		</>
	);
};

export default CartPage;
