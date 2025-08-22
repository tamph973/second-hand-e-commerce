import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getAccessToken } from '@/utils/localStorageUtils';
import { isAdmin as checkAdminRole, isSeller as checkSellerRole } from '@/utils/jwt';

export const PrivateRoute = ({ isAdmin, isSeller }) => {
	const token = getAccessToken();

	if (isAdmin && !checkAdminRole(token)) {
		return <Navigate to='/auth/admin/login' replace />;
	}

	// if (isSeller && !checkSellerRole(token)) {
	// 	return <Navigate to='/auth/login' replace />;
	// }

	return <Outlet />;
};

PrivateRoute.propTypes = {
	isAdmin: PropTypes.bool,
	isSeller: PropTypes.bool,
};
