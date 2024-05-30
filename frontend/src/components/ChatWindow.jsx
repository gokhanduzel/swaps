import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, sendMessage, newMessageReceived } from '../features/chats/chatsSlice';
import socket from '../utils/socket';

const ChatWindow = ({ chatId }) => {
  const dispatch = useDispatch();
  const messages = useSelector(state => state.chats.chats[chatId]?.messages || []);
  const userId = useSelector(state => state.auth.user?.user?._id);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    dispatch(fetchMessages(chatId));
    socket.emit('join', chatId);

    // Function to handle incoming messages
    const handleNewMessage = (message) => {
      if (message.chatId === chatId) {
        dispatch(newMessageReceived({ chatId, message }));
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.emit('leave', chatId);
      socket.off('newMessage', handleNewMessage);
    };
  }, [dispatch, chatId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (text.trim()) {
      dispatch(sendMessage({ chatId, senderId: userId, text }))
        .unwrap()
        .then(() => {
          setText('');
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        })
        .catch(error => console.error('Failed to send message:', error));
    }
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.senderId === userId ? 'sent' : 'received'}`}>
            <p>{message.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="message-form">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;
