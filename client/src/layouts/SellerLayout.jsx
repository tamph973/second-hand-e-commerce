import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import SellerSidebar from '@/seller/components/SellerSidebar';
import SellerHeader from '@/seller/components/SellerHeader';
import { useDispatch } from 'react-redux';
import { getUserData } from '@/store/user/userSlice';
import { getSellerOrders } from '@/store/order/orderSlice';

export default function SellerLayout() {
	const dispatch = useDispatch();
	const [isSidebarOpen, setSidebarOpen] = useState(false);

	const toggleSidebar = () => {
		setSidebarOpen(!isSidebarOpen);
	};

	useEffect(() => {
		dispatch(getUserData());
		dispatch(getSellerOrders());
	}, [dispatch]);

	return (
		<div className='flex h-screen bg-gray-50'>
			<SellerSidebar
				isSidebarOpen={isSidebarOpen}
				toggleSidebar={toggleSidebar}
			/>
			<div className='flex-1 flex flex-col'>
				<SellerHeader toggleSidebar={toggleSidebar} />
				<main className='p-6 flex-1 overflow-y-auto'>
					<Outlet />
				</main>
			</div>
		</div>
	);
}
