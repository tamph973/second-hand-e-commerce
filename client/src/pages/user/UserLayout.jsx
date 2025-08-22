import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import UserProfile from './UserProfile';
import UserAddress from './UserAddress';
import UserSetting from './UserSetting';
import UserWallet from './UserWallet';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getUserData } from '@/store/user/userSlice';
import UserOrder from './UserOrder';
import UserOrderDetail from './UserOrderDetail';
import UserDiscounts from './UserDiscounts';

const UserLayout = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getUserData());
	}, [dispatch]);

	return (
		<div>
			<Routes>
				<Route path='/' element={<Layout />}>
					<Route index element={<UserProfile />} />
					<Route path='profile' element={<UserProfile />} />
					<Route path='settings' element={<UserSetting />} />
					<Route path='purchases' element={<UserOrder />} />
					<Route path='purchases/:orderId' element={<UserOrderDetail />} />
					{/* <Route path='messages' element={<Messages />} /> */}
					<Route path='address' element={<UserAddress />} />
					<Route path='wallet' element={<UserWallet />} />
					<Route path='discounts' element={<UserDiscounts />} />
				</Route>
			</Routes>
		</div>
	);
};

export default UserLayout;
