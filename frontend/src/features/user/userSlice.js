import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.withCredentials = true;
const BASE_URL = "http://localhost:5001/api/users";

// Fetch user profile
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/getuser/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async ({ userId, profileData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/updateuser/${userId}`,
        profileData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete user profile
export const deleteUserProfile = createAsyncThunk(
  "user/deleteUserProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/deleteuser/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  user: null,
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = { ...state.user, ...action.payload }; // Update user state
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = null; // Clear user state
      })
      .addCase(deleteUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
