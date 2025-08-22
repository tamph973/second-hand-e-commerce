import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUrlSearchParam } from '@/utils/helpers';
import PropTypes from 'prop-types';

export default function SearchBar() {
	const [search, setSearch] = useState('');
	const navigate = useNavigate();
	const location = useLocation();

	// Lấy từ khóa từ URL khi component mount hoặc URL thay đổi
	useEffect(() => {
		const urlSearchTerm = getUrlSearchParam('q');
		if (urlSearchTerm) {
			setSearch(urlSearchTerm);
		} else {
			setSearch('');
		}
	}, [location.search]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (search.trim()) {
			navigate(`/search?q=${encodeURIComponent(search.trim())}`);
		}
	};

	return (
		<form className='flex flex-1' onSubmit={handleSubmit}>
			<div className='flex-1 flex border border-gray-200 rounded-lg focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500'>
				<input
					type='search'
					value={search}
					placeholder='Tìm kiếm sản phẩm trên EcoC'
					className='flex-1 px-4 py-2 rounded-l-lg border-0 focus:outline-none text-gray-700'
					aria-label='Tìm kiếm sản phẩm'
					onChange={(e) => setSearch(e.target.value)}
				/>
				<button
					type='submit'
					className='bg-blue-500 px-4 flex items-center justify-center rounded-r-lg'
					aria-label='Tìm kiếm'>
					<FaSearch className='text-white' />
				</button>
			</div>
		</form>
	);
}

SearchBar.propTypes = {
	initialValue: PropTypes.string,
	onSearchChange: PropTypes.func,
};
