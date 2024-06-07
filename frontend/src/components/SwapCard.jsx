import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  acceptSwap,
  declineSwap,
  deleteSwap,
} from "../features/swaps/swapsSlice";
import Modal from "./Modal";
import ChatWindow from "./ChatWindow";
import ViewItemContent from "./modalcontent/ViewItemContent";
import FeedbackModalContent from "./modalcontent/FeedbackModalContent";
import { fetchMessages } from "../features/chats/chatsSlice";
import { IoNotificationsCircleOutline } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";

const SwapCard = ({ request }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.user?._id);
  const chatMessages = useSelector(
    (state) => state.chats.chats[request.chatId]?.messages || []
  );
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);

  const lastMessage = useMemo(
    () =>
      chatMessages.length > 0
        ? chatMessages[chatMessages.length - 1]
        : { text: request.message, senderId: null },
    [chatMessages, request.message]
  );

  useEffect(() => {
    if (request.status === "accepted" && request.chatId) {
      dispatch(fetchMessages(request.chatId));
    }
  }, [dispatch, request.status, request.chatId]);

  const handleAccept = () => {
    dispatch(acceptSwap(request._id));
  };

  const handleDecline = () => {
    dispatch(declineSwap(request._id));
  };

  const handleDelete = () => {
    dispatch(deleteSwap(request._id)).then((response) => {
      if (deleteSwap.fulfilled.match(response)) {
        alert("Swap deleted successfully");
        setIsFeedbackModalOpen(false);
        // Trigger a refresh of swaps in the ProfilePage component
        dispatch(getSwaps(userId));
      } else {
        alert("Swap deleted successfully");
      }
    });
  };

  const toggleChatModal = () => {
    setIsChatModalOpen(!isChatModalOpen);
  };

  const handleItemClick = (item) => {
    setModalTitle("View Item Details");
    setModalContent(<ViewItemContent item={item} />);
    setIsItemModalOpen(true);
  };

  const handleFeedback = () => {
    setModalTitle("Feedback");
    setModalContent(
      <FeedbackModalContent request={request} onComplete={handleDelete} />
    );
    setIsFeedbackModalOpen(true);
  };

  // Helper function to truncate text
  const truncateText = (text, length) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + "...";
  };

  return (
    <div
      key={request._id}
      className="bg-white rounded-lg p-4 shadow-md flex-col relative"
    >
      <div className="absolute items-center top-0 right-0 mr-1 mt-1 border rounded-full border-black bg-black">
        <FaCheckCircle
          size={30}
          className="text-lime-300 drop-shadow-greenGlow cursor-pointer hover:text-green-300 transition duration-300"
          onClick={handleFeedback}
        />
      </div>
      <div className="flex flex-row border-2 mb-2 rounded-xl bg-yellow-700 items-center">
        <IoNotificationsCircleOutline
          size={25}
          className="text-yellow-400 mx-2"
        />
        <p className="text-center text-white text-sm">
          {lastMessage.senderId ? `${lastMessage.senderId.username}: ` : ""}
          {truncateText(lastMessage.text, 6)}
        </p>
      </div>
      <div
        className={`flex justify-center items-center mb-2 rounded-2xl ${
          request.status === "accepted"
            ? "bg-green-200"
            : request.status === "declined"
            ? "bg-red-200"
            : "bg-yellow-200"
        }`}
      >
        <p>Status: {request.status}</p>
      </div>

      <div
        onClick={() => handleItemClick(request.item1Id)}
        className="cursor-pointer border-2 rounded-xl p-1 border-teal-400 shadow-md overflow-hidden transition duration-300 hover:shadow-2xl flex flex-col h-auto mx-auto transform hover:-translate-y-1"
      >
        <h2 className="text-lg font-semibold">
          {request.user1Id === userId ? "Your Item:" : "Offered Item:"}
        </h2>
        {request.item1Id.images && request.item1Id.images.length > 0 && (
          <img
            src={request.item1Id.images[0]}
            alt="Item Image"
            className="w-full h-32 object-cover rounded-md"
          />
        )}
        <p>Title: {request.item1Id.title}</p>
        <p>Description: {truncateText(request.item1Id.description, 10)}</p>
      </div>
      <div
        onClick={() => handleItemClick(request.item2Id)}
        className="cursor-pointer mt-4 border-2 rounded-xl p-1 border-teal-400 overflow-hidden transition duration-300 hover:shadow-2xl flex flex-col h-auto mx-auto transform hover:-translate-y-1"
      >
        <h2 className="text-lg font-semibold">
          {request.user1Id === userId ? "Requested Item:" : "Your Item:"}
        </h2>
        {request.item2Id.images && request.item2Id.images.length > 0 && (
          <img
            src={request.item2Id.images[0]}
            alt="Item Image"
            className="w-full h-32 object-cover rounded-md"
          />
        )}
        <p>Title: {request.item2Id.title}</p>
        <p>Description: {request.item2Id.description}</p>
      </div>

      {request.user2Id === userId && request.status === "pending" && (
        <div className="flex justify-end space-x-4 mt-4">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAccept}
          >
            Accept
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleDecline}
          >
            Decline
          </button>
        </div>
      )}

      {request.status === "accepted" && (
        <div className="flex justify-center items-center">
          <button
            className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={toggleChatModal}
          >
            Chat
          </button>
        </div>
      )}

      {isChatModalOpen && (
        <Modal title="Chat" onClose={toggleChatModal}>
          <ChatWindow chatId={request.chatId} />{" "}
          {/* Ensure chatId is passed correctly */}
        </Modal>
      )}

      {isItemModalOpen && (
        <Modal title={modalTitle} onClose={() => setIsItemModalOpen(false)}>
          {modalContent}
        </Modal>
      )}

      {isFeedbackModalOpen && (
        <Modal title={modalTitle} onClose={() => setIsFeedbackModalOpen(false)}>
          {modalContent}
        </Modal>
      )}
    </div>
  );
};

export default SwapCard;
