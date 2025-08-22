import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthService from '@/services/auth.service';
import { selectAuth, setAuth } from '@/store/auth/authSlice';
import { getAuthLocalStorage } from '@/utils/localStorageUtils';

const useAuthUser = () => {
	const dispatch = useDispatch();
	const auth = useSelector(selectAuth);
	const { access_token } = getAuthLocalStorage();

	const [fetched, setFetched] = useState(false);

	useEffect(() => {
		if (!access_token || fetched) return;
		if (!auth || !auth.id) {
			const fetchUserData = async () => {
				try {
					const res = await AuthService.getAuthUser();
					if (res.data) {
						dispatch(setAuth(res.data));
					}
				} catch (error) {
					console.log(error);
					dispatch(setAuth(null));
				} finally {
					setFetched(true);
				}
			};
			fetchUserData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, access_token, fetched]);
	return {
		user: auth,
	};
};

export default useAuthUser;
