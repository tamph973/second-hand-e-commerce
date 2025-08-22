import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import WishlistService from '@/services/wishlist.service';

// Async thunk để lấy tất cả wishlist
export const fetchWishlistItems = createAsyncThunk(
	'wishlist/fetchItems',
	async (_, { rejectWithValue }) => {
		try {
			const response = await WishlistService.getWishlist();
			return response.data.wishlistItems;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	},
);

// Async thunk để toggle wishlist
export const toggleWishlistItem = createAsyncThunk(
	'wishlist/toggleItem',
	async (productId, { rejectWithValue }) => {
		try {
			const response = await WishlistService.addToWishlist(productId);
			return { productId, isInWishlist: response.data.isInWishlist };
		} catch (error) {
			return rejectWithValue(error.message);
		}
	},
);

const wishlistSlice = createSlice({	name: 'wishlist',
	initialState: {
		items: new Set(),
		counts: {},
		isLoading: false,
		error: null,
	},
	reducers: {
		clearWishlist: (state) => {
			state.items.clear();
			state.counts = {};
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchWishlistItems.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchWishlistItems.fulfilled, (state, action) => {
				state.isLoading = false;
				// Sửa lại để lấy productId._id từ populated object
				state.items = new Set(
					action.payload.map((item) => item.productId._id),
				);

				// Cập nhật counts
				const counts = {};
				action.payload.forEach((item) => {
					const productId = item.productId._id;
					counts[productId] = (counts[productId] || 0) + 1;
				});
				state.counts = counts;
			})
			.addCase(fetchWishlistItems.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})
			.addCase(toggleWishlistItem.fulfilled, (state, action) => {
				const { productId, isInWishlist } = action.payload;

				if (isInWishlist) {
					state.items.add(productId);
					state.counts[productId] =
						(state.counts[productId] || 0) + 1;
				} else {
					state.items.delete(productId);
					state.counts[productId] = Math.max(
						0,
						(state.counts[productId] || 0) - 1,
					);
				}
			});
	},
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
