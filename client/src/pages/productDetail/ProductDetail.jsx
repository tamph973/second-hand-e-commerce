import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProductQuery } from '@/hooks/useProductQuery';
import { extractProductIdFromSlug } from '@/utils/helpers';
import ProductGallery from './components/ProductGallery';
import ProductInfo from './components/ProductInfo';
import LoadingThreeDot from '@/components/common/LoadingThreeDot';
import SellerInfo from './components/SellerInfo';
import { getSellerInfo } from '@/store/seller/sellerSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAddress } from '@/store/address/addressSlice';
import { useModal } from '@/hooks/useModal';
import AddAddressModal from '@/components/address/AddAddressModal';
import AddressSelectModal from './components/AddressSelectModal';
import ProductSuggestionBadges from './components/ProductSuggestionBadges';
import { getAuthLocalStorage, addToHistory } from '@/utils/localStorageUtils';
import { toast } from 'react-hot-toast';
import CartService from '@/services/cart.service';
import { getCart } from '@/store/cart/cartSlice';
import ProductAttributes from './components/ProductAttributes';
import ProductDescription from './components/ProductDescription';
import ProductDetailTabs from './components/ProductDetailTabs';
import ShippingSection from './components/ShippingSection';
import ProductReview from './components/ProductReview';
import ProductRecommend from './components/ProductRecommend';
import useAppQuery from '@/hooks/useAppQuery';
import ReviewService from '@/services/review.service';
import VariantService from '@/services/variant.service';
import { useAppMutation } from '@/hooks/useAppMutation';
import { useQueryClient } from '@tanstack/react-query';

const ProductDetail = () => {
	const { slug } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const {
		isOpen: isOpenAddress,
		open: openAddressModal,
		close: closeAddressModal,
	} = useModal();
	const {
		isOpen: isOpenAddNew,
		open: openAddNew,
		close: closeAddNew,
	} = useModal();

	const productId = extractProductIdFromSlug(slug);
	const { product, isLoading } = useProductQuery(productId);
	const { seller } = useSelector((state) => state.seller);
	const { address } = useSelector((state) => state.address);

	const { data: reviews, isLoading: isLoadingReviews } = useAppQuery(
		['reviews', productId],
		() => ReviewService.getProductReviews(productId),
		{
			select: (res) => res.data,
			refetchOnWindowFocus: false,
			gcTime: 5 * 60 * 1000,
			staleTime: 5 * 60 * 1000,
		},
	);
	const { data: variants } = useAppQuery(
		['variants', productId],
		() => VariantService.getVariantsByProduct(productId),
		{
			select: (res) => res.data,
			refetchOnWindowFocus: false,
			gcTime: 5 * 60 * 1000,
			staleTime: 5 * 60 * 1000,
		},
	);

	useEffect(() => {
		if (product?.userId) {
			dispatch(getSellerInfo(product.userId._id));
		}
	}, [product?.userId, dispatch]);

	// Add product to history when product data is loaded
	useEffect(() => {
		if (product && product._id) {
			addToHistory(product);
		}
	}, [product]);

	useEffect(() => {
		dispatch(getUserAddress());
	}, [dispatch]);

	// Extract product ID from slug for debugging
	const [selectedImage, setSelectedImage] = useState(0);
	const [quantity, setQuantity] = useState(product?.stock || 1);
	const [selectedAddress, setSelectedAddress] = useState(null);
	const [selectedVariant, setSelectedVariant] = useState(null);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [productId]);

	useEffect(() => {
		if (!selectedAddress && Array.isArray(address) && address.length > 0) {
			const defaultAddr = address.find((a) => a.isDefault) || address[0];
			setSelectedAddress(defaultAddr);
		}
	}, [address, selectedAddress]);

	const handleSelectAddress = (addr) => {
		setSelectedAddress(addr);
		closeAddressModal();
	};

	if (isLoading) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<LoadingThreeDot />
			</div>
		);
	}

	const handleVariantSelect = (variant) => {
		setSelectedVariant(variant);
	};

	const handleAddToCart = async (productId, quantity) => {
		try {
			const { userId } = getAuthLocalStorage();
			if (!userId) {
				toast.error('Vui lòng đăng nhập để tiếp tục');
				navigate('/auth/login');
				return;
			}

			const res = await CartService.addToCart({
				productId: productId,
				quantity: quantity,
				variantId: selectedVariant?._id,
			});
			if (res.status === 201) {
				dispatch(getCart());
				toast.success(
					<div>
						Đã thêm vào giỏ hàng!
						<button
							className='ml-2 underline text-blue-600'
							onClick={() => {
								window.location.href = '/cart';
							}}>
							Xem giỏ hàng
						</button>
					</div>,
				);
			}
		} catch (error) {
			toast.error(error);
		}
	};

	return (
		<div className='min-h-screen bg-gray-50 py-8'>
			<div className='container mx-auto px-4'>
				<div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
					<div className='flex flex-col lg:flex-row'>
						{/* Left: Product Gallery */}
						<div className='lg:w-1/2'>
							<ProductGallery
								images={product?.images || []}
								selectedImage={selectedImage}
								onImageSelect={setSelectedImage}
								title={product?.title}
							/>
							<ProductSuggestionBadges />
						</div>

						{/* Right: Product Information */}
						<div className='lg:w-1/2'>
							<ProductInfo
								product={product}
								variants={variants}
								onVariantSelect={handleVariantSelect}
								quantity={quantity}
								onQuantityChange={setQuantity}
								onOpenAddressModal={openAddressModal}
								selectedAddress={selectedAddress}
								addToCart={handleAddToCart}
							/>
						</div>
					</div>
				</div>

				{/* Section thông tin người bán */}
				<div className='bg-white rounded-2xl shadow-xl overflow-hidden mt-4'>
					{/* Component SellerInfo */}
					<>
						<SellerInfo
							seller={seller}
							avatar={seller?.avatar.url}
							name={seller?.fullName}
							isVerified={seller?.sellerVerification?.isVerified}
							isOnline={true}
							lastActive={seller?.lastActive}
							shopUrl={seller?.shopUrl}
							onChat={() => {}}
							onViewShop={() => {
								navigate(`/shop/${seller?.id}`);
							}}
							stats={{
								rating: '4.5',
								replyRate: '88',
								products: seller?.productCount,
								replyTime: 'trong vài giờ',
								followers: '39,7k',
								joined: seller?.createdAt,
							}}
						/>
					</>
				</div>

				{/* Thông tin chi tiết */}
				<div className='bg-white rounded-2xl shadow-xl overflow-hidden mt-4'>
					<ProductAttributes
						categoryName={product?.categoryId?.name}
						attributes={product?.attributes}
						brand={product?.brandId?.name}
						color={product?.attributes.color}
					/>
				</div>

				{/* Tab thông tin chi tiết */}
				<div className='bg-white rounded-2xl shadow-xl overflow-hidden mt-4'>
					<ProductDetailTabs
						description={
							<ProductDescription
								description={product?.description}
							/>
						}
						shippingSection={<ShippingSection />}
						reviewSection={
							<ProductReview
								product={product}
								data={reviews}
								isLoading={isLoadingReviews}
							/>
						}
					/>
				</div>

				{/* Gợi ý sản phẩm tương tự */}
				<div className='bg-white rounded-2xl shadow-xl overflow-hidden mt-4'>
					<ProductRecommend productId={productId} />
				</div>
			</div>

			{/* Modal hiển thị chọn địa chỉ nhận hàng */}
			<AddressSelectModal
				isOpen={isOpenAddress}
				onClose={closeAddressModal}
				addresses={address}
				onAddNew={openAddNew}
				selectedAddress={selectedAddress}
				onSelect={handleSelectAddress}
			/>

			<AddAddressModal
				isOpen={isOpenAddNew}
				onClose={closeAddNew}
				onSuccess={() => {
					dispatch(getUserAddress());
				}}
			/>
		</div>
	);
};

export default ProductDetail;
