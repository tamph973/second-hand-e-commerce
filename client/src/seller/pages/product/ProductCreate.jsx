import { useState } from 'react';
import ProductCreateForm from '@/seller/components/ProductCreateForm';
import CategorySelectModal from '@/seller/components/CategorySelectModal';
import AddressSelectModal from '@/seller/components/AddressSelectModal';
import { useModal } from '@/hooks/useModal';

const ProductCreate = () => {
	const {
		isOpen: isCategoryModalOpen,
		open: openCategoryModal,
		close: closeCategoryModal,
	} = useModal();
	const {
		isOpen: isAddressModalOpen,
		open: openAddressModal,
		close: closeAddressModal,
	} = useModal();
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [selectedAddress, setSelectedAddress] = useState(null);

	return (
		<div className='min-h-screen bg-gray-50 py-6'>
			<div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
				{/* Page Header */}
				<div className='mb-8'>
					<h1 className='text-3xl font-bold text-gray-900 mb-2'>
						Tạo sản phẩm mới
					</h1>
					<p className='text-gray-600 text-lg'>
						Thêm sản phẩm mới vào danh sách bán hàng
					</p>
				</div>

				{/* Product Creation Form */}
				<ProductCreateForm
					selectedCategory={selectedCategory}
					setSelectedCategory={setSelectedCategory}
					openCategoryModal={openCategoryModal}
					selectedAddress={selectedAddress}
					openAddressModal={openAddressModal}
				/>

				{/* Category Selection Modal */}
				<CategorySelectModal
					isOpen={isCategoryModalOpen}
					onClose={closeCategoryModal}
					selectedCategory={selectedCategory}
					onSelect={setSelectedCategory}
				/>

				{/* Address Selection Modal */}
				<AddressSelectModal
					isOpen={isAddressModalOpen}
					onClose={closeAddressModal}
					selectedAddress={selectedAddress}
					onSelect={setSelectedAddress}
				/>
			</div>
		</div>
	);
};

export default ProductCreate;
