import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import AuthService from '@/services/auth.service';

const initialState = {
	auth: null,
	loading: false,
	error: null,
};

export const resetState = createAction('resetState');

export const register = createAsyncThunk(
	'auth/register',
	async (data, { rejectWithValue }) => {
		try {
			return await AuthService.register(data);
		} catch (error) {
			return rejectWithValue(error || 'Registration failed');
		}
	},
);

export const login = createAsyncThunk(
	'auth/login',
	async (data, { rejectWithValue }) => {
		try {
			return await AuthService.login(data);
		} catch (error) {
			return rejectWithValue(error || 'Login failed');
		}
	},
);

export const logout = createAsyncThunk(
	'auth/logout',
	async (_, { rejectWithValue }) => {
		try {
			return await AuthService.logout();
		} catch (error) {
			return rejectWithValue(error || 'Logout failed');
		}
	},
);

export const authSocial = createAsyncThunk(
	'auth/login-social',
	async (data, { rejectWithValue }) => {
		try {
			return await AuthService.authSocial(data);
		} catch (error) {
			return rejectWithValue(error || 'Social login failed');
		}
	},
);

export const forgotPassword = createAsyncThunk(
	'auth/forgot-password',
	async (data, { rejectWithValue }) => {
		try {
			return await AuthService.forgotPassword(data);
		} catch (error) {
			return rejectWithValue(error || 'Forgot password failed');
		}
	},
);

export const verifyOTP = createAsyncThunk(
	'auth/verify-otp',
	async (data, { rejectWithValue }) => {
		try {
			return await AuthService.verifyOTP(data);
		} catch (error) {
			return rejectWithValue(error || 'OTP verification failed');
		}
	},
);

export const resetPassword = createAsyncThunk(
	'auth/reset-password',
	async (data, { rejectWithValue }) => {
		try {
			return await AuthService.resetPassword(data);
		} catch (error) {
			return rejectWithValue(error || 'Reset password failed');
		}
	},
);

export const changePassword = createAsyncThunk(
	'auth/change-password',
	async (data, { rejectWithValue }) => {
		try {
			return await AuthService.changePassword(data);
		} catch (error) {
			return rejectWithValue(error || 'Change password failed');
		}
	},
);

const AuthSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setAuth: (state, action) => {
			state.auth = action.payload;
			state.error = null;
		},
		clearAuth: (state) => {
			state.auth = null;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		// Register
		builder
			.addCase(register.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(register.fulfilled, (state, action) => {
				state.loading = false;
				state.auth = action.payload?.data || null;
			})
			.addCase(register.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});

		// Login
		builder
			.addCase(login.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.loading = false;
				state.auth = action.payload?.data || null;
			})
			.addCase(login.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});

		// Logout
		builder
			.addCase(logout.pending, (state) => {
				state.loading = true;
			})
			.addCase(logout.fulfilled, (state) => {
				state.loading = false;
				state.auth = null;
			})
			.addCase(logout.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});

		// Social auth
		builder
			.addCase(authSocial.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(authSocial.fulfilled, (state, action) => {
				state.loading = false;
				state.auth = action.payload?.data || null;
			})
			.addCase(authSocial.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});

		// Forgot password
		builder
			.addCase(forgotPassword.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(forgotPassword.fulfilled, (state) => {
				state.loading = false;
			})
			.addCase(forgotPassword.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});

		// Verify OTP
		builder
			.addCase(verifyOTP.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(verifyOTP.fulfilled, (state) => {
				state.loading = false;
			})
			.addCase(verifyOTP.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});

		// Reset password
		builder
			.addCase(resetPassword.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(resetPassword.fulfilled, (state) => {
				state.loading = false;
			})
			.addCase(resetPassword.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});

		// Change password
		builder
			.addCase(changePassword.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(changePassword.fulfilled, (state, action) => {
				state.auth.passwordChangeTime =
					action.payload.passwordChangeTime;
				state.loading = false;
			})
			.addCase(changePassword.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});

		// Reset state
		builder.addCase(resetState, () => initialState);
	},
});

export const { setAuth, clearAuth } = AuthSlice.actions;
export default AuthSlice.reducer;
