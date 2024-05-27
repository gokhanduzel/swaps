import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.withCredentials = true;
const BASE_URL = "http://localhost:5001/api/items";

export const createItem = createAsyncThunk(
  "items/createItem",
  async (itemData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/createitem`, itemData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getItems = createAsyncThunk(
  "items/getItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/getitems`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getVisibleItems = createAsyncThunk(
  "items/getVisibleItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/getvisibleitems`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getItem = createAsyncThunk(
  "items/getItem",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/getitem/${itemId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getItemsByUser = createAsyncThunk(
  "items/getItemsByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/getitemsbyuser/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateItem = createAsyncThunk(
  "items/updateItem",
  async ({ itemId, itemData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/updateitem/${itemId}`,
        itemData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteItem = createAsyncThunk(
  "items/deleteItem",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/deleteitem/${itemId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  allItems: [], // array of all items
  visibleItems: [], // array of visible items
  userItems: [], // array of items belonging to the user
  status: "idle", // status of the last dispatched action
  error: null, // error from the last dispatched action
};

const itemSlice = createSlice({
  name: "items",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.allItems.push(action.payload);
        state.userItems.push(action.payload);
        if (action.payload.visible) {
          state.visibleItems.push(action.payload);
        }
        state.status = "succeeded";
      })
      .addCase(createItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getItems.fulfilled, (state, action) => {
        state.allItems = action.payload;
        state.status = "succeeded";
      })
      .addCase(getItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getVisibleItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getVisibleItems.fulfilled, (state, action) => {
        state.visibleItems = action.payload;
        state.status = "succeeded";
      })
      .addCase(getVisibleItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getItem.fulfilled, (state, action) => {
        state.allItems = action.payload;
        state.status = "succeeded";
      })
      .addCase(getItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getItemsByUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getItemsByUser.fulfilled, (state, action) => {
        state.userItems = action.payload;
        state.status = "succeeded";
      })
      .addCase(getItemsByUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const updateItems = (items, check) =>
          items.map((item) =>
            item._id === action.payload._id
              ? check(item)
                ? action.payload
                : item
              : item
          );

        state.allItems = updateItems(state.allItems, () => true);
        state.visibleItems = updateItems(
          state.visibleItems,
          (item) => item.visible
        );
        state.userItems = updateItems(
          state.userItems,
          (item) => item.userId === currentUser.id
        );

        state.status = "succeeded";
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        const deleteItemFrom = (items, check) =>
          items.filter(
            (item) => item._id !== action.payload._id || !check(item)
          );

        state.allItems = deleteItemFrom(state.allItems, () => true);
        state.visibleItems = deleteItemFrom(
          state.visibleItems,
          (item) => item.visible
        );
        state.userItems = deleteItemFrom(
          state.userItems,
          (item) => item.userId === currentUser.id
        );

        state.status = "succeeded";
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default itemSlice.reducer;
