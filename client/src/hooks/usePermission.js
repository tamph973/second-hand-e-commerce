import { rolePermissions } from '@/configs/rbacConfig';

export const usePermission = (userRole) => {
	const hasPermissions = (permission) => {
		const permissions = rolePermissions[userRole] || [];
		return permissions.includes(permission) || false;
	};
	return {
		hasPermissions,
	};
};
