import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { io } from 'socket.io-client';

axios.defaults.withCredentials = true;
const BASE_URL = 'http://localhost:5001/api/chats';

// Initialize Socket.IO client
const socket = io(BASE_URL);

// Async thunk to create a new chat
export const createChat = createAsyncThunk(
  'chats/createChat',
  async ({ user1Id, user2Id }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/createchat`, { user1Id, user2Id });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to delete a chat
export const deleteChat = createAsyncThunk(
  'chats/deleteChat',
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/deletechat/${chatId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to fetch messages for a specific chat
export const fetchMessages = createAsyncThunk(
  'chats/fetchMessages',
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/getmessages/${chatId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to send a message in a specific chat
export const sendMessage = createAsyncThunk(
  'chats/sendMessage',
  async ({ chatId, senderId, text }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/addmessage/${chatId}`, { senderId, text });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  chats: {},
  status: 'idle',
  error: null,
};

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    // Reducer to handle new incoming messages via WebSocket
    newMessageReceived: (state, action) => {
      const { chatId, message } = action.payload;
      if (state.chats[chatId]) {
        state.chats[chatId].messages.push(message);
      } else {
        state.chats[chatId] = { messages: [message] };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createChat.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.chats[action.payload._id] = { ...action.payload, messages: [] };
      })
      .addCase(createChat.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteChat.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.status = 'succeeded';
        delete state.chats[action.meta.arg];
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchMessages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.chats[action.meta.arg] = { messages: action.payload };
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { chatId, ...message } = action.payload;
        if (state.chats[chatId]) {
          state.chats[chatId].messages.push(message);
        } else {
          state.chats[chatId] = { messages: [message] };
        }
        state.status = 'succeeded';
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { newMessageReceived } = chatsSlice.actions;
export default chatsSlice.reducer;

// Listen for new messages via WebSocket
socket.on('newMessage', (message) => {
  const { chatId, ...msg } = message;
  store.dispatch(newMessageReceived({ chatId, message: msg }));
});
