import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
import authReducer from '@/store/auth/authSlice';
import userReducer from '@/store/user/userSlice';
import addressReducer from '@/store/address/addressSlice';
import cartReducer from '@/store/cart/cartSlice';
import orderReducer from '@/store/order/orderSlice';
import sellerReducer from '@/store/seller/sellerSlice';
import wishlistReducer from '@/store/wishlist/wishlistSlice';

const rootReducer = combineReducers({
	auth: authReducer,
	user: userReducer,
	address: addressReducer,
	cart: cartReducer,
	order: orderReducer,
	seller: sellerReducer,
	wishlist: wishlistReducer,
});

const persistConfig = {
	key: 'root',
	version: 1,
	storage,
	whitelist: ['auth'],
};

// Kích hoạt quá trình lưu & khôi phục dữ liệu tự động.
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export const persistor = persistStore(store);
