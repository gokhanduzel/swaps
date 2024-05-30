import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { acceptSwap, declineSwap } from "../features/swaps/swapsSlice";
import Modal from "./Modal";
import ChatWindow from "./ChatWindow";
import ViewItemContent from "./modalcontent/ViewItemContent";

const SwapCard = ({ request }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.user?._id);

  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);

  const handleAccept = () => {
    dispatch(acceptSwap(request._id)); // This now solely updates the swap status and handles chat creation in the backend
  };

  const handleDecline = () => {
    dispatch(declineSwap(request._id));
  };

  const toggleChatModal = () => {
    setIsChatModalOpen(!isChatModalOpen);
  };

  const handleItemClick = (item) => {
    setModalTitle("View Item Details");
    setModalContent(<ViewItemContent item={item} />);
    setIsItemModalOpen(true);
  };

  return (
    <div key={request._id} className="bg-white shadow-md rounded-lg p-4">
    <h2 className="text-lg font-semibold">
          {request.message}
        </h2>
      <div onClick={() => handleItemClick(request.item1Id)} className="cursor-pointer">
        <h2 className="text-lg font-semibold">
          {request.user1Id === userId ? "Your Item" : "Offered Item"}
        </h2>
        {request.item1Id.images && request.item1Id.images.length > 0 && (
          <img src={request.item1Id.images[0]} alt="Item Image" className="w-full h-32 object-cover rounded-md" />
        )}
        <p>Title: {request.item1Id.title}</p>
        <p>Description: {request.item1Id.description}</p>
      </div>
      <div onClick={() => handleItemClick(request.item2Id)} className="cursor-pointer mt-4">
        <h2 className="text-lg font-semibold">
          {request.user1Id === userId ? "Requested Item" : "Your Item"}
        </h2>
        {request.item2Id.images && request.item2Id.images.length > 0 && (
          <img src={request.item2Id.images[0]} alt="Item Image" className="w-full h-32 object-cover rounded-md" />
        )}
        <p>Title: {request.item2Id.title}</p>
        <p>Description: {request.item2Id.description}</p>
      </div>
      <p>Status: {request.status}</p>

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
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={toggleChatModal}
        >
          Chat
        </button>
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
    </div>
  );
};

export default SwapCard;
