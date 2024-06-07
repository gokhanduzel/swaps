import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMessages,
  sendMessage,
  newMessageReceived,
} from "../features/chats/chatsSlice";
import socket from "../utils/socket";
import { format } from "date-fns";

const ChatWindow = ({ chatId }) => {
  const dispatch = useDispatch();
  const messages = useSelector(
    (state) => state.chats.chats[chatId]?.messages || []
  );
  const user = useSelector((state) => state.auth.user?.user);
  const userId = user?._id;
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    dispatch(fetchMessages(chatId));
    socket.emit("join", chatId);

    const handleNewMessage = (message) => {
      if (message.chatId === chatId) {
        dispatch(newMessageReceived({ chatId, message }));
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.emit("leave", chatId);
      socket.off("newMessage", handleNewMessage);
    };
  }, [dispatch, chatId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (text.trim()) {
      dispatch(
        sendMessage({
          chatId,
          senderId: { _id: userId, username: user.username },
          text: text.substring(0, 100),
        })
      )
        .unwrap()
        .then(() => {
          setText("");
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
          }
        })
        .catch((error) => console.error("Failed to send message:", error));
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-grow flex-col overflow-y-auto p-4 h-96 border-2 rounded bg-teal-50">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`relative my-2 p-2 rounded-lg max-w-xs min-w-32 break-words text-sm flex flex-col ${
              message.senderId._id === userId
                ? "bg-teal-300 text-black self-end"
                : "bg-gray-300 text-black self-start"
            }`}
          >
            <p className="font-bold">{message.senderId.username}:</p>
            <p>{message.text}</p>
            <span className="absolute bottom-1 right-1 text-xs text-gray-400">
              {format(new Date(message.timestamp), "MM/dd HH:mm")}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="message-form flex p-4 bg-gray-100 border-t border-teal-200"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-l-lg border-teal-300"
          maxLength={100} // Enforce the character limit in the input field
        />
        <button
          type="submit"
          className="p-2 bg-teal-400 text-white rounded-r-lg"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
