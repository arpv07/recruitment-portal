import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../services/api';

export const login = createAsyncThunk('auth/login', async ({ username, password }) => {
  const data = await apiClient.login(username, password);
  return data;
});

export const register = createAsyncThunk('auth/register', async (userData) => {
    const response = await apiClient.register(userData);
    return response;
});


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = {
            fullName: action.payload.user.FullName,
            email: action.payload.user.Email,
            phone: action.payload.user.Phone,
            linkedInUrl: action.payload.user.LinkedInUrl,
            location: action.payload.user.Location,
            createdAt: action.payload.user.CreatedAt,
        };
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;