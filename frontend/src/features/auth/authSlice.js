import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.withCredentials = true;
const BASE_URL = "http://localhost:5001/api/auth";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${BASE_URL}/logout`);
      return;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/register`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const refresh = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/refresh`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/checkauth`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  isAuthenticated: false, // Boolean if user is authenticated
  user: null, // User object
  status: "idle", // Status of the async request
  error: null, // Error message
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(logout.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "idle";
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(refresh.pending, (state) => {
        state.status = "loading";
      })
      .addCase(refresh.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(refresh.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(checkAuth.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.loading = false;
        state.isAuthenticated = false;
      });
  },
});

export default authSlice.reducer;
