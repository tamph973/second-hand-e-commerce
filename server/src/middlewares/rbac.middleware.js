import Errors from '../common/response/error.response.js';
import { rbacConfig } from '../../../data/mockDatabase-RBAC.js';

export const getPermissionsFromRole = async (role) => {
	// Lấy role từ database
	const fullRole = await rbacConfig.find((i) => i.role === role);
	if (!fullRole) {
		throw new Errors.ForbiddenError('Your role is not exist!!!');
	}

	let permissions = new Set(fullRole.permissions);

	// Lấy permission từ role kế thừa
	// Xử lý kế thừa permission
	if (Array.isArray(fullRole.inherits) && fullRole.inherits.length > 0) {
		for (const inherit of fullRole.inherits) {
			const inheritPermissions = await getPermissionsFromRole(inherit);
			inheritPermissions.forEach((permission) => {
				permissions.add(permission);
			});
		}
	}

	return Array.from(permissions);
};

// RBAC 1:1 - 1 user có 1 role, 1 role có 1 permission
// export const rbacMiddleware = (allowedRoles) => (req, res, next) => {
// 	try {
// 		const userRole = req.user.role;

// 		if (!userRole) {
// 			throw new Errors.ForbiddenError(
// 				'User does not have any roles assigned',
// 			);
// 		}

// 		const hasAllowedRole = allowedRoles.some((role) =>
// 			userRole.includes(role),
// 		);

// 		if (!hasAllowedRole) {
// 			throw new Errors.ForbiddenError(
// 				'You are not authorized to access this resource',
// 			);
// 		}
// 		next();
// 	} catch (error) {
// 		next(error);
// 	}
// };

// RBAC 1:N - 1 user có  role, 1 role có nhiều permission

export const rbacMiddleware = (allowPermissions) => async (req, res, next) => {
	try {
		const userRoles = req.user.role;
		if (!Array.isArray(userRoles) || userRoles.length === 0) {
			throw new Errors.ForbiddenError('User does not have any role!!!');
		}

		let userPermissions = new Set(); // Tạo một Set để lưu trữ các permission của user

		// Duyệt qua tất cả các role của user
		// Lấy permission từ từng role
		for (const role of userRoles) {
			const rolePermissions = await getPermissionsFromRole(role);
			rolePermissions.forEach((permission) => {
				userPermissions.add(permission);
			});
		}

		const hasPermissions = allowPermissions.every((permission) =>
			userPermissions.has(permission),
		);

		if (!hasPermissions) {
			throw new Errors.ForbiddenError(
				'You are not authorized to access this resource!!!',
			);
		}
		next();
	} catch (error) {
		next(error);
	}
};
