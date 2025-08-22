/* eslint-disable react/prop-types */
import useAppQuery from '@/hooks/useAppQuery';
import CategoryService from '@/services/category.service';
import { setUrlSearchParam } from '@/utils/helpers';
const ShopCategory = ({ shopId, category, setCategory }) => {
	const { data: shopCategories } = useAppQuery(
		['shop-categories', shopId],
		() => CategoryService.getCategoryByShop(shopId),
		{
			select: (res) => res.data,
			enabled: !!shopId,
		},
	);

	const handleClickCategory = (id) => {
		setUrlSearchParam('category_id', id);
		setCategory(id);
	};

	return (
		<>
			<section className='bg-white rounded-xl p-6 shadow border border-gray-100 mb-4 flex flex-col md:flex-row md:items-center gap-6 text-textPrimary'>
				{/* Tất cả sản phẩm */}
				<span
					onClick={() => handleClickCategory('ALL')}
					className={` ${
						category === 'ALL'
							? 'border-blue-500 text-blue-500'
							: ''
					} shrink-0 border-b-2 cursor-pointer hover:border-blue-500 hover:text-blue-500 px-1 pb-4 text-sm font-medium `}>
					Tất cả sản phẩm
				</span>
				{/* Danh mục cha */}
				<div className='flex items-center gap-6 min-w-[250px] -mb-px'>
					{shopCategories
						?.filter(
							(item, index, self) =>
								index ===
								self.findIndex(
									(t) =>
										t.parentCategoryName ===
										item.parentCategoryName,
								),
						) // Lọc trùng lặp
						.map((item) => (
							<span
								key={item.parentId}
								onClick={() =>
									handleClickCategory(item.parentId)
								}
								className={` ${
									item.parentId === category
										? 'border-blue-500 text-blue-500'
										: ''
								} shrink-0 border-b-2 cursor-pointer hover:border-blue-500 hover:text-blue-500 px-1 pb-4 text-sm font-medium `}>
								{item.parentCategoryName}
							</span>
						))}
				</div>
			</section>
		</>
	);
};

export default ShopCategory;
