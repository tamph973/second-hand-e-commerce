import React, { useState } from 'react';
import {
	FaGift,
	FaPlus,
	FaEdit,
	FaTrash,
	FaEye,
	FaInfoCircle,
} from 'react-icons/fa';
import CustomInput from '@/components/form/CustomInput';
import Table from '@/components/common/Table';
import { discountCreateFields } from '@/constants/formFields';
import discountIcon from '@/assets/icons/discount.png';
import { useFormik } from 'formik';
import Button from '@/components/common/Button';
import { formatPriceVND, generateDiscountCode } from '@/utils/helpers';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAppMutation } from '@/hooks/useAppMutation';
import { toast } from 'react-toastify';
import DiscountService from '@/services/discount.service';
import LoadingThreeDot from '@/components/common/LoadingThreeDot';
import useAppQuery from '@/hooks/useAppQuery';
import UserService from '@/services/user.service';

const Discount = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [localLoading, setLocalLoading] = useState(false);

	const { mutateAsync: addDiscount } = useAppMutation({
		mutationFn: (values) => DiscountService.createDiscount(values),
		onSuccess: (res) => {
			toast.success(res?.data?.message || 'Thêm mã giảm giá thành công!');
			queryClient.invalidateQueries(['discounts']);
			formik.resetForm();
			window.location.reload();
		},
		onError: (err) => {
			toast.error(err || 'Thêm danh mục thất bại!');
		},
		onSettled: () => {
			setLocalLoading(false);
		},
	});

	const { data: discounts } = useAppQuery(
		['discounts'],
		() => DiscountService.getAllDiscounts(),
		{
			select: (res) => res.data,
			refetchOnWindowFocus: false,
			staleTime: 1000 * 60 * 5,
			gcTime: 1000 * 60 * 5,
		},
	);

	const { data: users } = useAppQuery(
		['users'],
		() => UserService.getAllUser(),
		{
			select: (res) => res.data.users,
			refetchOnWindowFocus: false,
			staleTime: 1000 * 60 * 5,
			gcTime: 1000 * 60 * 5,
		},
	);

	const formik = useFormik({
		initialValues: {
			couponType: '',
			title: '',
			code: '',
			discountType: '',
			amount: '',
			minimumPurchase: '',
			maximumDiscount: '',
			limitUsage: '',
			discountScope: 'PUBLIC',
			userId: '',
			startDate: '',
			endDate: '',
		},
		// validationSchema:
		onSubmit: async (values) => {
			setLocalLoading(true);
			await addDiscount(values);
		},
	});

	const isFormValid = formik.isValid && formik.dirty && !localLoading;

	const getStatusBadge = (status) => {
		const statusConfig = {
			ACTIVE: {
				text: 'Hoạt động',
				className: 'bg-green-100 text-green-800',
			},
			INACTIVE: {
				text: 'Không hoạt động',
				className: 'bg-gray-100 text-gray-800',
			},
			EXPIRED: { text: 'Hết hạn', className: 'bg-red-100 text-red-800' },
		};
		const config = statusConfig[status] || statusConfig.INACTIVE;
		return (
			<span
				className={`px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>
				{config.text}
			</span>
		);
	};

	const getTypeBadge = (type) => {
		const typeConfig = {
			PERCENT: {
				text: 'Phần trăm',
				className: 'bg-blue-100 text-blue-800',
			},
			FIXED: {
				text: 'Cố định',
				className: 'bg-purple-100 text-purple-800',
			},
		};
		const config = typeConfig[type] || typeConfig.PERCENT;
		return (
			<span
				className={`px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>
				{config.text}
			</span>
		);
	};

	const getCouponTypeBadge = (type) => {
		const typeConfig = {
			DISCOUNT_ON_PURCHASE: {
				text: 'Giảm giá trên đơn hàng',
				className: 'bg-blue-100 text-blue-800',
			},
			DISCOUNT_ON_SHIPPING: {
				text: 'Giảm giá vận chuyển',
				className: 'bg-green-100 text-green-800',
			},
		};
		const config = typeConfig[type] || typeConfig.PERCENT;
		return (
			<span
				className={`px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>
				{config.text}
			</span>
		);
	};

	const getScopeBadge = (scope) => {
		const scopeConfig = {
			PUBLIC: {
				text: 'Công khai',
				className: 'bg-green-100 text-green-800',
			},
			PRIVATE: {
				text: 'Riêng tư',
				className: 'bg-orange-100 text-orange-800',
			},
		};
		const config = scopeConfig[scope] || scopeConfig.PUBLIC;
		return (
			<span
				className={`px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>
				{config.text}
			</span>
		);
	};

	const tableHeaders = [
		{ label: 'STT', key: 'index' },
		{ label: 'Mã giảm giá', key: 'code' },
		{ label: 'Tên', key: 'title' },
		{ label: 'Loại phiếu giảm giá', key: 'couponType' },
		{ label: 'Loại', key: 'type' },
		{ label: 'Giá trị', key: 'amount' },
		{ label: 'Tối thiểu', key: 'minimumPurchase' },
		{ label: 'Phạm vi', key: 'discountScope' },
		{ label: 'Giới hạn', key: 'limitUsage' },
		{ label: 'Trạng thái', key: 'status' },
		{ label: 'Thao tác', key: 'actions' },
	];

	const renderTableRow = (item, index) => (
		<tr key={item._id} className='hover:bg-gray-50 transition-colors'>
			<td className='px-6 py-4 whitespace-nowrap text-textPrimary'>
				{index + 1}
			</td>
			<td className='px-6 py-4 whitespace-nowrap'>
				<div className='flex items-center'>
					<div className='text-sm font-medium text-gray-900'>
						{item.code}
					</div>
				</div>
			</td>

			<td className='px-6 py-4 whitespace-nowrap'>
				<div className='text-sm text-gray-900'>{item.title}</div>
			</td>
			<td className='px-6 py-4 whitespace-nowrap'>
				{getCouponTypeBadge(item.couponType)}
			</td>
			<td className='px-6 py-4 whitespace-nowrap'>
				{getTypeBadge(item.discountType)}
			</td>
			<td className='px-6 py-4 whitespace-nowrap'>
				<div className='text-sm text-gray-900'>
					{item.discountType === 'PERCENT'
						? `${item.amount}%`
						: `${formatPriceVND(item.amount)}`}
				</div>
			</td>
			<td className='px-6 py-4 whitespace-nowrap'>
				<div className='text-sm text-gray-900'>
					{item.minimumPurchase
						? `${formatPriceVND(item.minimumPurchase)}`
						: 'Không có'}
				</div>
			</td>
			<td className='px-6 py-4 whitespace-nowrap'>
				{getScopeBadge(item.discountScope)}
			</td>
			<td className='px-6 py-4 whitespace-nowrap'>
				<div className='text-sm text-gray-900'>{item.limitUsage}</div>
			</td>
			<td className='px-6 py-4 whitespace-nowrap'>
				{getStatusBadge(item.status)}
			</td>
			<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
				<div className='flex space-x-2'>
					<button className='text-blue-600 hover:text-blue-900 transition-colors'>
						<FaEye className='w-4 h-4' />
					</button>
					<button className='text-green-600 hover:text-green-900 transition-colors'>
						<FaEdit className='w-4 h-4' />
					</button>
					<button className='text-red-600 hover:text-red-900 transition-colors'>
						<FaTrash className='w-4 h-4' />
					</button>
				</div>
			</td>
		</tr>
	);

	return (
		<div className='min-h-screen'>
			<div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{/* Header Section */}
				<div className='mb-8'>
					<div className='flex items-center space-x-3 mb-4'>
						<div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center'>
							<img
								src={discountIcon}
								alt='discount'
								className='w-8 h-8'
							/>
						</div>
						<div>
							<h1 className='text-3xl font-bold text-gray-900'>
								Tạo/Thiết lập mã giảm giá
							</h1>
							<p className='text-gray-600 mt-1'>
								Quản lý và tạo các mã giảm giá cho khách hàng
							</p>
						</div>
					</div>
				</div>

				<div className='space-y-8'>
					{/* Section 1: Form tạo mã giảm giá */}
					<div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
						<div className='flex items-center space-x-2 mb-6'>
							<FaPlus className='w-5 h-5 text-blue-600' />
							<h2 className='text-xl font-semibold text-gray-900'>
								Tạo mã giảm giá mới
							</h2>
						</div>

						<form onSubmit={formik.handleSubmit} className=''>
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
								{discountCreateFields.map((field) => {
									// Chỉ hiển thị userId khi discountScope là PRIVATE
									if (
										field.id === 'userId' &&
										formik.values.discountScope !==
											'PRIVATE'
									) {
										return null;
									}

									// <CustomInput
									// 	type='select'
									// 	id='brandId'
									// 	name='brandId'
									// 	placeholder='Thương hiệu'
									// 	value={formik.values.brandId}
									// 	onChange={formik.handleChange}
									// 	options={brands.map((brand) => ({
									// 		value: brand._id,
									// 		label: brand.name,
									// 	}))}
									// 	label='Thương hiệu'
									// 	isRequired={true}
									// />;

									return (
										<div
											key={field.id}
											className='space-y-2 relative'>
											<label className='block text-sm font-medium text-gray-700'>
												{field.label}
											</label>

											{field.id === 'code' && (
												// Tạo mã giảm giá tự động
												<button
													type='button'
													className='absolute -top-3 right-0 text-blue-500 mr-2 text-sm'
													onClick={() => {
														formik.setFieldValue(
															'code',
															generateDiscountCode(),
														);
													}}>
													Tạo mã giảm giá
												</button>
											)}
											{field.id === 'userId' ? (
												<CustomInput
													type='select'
													id={field.id}
													name={field.name}
													placeholder={
														field.placeholder
													}
													options={
														users?.map((user) => ({
															value: user.id,
															label: user.fullName,
														})) || []
													}
													value={
														formik.values[
															field.name
														] || ''
													}
													onChange={
														formik.handleChange
													}
													onBlur={formik.handleBlur}
												/>
											) : (
												<CustomInput
													type={field.type}
													id={field.id}
													name={field.name}
													placeholder={
														field.placeholder
													}
													options={field.options}
													value={
														formik.values[
															field.name
														] || ''
													}
													onChange={
														formik.handleChange
													}
													onBlur={formik.handleBlur}
												/>
											)}
											{field.helper && (
												<p className='text-xs text-gray-500'>
													{field.helper}
												</p>
											)}
											{formik.errors[field.name] && (
												<p className='text-red-500 text-xs'>
													{formik.errors[field.name]}
												</p>
											)}
										</div>
									);
								})}
							</div>
							<div className='flex gap-2 justify-end mt-6'>
								<Button
									type='reset'
									className='bg-gray-500 text-white mr-2'
									onClick={() => formik.resetForm()}>
									Đặt lại
								</Button>
								<Button
									type='submit'
									className={`text-base font-medium text-white rounded-[99px] transition-all duration-200 ${
										isFormValid
											? 'bg-primary hover:bg-primary/80 active:bg-primary/90 shadow-md hover:shadow-lg transform hover:scale-[1.02]'
											: 'bg-gray-400 cursor-not-allowed'
									}`}
									disabled={!isFormValid || localLoading}>
									{localLoading ? (
										<div className='flex items-center justify-center gap-2'>
											<LoadingThreeDot />
											<span>Đang tạo...</span>
										</div>
									) : (
										'Tạo mã giảm giá'
									)}
								</Button>
							</div>
						</form>
					</div>

					{/* Section 2: Bảng danh sách mã giảm giá */}
					<div className='bg-white rounded-xl shadow-sm border border-gray-200'>
						<div className='px-6 py-4 border-b border-gray-200'>
							<div className='relative flex items-center justify-between'>
								<h3 className='text-lg font-semibold text-gray-900'>
									Danh sách mã giảm giá
								</h3>
								<div className='flex items-center space-x-2'>
									<span className='text-sm w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center absolute top-1 left-[210px]'>
										{discounts?.discounts.length}
									</span>
								</div>
							</div>
						</div>

						<div className='overflow-x-auto'>
							<Table
								className='w-full max-w-5xl'
								headers={tableHeaders}
								data={discounts?.discounts}
								renderRow={renderTableRow}
								emptyText='Chưa có mã giảm giá nào'
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Discount;
