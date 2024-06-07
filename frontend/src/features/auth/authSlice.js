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
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`${BASE_URL}/refresh`);
      if (response.status === 200) {
        dispatch(setUser(response.data.user)); // Update the user in the state
        return response.data.user;
      } else {
        return rejectWithValue("Failed to refresh token");
      }
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
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
        console.log("User data set:", action.payload);
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
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(refresh.rejected, (state, action) => {
        state.error = action.payload.message;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.error = action.payload.message;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
