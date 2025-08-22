import Cookies from 'js-cookie';

/**
 * Lưu cookie khi người dùng đăng nhập thành công
 * @param {string} token - JWT token từ server
 * @param {Object} userData - Thông tin người dùng
 */

export const setAuthCookies = ({
	userId,
	access_token,
	refresh_token,
	remember,
}) => {
	if (!remember) {
		Cookies.set('userId', userId);
		Cookies.set('access_token', access_token);
		Cookies.set('refresh_token', refresh_token);
	} else {
		Cookies.set('userId', userId, { expires: 7 * 24 * 60 * 60 }); // 7 ngày
		Cookies.set('access_token', access_token, { expires: 60 * 60 }); // 1 giờ
		Cookies.set('refresh_token', refresh_token, {
			expires: 7 * 24 * 60 * 60,
		}); // 7 ngày
	}

	Cookies.set('userId', userId);
	Cookies.set('access_token', access_token);
	Cookies.set('refresh_token', refresh_token);
};

/**
 * Lấy thông tin xác thực từ cookies
 * @returns {Object} Object chứa token và thông tin người dùng
 */
export const getAuthCookies = () => {
	const userId = Cookies.get('userId');
	const access_token = Cookies.get('access_token');
	const refresh_token = Cookies.get('refresh_token');

	return {
		userId,
		access_token,
		refresh_token,
	};
};

/**
 * Xóa cookies khi người dùng đăng xuất
 */
export const removeAuthCookies = () => {
	Cookies.remove('userId');
	Cookies.remove('access_token');
	Cookies.remove('refresh_token');
};

/**
 * Kiểm tra xem người dùng đã đăng nhập hay chưa
 * @returns {boolean} true nếu đã đăng nhập, false nếu chưa
 */
export const isAuthenticated = () => {
	return !!Cookies.get('userId');
};
