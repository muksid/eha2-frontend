import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../configs/auth.config.js";
import { AUTH_USER_URL, LOGIN_URL } from "../constants/api.urls.js";

axios.defaults.baseURL = BASE_URL;

const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export const fetchAuthUser = createAsyncThunk(
    "auth/fetchAuthUser",
    async (_, { rejectWithValue }) => {
      try {
        const res = await axios.get(AUTH_USER_URL); // GET /api/v1/user
        if (res.data?.data) return res.data.data;
        if (res.data?.user) return res.data.user;
        return res.data;
      } catch (err) {
        const message = err.response?.data?.message || err.message;
        return rejectWithValue(message);
      }
    },
);

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({ login, password }, { rejectWithValue }) => {
      try {
        const res = await axios.post(LOGIN_URL, { login, password });
        const payload = res?.data;

        if (payload?.success === false) {
          return rejectWithValue(payload);
        }

        const token = payload?.token;
        const user = payload?.user || payload?.data?.user;

        if (token) {
          localStorage.setItem("token", token);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }

        return { user, token };
      } catch (err) {
        const errorData = err.response?.data;
        if (errorData) {
          return rejectWithValue(errorData);
        }
        const message = err.response?.data?.message || err.message;
        return rejectWithValue({ message });
      }
    },
);

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
  token: token || null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  loginError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initialize(state, action) {
      // если хочешь вручную инициализировать из какого-то payload
      const { isAuthenticated, user, token } = action.payload || {};
      state.isInitialized = true;
      state.isAuthenticated = !!isAuthenticated;
      state.user = user || null;
      if (token) {
        state.token = token;
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
      state.isInitialized = true;
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      state.loginError = null;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    clearLoginError(state) {
      state.loginError = null;
      state.error = null;
      if (!state.isAuthenticated) {
        state.status = "idle";
      }
    },
  },
  extraReducers(builder) {
    builder
        // fetchAuthUser
        .addCase(fetchAuthUser.pending, (state) => {
          state.status = "loading";
          state.error = null;
        })
        .addCase(fetchAuthUser.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.user = action.payload;
          state.isAuthenticated = !!action.payload;
          state.isInitialized = true;
          state.error = null;
        })
        .addCase(fetchAuthUser.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload || action.error.message;
          state.user = null;
          state.isAuthenticated = false;
          state.isInitialized = true;
          state.token = null;
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
        })
        // loginUser
        .addCase(loginUser.pending, (state) => {
          state.status = "loading";
          state.error = null;
          state.loginError = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.user = action.payload.user || null;
          state.token = action.payload.token || state.token;
          state.isAuthenticated = !!action.payload.user;
          state.loginError = null;
          state.error = null;
        })
        .addCase(loginUser.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload;
          state.loginError = action.payload;
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
        });
  },
});

export const { initialize, logout, setUser, clearLoginError } = authSlice.actions;
export default authSlice.reducer;
