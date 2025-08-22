import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

const useSocket = () => {
	const [socket, setSocket] = useState(null);
	const [notifications, setNotifications] = useState([]);

	useEffect(() => {
		const socket = io('http://localhost:8080', {
			withCredentials: true,
			transports: ['websocket'],
		});

		setSocket(socket);

		return () => {
			socket.disconnect();
		};
	}, []);

	const joinUserRoom = (userId) => {
		if (socket) {
			socket.emit('join-user-room', userId);
			socket.on('notification', (notification) => {
				if (
					notification.type === 'user' &&
					notification.userId === userId
				) {
					setNotifications((prev) => [...prev, notification]);
				}
			});
		}
	};

	const joinSellerRoom = (sellerId) => {
		if (socket) {
			socket.emit('join-seller-room', sellerId);
			socket.on('notification', (notification) => {
				if (
					notification.type === 'seller' &&
					notification.sellerId === sellerId
				) {
					setNotifications((prev) => [...prev, notification]);
				}
			});
		}
	};

	return {
		socket,
		notifications,
		joinUserRoom,
		joinSellerRoom,
	};
};

export default useSocket;
