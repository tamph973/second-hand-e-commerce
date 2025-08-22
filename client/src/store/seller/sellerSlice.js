import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import SellerService from '@/services/seller.service';

const initialState = {
	seller: null,
	isLoading: false,
	isError: false,
};

export const resetState = createAction('resetState');

export const getSellerInfo = createAsyncThunk(
	'seller/get',
	async (sellerId, thunkAPI) => {
		try {
			const res = await SellerService.getSellerInfo(sellerId);
			return res.data;
		} catch (error) {
			return thunkAPI.rejectWithValue(error);
		}
	},
);
export const sellerSlice = createSlice({
	name: 'seller',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getSellerInfo.fulfilled, (state, action) => {
			state.seller = action.payload?.data || null;
			state.isLoading = false;
			state.isError = false;
		});
		builder.addCase(getSellerInfo.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(getSellerInfo.rejected, (state) => {
			state.isLoading = false;
			state.isError = true;
		});
	},
});

export default sellerSlice.reducer;
