import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../services/api";
import { isTokenValid } from "../utils/auth";

export const login = createAsyncThunk("auth/login", async ({ username, password }) => {
  const data = await apiClient.login(username, password);
  return data;
});

export const register = createAsyncThunk("auth/register", async (userData) => {
  const response = await apiClient.register(userData);
  return response;
});

const getInitialAuthState = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (token && isTokenValid(token)) {
    return {
      user: JSON.parse(user),
      token,
      status: "idle",
      error: null,
    };
  }

  // If token is expired/invalid, clear storage
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return {
    user: null,
    token: null,
    status: "idle",
    error: null,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialAuthState(),
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    rehydrate: (state) => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      if (token && isTokenValid(token)) {
        state.user = JSON.parse(user);
        state.token = token;
      } else {
        state.user = null;
        state.token = null;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
  state.status = "succeeded";

  const { token, user } = action.payload || {};

  state.token = token || null;

  if (user) {
    state.user = {
      fullName: user.FullName || user.full_name || "",
      email: user.Email || user.email || "",
      phone: user.Phone || user.phone || "",
      linkedInUrl: user.LinkedInUrl || user.linkedin_url || "",
      location: user.Location || user.location || "",
      createdAt: user.CreatedAt || user.created_at || "",
    };
  } else {
    state.user = null;
  }
})
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { logout, rehydrate } = authSlice.actions;

export default authSlice.reducer;
