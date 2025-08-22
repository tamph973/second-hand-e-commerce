import CartService from '@/services/cart.service.js';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
	items: [],
	totalQuantity: 0,
	totalPrice: 0,
	appliedCoupon: null,
	selected: {}, // { sellerId: [productId, productId, ...] }
};

export const getCart = createAsyncThunk('cart/get', async (_, thunkAPI) => {
	try {
		const response = await CartService.getCart();
		return response.data;
	} catch (error) {
		return thunkAPI.rejectWithValue(error);
	}
});

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		setCart: (state, action) => {
			state.items = action.payload.items;
			state.totalQuantity = action.payload.totalQuantity;
			state.totalPrice = action.payload.totalPrice;
			state.appliedCoupon = action.payload.appliedCoupon;
		},
		setTotalCart: (state, action) => {
			state.totalQuantity = action.payload.totalQuantity;
			state.totalPrice = action.payload.totalPrice;
		},
		clearCart: () => initialState,
		toggleProductSelection(state, action) {
			const { sellerId, productId, variantId } = action.payload;
			if (!state.selected[sellerId]) {
				state.selected[sellerId] = [];
			}

			// Tìm item đã tồn tại
			const existingIndex = state.selected[sellerId].findIndex(
				(item) =>
					item.productId === productId &&
					item.variantId === variantId,
			);
			if (existingIndex !== -1) {
				// Nếu đã tồn tại thì xóa
				state.selected[sellerId].splice(existingIndex, 1);
			} else {
				// Nếu chưa tồn tại thì thêm vào: index = -1
				state.selected[sellerId].push({ productId, variantId });
			}
		},
		toggleAllSelection(state) {
			const allSelected = state.items.every((seller) =>
				seller.products
					.filter((product) => !product._destroy)
					.every((product) =>
						state.selected[seller.sellerId]?.some(
							(item) =>
								item.productId === product.id &&
								item.variantId === (product.variantId || null),
						),
					),
			);
			state.items.forEach((seller) => {
				state.selected[seller.sellerId] = allSelected
					? []
					: seller.products
							.filter((product) => !product._destroy)
							.map((p) => ({
								productId: p.id,
								variantId: p.variantId || null,
							}));
			});
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getCart.fulfilled, (state, action) => {
			state.buyerId = action.payload.buyerId;
			state.items = action.payload.itemsBySeller;
			state.totalQuantity = action.payload.totalQuantity;
			state.totalPrice = action.payload.totalPrice;
		});
	},
});

export const {
	setCart,
	clearCart,
	setTotalCart,
	toggleProductSelection,
	toggleAllSelection,
} = cartSlice.actions;
export default cartSlice.reducer;
