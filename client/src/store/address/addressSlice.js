import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import AddressService from '../../services/address.service';

const initialState = {
	address: [],
	loading: false,
	error: null,
};

export const resetState = createAction('resetState');

// ======== ASYNC ACTIONS ========
export const getUserAddress = createAsyncThunk(
	'address/get',
	async (_, thunkAPI) => {
		try {
			return await AddressService.getUserAddress();
		} catch (error) {
			return thunkAPI.rejectWithValue(
				error?.response?.data?.message || error.message,
			);
		}
	},
);

export const createAddress = createAsyncThunk(
	'address/create',
	async (data, thunkAPI) => {
		try {
			return await AddressService.createAddress(data);
		} catch (error) {
			return thunkAPI.rejectWithValue(
				error?.response?.data?.message || error.message,
			);
		}
	},
);

export const updateAddress = createAsyncThunk(
	'address/update',
	async ({ id, data }, thunkAPI) => {
		try {
			return await AddressService.updateAddress(id, data);
		} catch (error) {
			return thunkAPI.rejectWithValue(
				error?.response?.data?.message || error.message,
			);
		}
	},
);

export const deleteAddress = createAsyncThunk(
	'address/delete',
	async (id, thunkAPI) => {
		try {
			return await AddressService.deleteAddress(id);
		} catch (error) {
			return thunkAPI.rejectWithValue(
				error?.response?.data?.message || error.message,
			);
		}
	},
);

// ======== SLICE ========
const AddressSlice = createSlice({
	name: 'address',
	initialState,
	reducers: {
		clearAddresses: (state) => {
			state.address = null;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		// ===== GET USER ADDRESSES =====
		builder
			.addCase(getUserAddress.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getUserAddress.fulfilled, (state, action) => {
				state.loading = false;
				state.address = action.payload?.data || null;
			})
			.addCase(getUserAddress.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});

		// ===== CREATE ADDRESS =====
		builder
			.addCase(createAddress.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createAddress.fulfilled, (state, action) => {
				state.loading = false;
				state.address = action.payload?.data || null;
			})
			.addCase(createAddress.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});

		// ===== UPDATE ADDRESS =====
		builder
			.addCase(updateAddress.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateAddress.fulfilled, (state, action) => {
				state.loading = false;
				const updated = action.payload?.data;
				state.address = updated;
			})
			.addCase(updateAddress.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});

		// ===== DELETE ADDRESS =====
		builder
			.addCase(deleteAddress.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteAddress.fulfilled, (state, action) => {
				state.loading = false;
				const deletedId = action.payload?.data?._id;
				state.address = null;
			})
			.addCase(deleteAddress.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});

		// ===== RESET STATE =====
		builder.addCase(resetState, () => initialState);
	},
});

export const { clearAddresses } = AddressSlice.actions;

export default AddressSlice.reducer;
