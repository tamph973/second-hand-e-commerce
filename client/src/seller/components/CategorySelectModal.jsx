import { useState, useEffect, useMemo, Fragment } from 'react';
import Button from '@/components/common/Button';
import PropTypes from 'prop-types';
import useAppQuery from '@/hooks/useAppQuery';
import CategoryService from '@/services/category.service';
import Modal from '@/components/modal/Modal';
import { FaChevronRight } from 'react-icons/fa';

const CategorySelectModal = ({ isOpen, onClose, onSelect }) => {
	const [categoryPath, setCategoryPath] = useState([]); // [{_id, name, children}]
	const [cateData, setCateData] = useState([]);

	// Query cây danh mục với cache và debounce
	const { data: categories = [], isLoading } = useAppQuery(
		['categories', 'tree'],
		() => CategoryService.getCategoryTree(),
		{
			select: (res) => res.data,
			enabled: isOpen,
			staleTime: 5 * 60 * 1000, // Cache trong 5 phút
			cacheTime: 10 * 60 * 1000, // Giữ cache trong 10 phút
		},
	);

	// Lấy danh mục gốc khi mở modal hoặc khi categories thay đổi
	useEffect(() => {
		if (isOpen) {
			setCateData(categories);
			setCategoryPath([]);
		}
	}, [isOpen, categories]);

	const handleSelect = (cat) => {
		const newPath = [...categoryPath, cat];
		if (cat.children && cat.children.length > 0) {
			setCategoryPath(newPath);
			setCateData(cat.children);
		} else {
			if (onSelect) onSelect(cat);
			onClose();
		}
	};

	const handleBack = () => {
		const newPath = categoryPath.slice(0, -1);
		setCategoryPath(newPath);
		if (newPath.length === 0) {
			setCateData(categories);
		} else {
			setCateData(newPath[newPath.length - 1].children || []);
		}
	};

	// Memoize cateData để tránh re-render không cần thiết
	const memoizedCateData = useMemo(() => cateData, [cateData]);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='Chọn danh mục'
			size='xl'
			variant='form'
			showCloseButton={true}
			closeOnOverlayClick={false}>
			{categoryPath.length > 0 && (
				<div className='mb-4 flex items-center gap-2 text-sm text-gray-600'>
					<span
						className='cursor-pointer hover:underline'
						title='Quay về danh mục gốc'
						onClick={() => {
							setCategoryPath([]);
							setCateData(categories);
						}}>
						Danh mục gốc
					</span>
					{categoryPath.map((cat, idx) => (
						<Fragment key={cat._id}>
							<FaChevronRight className='text-gray-400' />
							<span
								className='cursor-pointer hover:underline'
								title={`Chứa ${
									cat.children?.length || 0
								} danh mục con`}
								onClick={() => {
									const newPath = categoryPath.slice(
										0,
										idx + 1,
									);
									setCategoryPath(newPath);
									setCateData(cat.children || categories);
								}}>
								{cat.name}
							</span>
						</Fragment>
					))}
				</div>
			)}
			<div className='flex justify-between mb-4'>
				{categoryPath.length > 0 && (
					<Button
						onClick={handleBack}
						className='px-3 py-1 text-sm bg-primary hover:bg-primary/80 rounded'>
						Quay lại
					</Button>
				)}
			</div>
			{isLoading ? (
				<div className='space-y-2'>
					{[...Array(5)].map((_, idx) => (
						<div
							key={idx}
							className='h-10 bg-gray-200 animate-pulse rounded-lg'
						/>
					))}
				</div>
			) : (
				<ul className='border rounded-lg overflow-hidden max-h-[400px] overflow-y-auto'>
					{memoizedCateData.map((cat, idx) => (
						<li
							key={cat._id}
							className={`flex items-center gap-3 py-3 px-4 cursor-pointer hover:bg-gray-50 transition ${
								idx !== memoizedCateData.length - 1
									? 'border-b border-gray-200'
									: ''
							}`}
							onClick={() => handleSelect(cat)}>
							{cat.image && (
								<img
									src={cat.image.url}
									alt={cat.name}
									className='w-7 h-7 object-contain'
								/>
							)}
							<span className='text-base text-textPrimary flex-1'>
								{cat.name}
							</span>
							{cat.children && cat.children.length > 0 && (
								<FaChevronRight className='text-gray-400 text-lg' />
							)}
						</li>
					))}
				</ul>
			)}
		</Modal>
	);
};

CategorySelectModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onSelect: PropTypes.func,
};

export default CategorySelectModal;
