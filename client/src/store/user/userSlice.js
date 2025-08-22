import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import UserService from '@/services/user.service';

const initialState = {
	user: null,
	error: false,
	loading: false,
	success: false,
	message: '',
};

export const resetState = createAction('resetState');

export const getUserData = createAsyncThunk('user/get', async (_, thunkAPI) => {
	try {
		return await UserService.getUserData();
	} catch (error) {
		return thunkAPI.rejectWithValue(error);
	}
});

export const updateUser = createAsyncThunk(
	'user/update',
	async (data, thunkAPI) => {
		try {
			return await UserService.updateUser(data);
		} catch (error) {
			return thunkAPI.rejectWithValue(error);
		}
	},
);

const asyncActions = [updateUser, getUserData];
const addAsyncCases = (builder, action) => {
	builder
		.addCase(action.pending, (state) => {
			state.loading = true;
			state.error = false;
			state.success = false;
			state.message = '';
		})
		.addCase(action.fulfilled, (state, action) => {
			state.success = true;
			state.loading = false;
			state.user = action.payload?.data || null;
			state.message = action.payload?.message || '';
		})
		.addCase(action.rejected, (state, action) => {
			state.error = true;
			state.loading = false;
			state.success = false;
			state.message = action.payload;
		});
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		asyncActions.forEach((action) => addAsyncCases(builder, action));
		builder.addCase(resetState, () => initialState);
	},
});

export default userSlice.reducer;
