import { useCallback, useState, useEffect } from 'react';
import useAppQuery from '@/hooks/useAppQuery';
import ImageDropzone from '@/components/common/ImageDropzone';
import { useFormik } from 'formik';
import emptyCategory from '@/assets/images/empty-category.svg';
import CustomInput from '@/components/form/CustomInput';
import Button from '@/components/common/Button';
import ConditionSelector from './ConditionSelector';
import VariantSelector from './VariantSelector';
import BrandService from '@/services/brand.service';
import {
	CONDITION_OPTIONS,
	COLOR_OPTIONS,
	WARRANTY_OPTIONS,
	ORIGIN_OPTIONS,
} from '@/constants/productOptions';
import PropTypes from 'prop-types';
import { FaCaretDown } from 'react-icons/fa6';
import { productCreateSchema } from '@/validators/productCreateSchema';
import { formatPriceVND } from '@/utils/helpers';
import { productCateFields } from '@/constants/productCateFields';
import toast from 'react-hot-toast';
import SellerService from '@/services/seller.service';
import { useAppMutation } from '@/hooks/useAppMutation';
import { useQueryClient } from '@tanstack/react-query';
import LoadingThreeDot from '@/components/common/LoadingThreeDot';
import ProductDescription from './ProductDescription';
import { RiErrorWarningFill } from 'react-icons/ri';

const ProductCreateForm = ({
	openCategoryModal,
	selectedCategory,
	selectedAddress,
	openAddressModal,
}) => {
	const [productType, setProductType] = useState('SINGLE');
	const [variantOptions, setVariantOptions] = useState([]); // name, [value]
	const [variants, setVariants] = useState([]);
	const [priceInput, setPriceInput] = useState('');
	const [localLoading, setLocalLoading] = useState(false);
	const categoryName = selectedCategory?.name;
	const dynamicFields =
		productCateFields.categories[categoryName]?.fields || [];
	const queryClient = useQueryClient();
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const handleOptionsChange = useCallback((opts) => {
		setVariantOptions(opts);
	}, []);

	const handleVariantsChange = useCallback((vars) => setVariants(vars), []);

	// Lấy thương hiệu
	const { data: brands = [] } = useAppQuery(
		['brands'],
		() => BrandService.getAllBrands(),
		{
			select: (res) => res.data,
			refetchOnWindowFocus: false,
		},
	);

	const { mutateAsync: createProduct } = useAppMutation({
		mutationFn: (values) => SellerService.createProduct(values),
		onSuccess: (res) => {
			toast.success(res.data.message || 'Đăng tin thành công');
			queryClient.invalidateQueries(['products']);
			formik.resetForm();
			window.location.reload();
		},
		onError: (error) => {
			toast.error(error || 'Đăng tin thất bại');
		},
		onSettled: () => {
			setLocalLoading(false);
		},
	});

	const formik = useFormik({
		initialValues: {
			title: '',
			description: '',
			categoryId: '',
			brandId: '',
			address: '',
			images: [],
			condition: 'NEW',
			price: 0,
			stock: 1, // Thêm trường số lượng
			color: '',
			warranty: '',
			origin: '',
		},
		validationSchema: productCreateSchema,
		onSubmit: async (values) => {
			// Build attributes object from dynamic fields
			const attributes = {};

			// Add dynamic fields
			dynamicFields.forEach((field) => {
				if (values[field.name]) {
					attributes[field.name] = values[field.name];
				}
			});

			// Add color if exists
			if (values.color) {
				attributes.color = values.color;
			}

			// Prepare data for API
			const productData = {
				...values,
				attributes,
				type: productType,
			};

			if (productType === 'MULTIPLE' && variants.length > 0) {
				productData.variants = variants;
			}
			setLocalLoading(true);
			await createProduct(productData);
		},
	});

	const isFormValid = formik.isValid && formik.dirty && !localLoading;

	// Khi selectedCategory thay đổi, cập nhật categoryId cho formik
	useEffect(() => {
		formik.setFieldValue('categoryId', selectedCategory?._id || '');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedCategory, formik.setFieldValue]);

	// Địa chỉ
	useEffect(() => {
		formik.setFieldValue('address', selectedAddress);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedAddress, formik.setFieldValue]);

	const handlePriceChange = (e) => {
		formik.handleChange(e);
		const raw = e.target.value.replace(/\D/g, '');
		if (raw === '') {
			setPriceInput('');
			formik.setFieldValue('price', '');
		} else {
			setPriceInput(formatPriceVND(Number(raw)).replace(' ₫', ''));
			formik.setFieldValue('price', Number(raw));
		}
	};

	// Tính phí dịch vụ, phí thanh toán, số tiền nhận được
	const priceNumber = Number(formik.values.price) || 0;
	const SERVICE_FEE_RATE = 0.079;
	const PAYMENT_FEE_RATE = 0.02;
	const serviceFee = Math.round(priceNumber * SERVICE_FEE_RATE);
	const paymentFee = Math.round(priceNumber * PAYMENT_FEE_RATE);
	const netAmount = priceNumber - serviceFee - paymentFee;

	return (
		<div className='bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-6xl mx-auto'>
			<form
				className='flex flex-col gap-8'
				onSubmit={formik.handleSubmit}>
				{/* Thông tin chung */}
				<section className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
					<h2 className='font-bold text-xl mb-6 text-gray-800'>
						Thông tin chung
					</h2>
					<div className='mb-6'>
						<label className='block mb-2 text-sm font-medium text-gray-700'>
							Danh mục sản phẩm{' '}
							<span className='text-red-500'>*</span>
						</label>
						<Button
							type='button'
							className='w-full border border-gray-300 px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 text-left rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							onClick={openCategoryModal}>
							<span className='text-gray-700'>
								{selectedCategory
									? selectedCategory.name
									: 'Chọn danh mục sản phẩm'}
							</span>
							<FaCaretDown className='ml-2 text-gray-400' />
						</Button>
					</div>
					<div className='mb-6'>
						<label
							htmlFor='productType'
							className='block mb-3 text-sm font-medium text-gray-700'>
							Loại sản phẩm
						</label>
						<div className='flex gap-6'>
							<label className='flex items-center cursor-pointer group'>
								<input
									type='radio'
									id='productType'
									name='productType'
									value='SINGLE'
									checked={productType === 'SINGLE'}
									onChange={() => setProductType('SINGLE')}
									className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2'
								/>
								<span className='ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900'>
									Sản phẩm đơn
								</span>
							</label>
							<label className='flex items-center cursor-pointer group'>
								<input
									type='radio'
									id='productType'
									name='productType'
									value='MULTIPLE'
									checked={productType === 'MULTIPLE'}
									onChange={() => setProductType('MULTIPLE')}
									className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2'
								/>
								<span className='ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900'>
									Sản phẩm có biến thể
								</span>
							</label>
						</div>
					</div>
					<div>
						<CustomInput
							id='title'
							name='title'
							value={formik.values.title}
							type='text'
							label='Tiêu đề sản phẩm'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							maxLength={200}
							isRequired={true}
						/>
						{formik.touched.title && formik.errors.title && (
							<div className='flex gap-1 items-center mt-3 text-red-500 bg-red-50 px-4 py-2 rounded-xl border border-red-200 w-fit'>
								<RiErrorWarningFill />
								<p className='text-sm font-semibold'>
									{formik.errors.title}
								</p>
							</div>
						)}
					</div>
					<div className='mt-6'>
						<ProductDescription
							description={formik.values.description}
							onBlur={formik.handleBlur('description')}
							setDescription={(val) =>
								formik.setFieldValue('description', val)
							}
						/>
					</div>
					{formik.touched.description &&
						formik.errors.description && (
							<div className='flex items-center mt-3 text-red-500 bg-red-50 px-4 py-2 rounded-xl border border-red-200 w-fit'>
								<RiErrorWarningFill />
								<p className='text-sm font-semibold'>
									{formik.errors.description}
								</p>
							</div>
						)}
					{/* Các trường thông tin tổng quan khác giữ nguyên, chỉ chuyển vào section này */}
					<div className='flex flex-col gap-6 mt-6'>
						<ConditionSelector
							value={formik.values.condition}
							onChange={(val) =>
								formik.setFieldValue('condition', val)
							}
							error={
								formik.touched.condition &&
								formik.errors.condition
							}
							options={CONDITION_OPTIONS}
						/>
						<div>
							<CustomInput
								type='select'
								id='brandId'
								name='brandId'
								placeholder='Thương hiệu'
								value={formik.values.brandId}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur('brandId')}
								options={brands.map((brand) => ({
									value: brand._id,
									label: brand.name,
								}))}
								label='Thương hiệu'
								isRequired={true}
							/>
							{formik.touched.brandId &&
								formik.errors.brandId && (
									<div className='flex gap-1 items-center mt-3 text-red-500 bg-red-50 px-4 py-2 rounded-xl border border-red-200 w-fit'>
										<RiErrorWarningFill />
										<p className='text-sm font-semibold'>
											{formik.errors.brandId}
										</p>
									</div>
								)}
						</div>
						<div>
							<CustomInput
								id='color'
								name='color'
								value={formik.values.color}
								type='select'
								label='Màu sắc'
								placeholder='Màu sắc'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur('color')}
								options={COLOR_OPTIONS}
								isRequired={true}
							/>
							{formik.touched.color && formik.errors.color && (
								<div className='flex gap-1 items-center mt-3 text-red-500 bg-red-50 px-4 py-2 rounded-xl border border-red-200 w-fit'>
									<RiErrorWarningFill />
									<p className='text-sm font-semibold'>
										{formik.errors.color}
									</p>
								</div>
							)}
						</div>
						{dynamicFields.map((field) => (
							<div key={field.id}>
								<CustomInput
									key={field.id}
									id={field.id}
									name={field.name}
									value={formik.values[field.name]}
									onChange={formik.handleChange}
									label={field.label}
									type={field.type}
									required={field.required}
									placeholder={field.placeholder}
									options={field.options}
									onBlur={formik.handleBlur(field.name)}
								/>
								{formik.touched[field.name] &&
									formik.errors[field.name] && (
										<div className='flex gap-1 items-center mt-3 text-red-500 bg-red-50 px-4 py-2 rounded-xl border border-red-200 w-fit'>
											<RiErrorWarningFill />
											<p className='text-sm font-semibold'>
												{formik.errors[field.name]}
											</p>
										</div>
									)}
							</div>
						))}
						{categoryName !== 'Quần áo nam' && (
							<>
								<div>
									<CustomInput
										id='warranty'
										name='warranty'
										value={formik.values.warranty}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur('warranty')}
										type='select'
										label='Chính sách bảo hành'
										placeholder='Chính sách bảo hành'
										options={WARRANTY_OPTIONS}
										isRequired={true}
									/>
									{formik.touched.warranty &&
										formik.errors.warranty && (
											<div className='flex gap-1 items-center mt-3 text-red-500 bg-red-50 px-4 py-2 rounded-xl border border-red-200 w-fit'>
												<RiErrorWarningFill />
												<p className='text-sm font-semibold'>
													{formik.errors.warranty}
												</p>
											</div>
										)}
								</div>
							</>
						)}

						<div>
							<CustomInput
								id='origin'
								name='origin'
								value={formik.values.origin}
								type='select'
								label='Xuất xứ'
								placeholder='Xuất xứ'
								options={ORIGIN_OPTIONS}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur('origin')}
								isRequired={true}
							/>
							{formik.touched.origin && formik.errors.origin && (
								<div className='flex gap-1 items-center mt-3 text-red-500 bg-red-50 px-4 py-2 rounded-xl border border-red-200 w-fit'>
									<RiErrorWarningFill />
									<p className='text-sm font-semibold'>
										{formik.errors.origin}
									</p>
								</div>
							)}
						</div>
						<div>
							<CustomInput
								type='text'
								id='price'
								name='price'
								label='Giá bán'
								placeholder='Giá bán'
								className='bg-white'
								isRequired={true}
								value={priceInput}
								onChange={handlePriceChange}
								onBlur={formik.handleBlur}
								autoComplete='off'
							/>
							{formik.touched.price && formik.errors.price && (
								<div className='flex gap-1 items-center mt-3 text-red-500 bg-red-50 px-4 py-2 rounded-xl border border-red-200 w-fit'>
									<RiErrorWarningFill />
									<p className='text-sm font-semibold'>
										{formik.errors.price}
									</p>
								</div>
							)}
						</div>
						{/* Thêm input số lượng */}
						<div className='mt-2 text-textPrimary'>
							<label className='block mb-2 text-sm font-medium text-gray-700'>
								Số lượng <span className='text-red-500'>*</span>
							</label>
							<div className='flex items-center gap-2'>
								<button
									type='button'
									className='w-10 h-10 border border-gray-300 rounded flex items-center justify-center text-xl disabled:opacity-50'
									onClick={() =>
										formik.setFieldValue(
											'stock',
											Math.max(
												1,
												formik.values.stock - 1,
											),
										)
									}
									disabled={formik.values.stock <= 1}>
									-
								</button>
								<input
									type='number'
									id='stock'
									name='stock'
									min={1}
									className='w-12 h-10 border border-gray-300 rounded pl-3 text-center focus:ring-2 focus:ring-blue-500 outline-none text-textPrimary'
									value={formik.values.stock}
									onChange={(e) => {
										const val = Math.max(
											1,
											Number(e.target.value),
										);
										formik.setFieldValue('stock', val);
									}}
								/>
								<button
									type='button'
									className='w-10 h-10 border border-gray-300 rounded flex items-center justify-center text-xl'
									onClick={() =>
										formik.setFieldValue(
											'stock',
											formik.values.stock + 1,
										)
									}>
									+
								</button>
							</div>
							{formik.touched.stock && formik.errors.stock && (
								<div className='text-red-500 text-sm'>
									{formik.errors.stock}
								</div>
							)}
						</div>
						{/* Hiển thị phí và số tiền nhận được */}
						{priceNumber > 0 && (
							<div className='mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200'>
								<div className='space-y-3 text-sm text-gray-600'>
									<div className='flex items-center justify-between'>
										<span>Phí dịch vụ (7.9%)</span>
										<span className='font-medium'>
											- {formatPriceVND(serviceFee)}
										</span>
									</div>
									<div className='flex items-center justify-between'>
										<span>Phí thanh toán (2%)</span>
										<span className='font-medium'>
											- {formatPriceVND(paymentFee)}
										</span>
									</div>
								</div>
								<div className='border-t border-gray-300 mt-4 pt-4 flex items-center justify-between'>
									<span className='font-semibold text-gray-800'>
										Bạn nhận được
									</span>
									<span className='text-green-600 text-xl font-bold'>
										{formatPriceVND(netAmount)}
									</span>
								</div>
							</div>
						)}
					</div>
				</section>

				{/* Biến thể (nếu có) */}
				{productType === 'MULTIPLE' && (
					<section className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
						<h2 className='font-bold text-xl mb-6 text-gray-800'>
							Biến thể sản phẩm
						</h2>
						<VariantSelector
							options={variantOptions}
							variants={variants}
							onOptionsChange={handleOptionsChange}
							onVariantsChange={handleVariantsChange}
							basePrice={formik.values.price}
						/>
					</section>
				)}
				{/* Ảnh sản phẩm */}
				<section className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 '>
					<h2 className='font-bold text-xl mb-6 text-gray-800'>
						Ảnh sản phẩm <span className='text-red-500'>*</span>
					</h2>
					<ImageDropzone
						label='Tải ảnh lên'
						value={formik.values.images}
						onChange={(files) =>
							formik.setFieldValue('images', files)
						}
						error={formik.touched.images && formik.errors.images}
						maxFiles={6}
						minFiles={1}
					/>
					<div className='text-xs text-gray-500 mt-3'>
						Đăng từ 1-6 ảnh, tối đa 2MB/ảnh.{' '}
						<a
							href='#'
							className='text-blue-500 underline hover:text-blue-600'>
							Quy định đăng tin
						</a>
					</div>
				</section>
				{/* Địa chỉ cho thể cho chọn từ địa chỉ có sẵn*/}
				<section className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
					<h2 className='font-bold text-xl mb-6 text-gray-800'>
						Thông tin địa chỉ
					</h2>
					<div>
						<label className='block mb-2 text-sm font-medium text-gray-700'>
							Địa chỉ người bán
							<span className='text-red-500'>*</span>
						</label>
						<button
							type='button'
							className='w-full border border-gray-300 px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 text-left rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							onClick={openAddressModal}>
							<span className='text-gray-700'>
								{selectedAddress
									? `${
											selectedAddress.detail
												? selectedAddress.detail + ', '
												: ''
									  }${
											selectedAddress.wardName
												? selectedAddress.wardName +
												  ', '
												: ''
									  }${
											selectedAddress.provinceName
												? selectedAddress.provinceName +
												  ', '
												: ''
									  }`.replace(/, $/, '')
									: 'Chọn địa chỉ'}
							</span>
							<FaCaretDown className='ml-2 text-gray-400' />
						</button>
					</div>
				</section>
				{/* Nút submit */}
				<div className='flex gap-4 pt-6 border-t border-gray-200'>
					{/* <Button
						type='button'
						className='flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium'>
						Xem trước
					</Button>
					<Button
						type='button'
						className='flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium'>
						Lưu nháp
					</Button> */}
					<Button
						type='submit'
						className={`w-fit mx-auto px-6 py-3 rounded-lg font-medium transition-colors ${
							isFormValid
								? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
								: 'bg-gray-300 text-gray-500 cursor-not-allowed'
						}`}
						disabled={localLoading || !isFormValid}>
						{localLoading ? (
							<div className='flex items-center justify-center gap-2'>
								<LoadingThreeDot />
								<span>Đang đăng sản phẩm...</span>
							</div>
						) : (
							'Đăng sản phẩm'
						)}
					</Button>
				</div>
			</form>
		</div>
	);
};

ProductCreateForm.propTypes = {
	selectedCategory: PropTypes.object,
	setSelectedCategory: PropTypes.func,
	openCategoryModal: PropTypes.func,
	selectedAddress: PropTypes.object,
	openAddressModal: PropTypes.func,
};

export default ProductCreateForm;
