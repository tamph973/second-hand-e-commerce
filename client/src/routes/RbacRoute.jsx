import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getAccessToken } from '@/utils/localStorageUtils';
import {
	isAdmin as checkAdminRole,
	isSeller as checkSellerRole,
	getRoleFromToken,
} from '@/utils/jwt';
import { usePermission } from '@/hooks/usePermission';

export const RbacRoute = ({ requiredPermissions, redirectTo = '/' }) => {
	const token = getAccessToken();
	const userRole = getRoleFromToken(token) || 'USER';
	const { hasPermissions } = usePermission(userRole);

	// Nếu không có quyền, chuyển hướng đến trang redirectTo
	if (!hasPermissions(requiredPermissions)) {
		return <Navigate to={redirectTo} replace={true} />;
	}

	return <Outlet />;
};

RbacRoute.propTypes = {
	requiredPermissions: PropTypes.array.isRequired,
	redirectTo: PropTypes.string,
};

export default RbacRoute;
