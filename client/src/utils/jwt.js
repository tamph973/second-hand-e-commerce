import { jwtDecode } from 'jwt-decode';

export const getRoleFromToken = (token) => {
	if (!token) {
		return null;
	}
	const decoded = jwtDecode(token);
	return decoded ? decoded.roles : null;
};

export const isAdmin = (token) => {
	const role = getRoleFromToken(token);
	return role.includes('ADMIN');
};

export const isSeller = (token) => {
	const role = getRoleFromToken(token);
	return role.includes('SELLER');
};

export const isUser = (token) => {
	const role = getRoleFromToken(token);
	return role.includes('USER');
};
