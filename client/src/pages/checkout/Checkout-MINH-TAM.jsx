import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AddressOrder from './components/AddressOrder';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAddress } from '@/store/address/addressSlice';
import { getCart } from '@/store/cart/cartSlice';
import PaymentMethod from './components/PaymentMethod';
import ShippingMethod from './components/ShippingMethod';
import { getSelectedCartItems } from '@/utils/cartHelpers';
import ProductItemCheckout from './components/ProductItemCheckout';
import OrderSummary from './components/OrderSummary';
import PaymentService from '@/services/payment.service';
import OrderService from '@/services/order.service';
import toast from 'react-hot-toast';
import ProgressIndicator from '@/components/common/ProgressIndicator';
import { checkoutSteps } from '@/constants/progressSteps';
import { useAppMutation } from '@/hooks/useAppMutation';
import OrderDiscount from './components/OrderDiscount';
import useAppQuery from '@/hooks/useAppQuery';
import DiscountService from '@/services/discount.service';

const Checkout = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const cart = useSelector((state) => state.cart);
	const selected = useSelector((state) => state.cart.selected);
	const { orderId, selectedItems, fromCart } = useLocation().state || {};
	const [shippingAddress, setShippingAddress] = useState(null);
	const [shippingFee, setShippingFee] = useState(0);
	const [discount, setDiscount] = useState(0); // Giảm giá từ voucher
	const [paymentMethod, setPaymentMethod] = useState(null);
	const [isProcessing, setIsProcessing] = useState(false);

	useEffect(() => {
		dispatch(getUserAddress());
		dispatch(getCart());
	}, [dispatch]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	// Callback để nhận địa chỉ được chọn từ AddressOrder
	const handleAddressSelect = (address) => {
		setShippingAddress(address);
	};

	// Lấy danh sách sản phẩm từ cart hoặc từ state
	const itemsSelected = fromCart
		? getSelectedCartItems(cart.items, selected)
		: selectedItems;

	// Tính toán tổng tiền - tính tất cả sản phẩm từ tất cả seller
	const subtotal = itemsSelected?.reduce((total, seller) => {
		// Tính tổng tiền của tất cả sản phẩm trong seller này
		const sellerTotal = seller.products.reduce((sellerSum, product) => {
			return sellerSum + product.price * product.quantity;
		}, 0);
		return total + sellerTotal;
	}, 0);

	const total = subtotal + shippingFee - discount;

	const { data: discounts, isLoading } = useAppQuery(
		['user-discounts'],
		() => DiscountService.getDiscountsForUser(),
		{
			select: (res) => res.data,
			refetchOnWindowFocus: false,
			staleTime: 1000 * 60 * 5,
			gcTime: 1000 * 60 * 5,
		},
	);

	// Mutation để tạo đơn hàng
	const { mutateAsync: createOrder } = useAppMutation({
		mutationFn: (values) => OrderService.createOrder(values),
		onSuccess: async (res) => {
			// Tiếp tục thanh toán với đơn hàng vừa tạo
			await handlePayment(res.data.data[0].paymentId);
		},
		onError: (error) => {
			toast.error(error || 'Tạo đơn hàng thất bại');
			setIsProcessing(false);
		},
	});

	// Xử lý thanh toán
	const handlePayment = async (paymentId) => {
		try {
			if (paymentMethod === 'VNPAY') {
				toast.success('Đang chuyển hướng đến trang thanh toán...');
				const res = await PaymentService.vnpayPayment({
					paymentId: paymentId,
					totalAmount: total,
				});
				window.location.href = res.data.paymentUrl;
			} else if (paymentMethod === 'MOMO') {
				toast.success('Đang chuyển hướng đến trang thanh toán...');
				const res = await PaymentService.momoPayment({
					paymentId: paymentId,
					totalAmount: total,
				});
				window.location.href = res.data.paymentUrl;
			} else {
				// window.location.href = res.data.paymentUrl;
				// Xử lý thanh toán COD hoặc phương thức khác
				toast.success('Đặt hàng thành công!');
				// Refresh cart để xóa sản phẩm đã đặt
				await dispatch(getCart());
				// Redirect về trang đơn hàng
				navigate('/checkout/success/?paymentId=' + paymentId);
			}
		} catch (error) {
			toast.error(error.message || 'Có lỗi xảy ra khi thanh toán');
			setIsProcessing(false);
		}
	};

	const handleCheckout = async () => {
		if (!paymentMethod) {
			toast.error('Vui lòng chọn phương thức thanh toán');
			return;
		}

		if (!shippingAddress) {
			toast.error('Vui lòng chọn địa chỉ giao hàng');
			return;
		}

		setIsProcessing(true);
		try {
			// Nếu đã có orderIds (từ OrderCard), chỉ cần thanh toán (cho trường hợp)
			if (orderId) {
				// Cập nhật đơn hàng với thông tin địa chỉ và phí ship
				await OrderService.updateOrder({
					orderId: orderId,
					shippingFee: shippingFee,
					shippingAddress: shippingAddress,
				});
				// Thanh toán đơn hàng hiện có
				await handlePayment(orderId);
			} else {
				// Tạo đơn hàng mới từ giỏ hàng
				await createOrder({
					cartItems: itemsSelected,
					shippingFee: shippingFee,
					shippingAddress: shippingAddress._id,
					totalAmount: total,
					paymentMethod: paymentMethod,
					discount: discount,
				});
			}
		} catch (error) {
			toast.error(error || 'Có lỗi xảy ra khi thanh toán');
			setIsProcessing(false);
		}
	};

	return (
		<div className='container mx-auto px-4 py-8 min-h-screen text-gray-900'>
			<ProgressIndicator
				steps={checkoutSteps}
				currentStep={1}
				className='mb-6'
			/>

			<div className='flex flex-col lg:flex-row gap-6'>
				{/* Left: Danh sách sản phẩm */}
				<div className='w-full lg:w-2/3'>
					<div className='bg-white rounded-2xl shadow-xl p-6 mb-6'>
						<h2 className='text-xl font-bold mb-4'>Sản phẩm</h2>
						{itemsSelected?.map((seller) =>
							seller.products.map((product) => (
								<ProductItemCheckout
									key={seller.sellerId + '-' + product.id}
									product={product}
									seller={seller}
								/>
							)),
						)}
					</div>
					<div className='bg-white rounded-2xl shadow-xl p-6 mb-6'>
						<AddressOrder onAddressSelect={handleAddressSelect} />
					</div>
					<div className='bg-white rounded-2xl shadow-xl p-6 mb-6'>
						<PaymentMethod paymentMethod={setPaymentMethod} />
					</div>
					<div className='bg-white rounded-2xl shadow-xl p-6'>
						<ShippingMethod onShippingFee={setShippingFee} />
					</div>
				</div>
				{/* Right: Tóm tắt đơn hàng */}
				<div className='w-full lg:w-1/3 '>
					{/* Giảm giá */}
					<OrderDiscount
						discounts={discounts}
						setDiscount={setDiscount}
						subtotal={subtotal}
					/>
					{/* Tóm tắt */}
					<OrderSummary
						subtotal={subtotal}
						discount={discount}
						shippingFee={shippingFee}
						total={total}
						onCheckout={handleCheckout}
						isProcessing={isProcessing}
					/>
				</div>
			</div>
		</div>
	);
};

export default Checkout;
