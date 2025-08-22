import { useEffect } from 'react';
import useSocket from '@/hooks/useSocket';
import { getAccessToken, getAuthLocalStorage } from '@/utils/localStorageUtils';
import { isSeller, isUser } from '@/utils/jwt';
import { toast } from 'react-toastify';

const NotificationCenter = () => {
	const token = getAccessToken();
	const { userId } = getAuthLocalStorage();

	const { joinUserRoom, joinSellerRoom, notifications } = useSocket();
	// console.log(notifications);
	useEffect(() => {
		if (token) {
			// Người dùng thông thường
			if (isUser(token)) {
				joinUserRoom(userId);
			}

			// Người bán
			if (isSeller(token)) {
				joinSellerRoom(userId);
			}
		}
	}, [token, userId, joinUserRoom, joinSellerRoom]);

	useEffect(() => {
		if (notifications.length > 0) {
			toast.success(notifications[notifications.length - 1].message);
		}
	}, [notifications]);

	return null;
};

export default NotificationCenter;
