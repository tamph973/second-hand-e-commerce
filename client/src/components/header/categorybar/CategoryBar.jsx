import React, { useState, useCallback } from 'react';
import useAppQuery from '@/hooks/useAppQuery';
import CategoryService from '@/services/category.service';
import { Link } from 'react-router-dom';

export default function CategoryBar() {
	const [hoveredCategory, setHoveredCategory] = useState(null);

	const { data: categoryTree = [] } = useAppQuery(
		['categories', 'tree'],
		() => CategoryService.getCategoryTree(),
		{ select: (res) => res.data, refetchOnWindowFocus: false },
	);

	// Hàm xử lý hover để tránh re-render không cần thiết
	const handleMouseEnter = useCallback((id) => setHoveredCategory(id), []);
	const handleMouseLeave = useCallback(() => setHoveredCategory(null), []);

	return (
		<div className='container mx-auto flex items-center gap-6 px-4 py-3 bg-white border-t shadow-sm'>
			{categoryTree.map((cat) => (
				<Link
					to={`/${cat.slug}`}
					state={{
						parentId: cat._id,
					}}
					key={cat._id}
					className='relative group'
					onMouseEnter={() => handleMouseEnter(cat._id)}
					onMouseLeave={handleMouseLeave}>
					<div className='text-gray-700 text-sm font-medium cursor-pointer hover:text-primary flex items-center px-2 py-1 transition-colors duration-200'>
						{cat.name}
					</div>
					{hoveredCategory === cat._id && cat.children.length > 0 && (
						<div className='absolute left-0 w-48 bg-white border rounded-lg shadow-lg z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out transform group-hover:translate-y-0 -translate-y-2 p-1'>
							{/* Thêm vùng đệm để dễ di chuột */}
							<div className='relative'>
								{cat.children.map((sub) => (
									<Link
										key={sub._id}
										to={`/${sub.slug}`}
										className='block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors duration-200 rounded'>
										{sub.name}
									</Link>
								))}
							</div>
						</div>
					)}
				</Link>
			))}
		</div>
	);
}
