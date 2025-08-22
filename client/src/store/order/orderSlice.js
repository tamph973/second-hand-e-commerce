import OrderService from '@/services/order.service.js';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
const initialState = {
	orders: [],
	isLoading: false,
	isError: false,
};

export const getSellerOrders = createAsyncThunk(
	'order/getSellerOrders',
	async (_, thunkAPI) => {
		try {
			const response = await OrderService.getSellerOrders();
			return response.orders;
		} catch (error) {
			return thunkAPI.rejectWithValue(error);
		}
	},
);

export const getOrderDetail = createAsyncThunk(
	'order/get',
	async (orderId, thunkAPI) => {
		try {
			const response = await OrderService.getOrderDetail(orderId);
			return response.data;
		} catch (error) {
			return thunkAPI.rejectWithValue(error);
		}
	},
);

export const getAllOrders = createAsyncThunk(
	'order/getAll',
	async (_, thunkAPI) => {
		try {
			const response = await OrderService.getAllOrders();
			return response.data.orders;
		} catch (error) {
			return thunkAPI.rejectWithValue(error);
		}
	},
);

const orderSlice = createSlice({
	name: 'order',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getOrderDetail.fulfilled, (state, action) => {
			state.orders = action.payload;
			state.isLoading = false;
			state.isError = false;
		});
		builder.addCase(getOrderDetail.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(getOrderDetail.rejected, (state) => {
			state.isLoading = false;
			state.isError = true;
		});
		builder.addCase(getAllOrders.fulfilled, (state, action) => {
			state.orders = action.payload;
			state.isLoading = false;
			state.isError = false;
		});
		builder.addCase(getAllOrders.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(getAllOrders.rejected, (state) => {
			state.isLoading = false;
			state.isError = true;
		});
		builder.addCase(getSellerOrders.fulfilled, (state, action) => {
			state.orders = action.payload;
			state.isLoading = false;
			state.isError = false;
		});
		builder.addCase(getSellerOrders.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(getSellerOrders.rejected, (state) => {
			state.isLoading = false;
			state.isError = true;
		});
	},
});

export default orderSlice.reducer;
