import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.withCredentials = true;
const BASE_URL = "http://localhost:5001/api/swaps";

export const createSwap = createAsyncThunk(
  "swaps/createSwap",
  async (swapData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/createswap`, swapData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getSwaps = createAsyncThunk(
  "swaps/getSwaps",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/getswaps`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateSwap = createAsyncThunk(
  "swaps/updateSwap",
  async (swapData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/updateswap/${swapData.swapId}`,
        swapData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const acceptSwap = createAsyncThunk(
  "swaps/acceptSwap",
  async (swapId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/acceptswap/${swapId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const declineSwap = createAsyncThunk(
  "swaps/declineSwap",
  async (swapId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/declineswap/${swapId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteSwap = createAsyncThunk(
  "swaps/deleteSwap",
  async (swapId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/deleteswap/${swapId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  swaps: [],
  chats: {},
  status: "idle",
  error: null,
};

const swapsSlice = createSlice({
  name: "swaps",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createSwap.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createSwap.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.swaps.push(action.payload);
      })
      .addCase(createSwap.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getSwaps.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSwaps.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.swaps = action.payload;
      })
      .addCase(getSwaps.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateSwap.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateSwap.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.swaps = state.swaps.map((swap) =>
          swap._id === action.payload._id ? action.payload : swap
        );
      })
      .addCase(updateSwap.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(acceptSwap.pending, (state) => {
        state.status = "loading";
      })
      .addCase(acceptSwap.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.swaps = state.swaps.map((swap) =>
          swap._id === action.payload._id ? action.payload : swap
        );
      })
      .addCase(acceptSwap.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(declineSwap.pending, (state) => {
        state.status = "loading";
      })
      .addCase(declineSwap.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.swaps = state.swaps.map((swap) =>
          swap._id === action.payload._id ? action.payload : swap
        );
      })
      .addCase(declineSwap.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteSwap.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteSwap.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.swaps = state.swaps.filter(
          (swap) => swap._id !== action.meta.arg
        );
      })
      .addCase(deleteSwap.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Selectors
const selectSwaps = (state) => state.swaps.swaps;

// Memoized selectors
export const selectReceivedSwaps = createSelector(
  [selectSwaps, (state, userId) => userId],
  (swaps, userId) =>
    swaps.filter((swap) => swap.user2Id === userId && swap.status === "pending")
);

export const selectSentSwaps = createSelector(
  [selectSwaps, (state, userId) => userId],
  (swaps, userId) =>
    swaps.filter((swap) => swap.user1Id === userId && swap.status === "pending")
);

export const selectAcceptedSwaps = createSelector([selectSwaps], (swaps) =>
  swaps.filter((swap) => swap.status === "accepted")
);

export const selectChatMessagesByChatId = createSelector(
  [(state) => state.swaps.chats, (state, chatId) => chatId],
  (chats, chatId) => chats[chatId]?.messages || []
);

export default swapsSlice.reducer;
