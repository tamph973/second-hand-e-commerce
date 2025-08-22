import React, { useState } from 'react';
import {
	FaGlobe,
	FaShieldAlt,
	FaChevronDown,
	FaQuestionCircle,
} from 'react-icons/fa';
import vietnameFlag from '@/assets/icons/icon-vietnam.png';
import unitedStatesFlag from '@/assets/icons/icon-united-states.png';

export default function Topbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedLanguage, setSelectedLanguage] = useState('VN');

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const handleLanguageClick = (language) => {
		setSelectedLanguage(language);
		setIsOpen(false);
	};
	return (
		<div className='text-[15px] flex items-center justify-between px-4 py-1 container mx-auto'>
			<div className='flex items-center gap-4'>
				<span className='flex items-center gap-1 text-green-700'>
					<FaGlobe /> 2EcoC - Mua bán đồ cũ thông minh, kiểm duyệt an
					toàn, vì một hành tinh xanh.
				</span>
				<span className='flex items-center gap-1 text-green-700'>
					<FaShieldAlt /> Cam kết hoàn tiền 100% nếu sản phẩm không
					đúng mô tả!
				</span>
			</div>
			<div className='flex items-center gap-4 text-green-700'>
				{/* Dropdown language */}

				<div className='relative'>
					<div
						className='flex items-center gap-1 cursor-pointer'
						onClick={toggleDropdown}>
						<img
							src={
								selectedLanguage === 'VN'
									? vietnameFlag
									: unitedStatesFlag
							}
							alt='VN'
							className='w-5 h-5 rounded-sm'
						/>
						<span>{selectedLanguage}</span>
						<FaChevronDown className='text-xs' />
					</div>
					<div
						className={`absolute top-full right-2 w-full bg-white shadow-md rounded-md z-[100] ${
							isOpen ? 'block' : 'hidden'
						}`}>
						<div className='p-2'>
							<div
								className='flex items-center gap-2 cursor-pointer'
								onClick={() => handleLanguageClick('VN')}>
								<img
									src={vietnameFlag}
									alt='VN'
									className='w-5 h-5 rounded-sm'
								/>
								<span>VN</span>
							</div>
						</div>
						<div className='p-2'>
							<div
								className='flex items-center gap-2 cursor-pointer'
								onClick={() => handleLanguageClick('US')}>
								<img
									src={unitedStatesFlag}
									alt='US'
									className='w-5 h-5 rounded-sm'
								/>
								<span>US</span>
							</div>
						</div>
					</div>
				</div>

				<div className='flex items-center gap-1 cursor-pointer'>
					<FaQuestionCircle />
					<span>Hỗ trợ</span>
				</div>
			</div>
		</div>
	);
}
