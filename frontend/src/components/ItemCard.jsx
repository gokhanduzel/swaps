import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "./Modal";
import ViewItemContent from "./modalcontent/ViewItemContent";
import EditItemContent from "./modalcontent/EditItemContent";
import SwapRequestContent from "./modalcontent/SwapRequestContent";
import { createSwap } from "../features/swaps/swapsSlice";

const ItemCard = ({ item, isProfilePage, handleDelete, handleUpdate, userId, ownerId }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState("");

  const handleView = () => {
    setModalTitle("View Item Details");
    setModalContent(<ViewItemContent item={item} />);
    setIsModalOpen(true);
  };

  const handleEdit = () => {
    setModalTitle("Edit Item");
    setModalContent(
      <EditItemContent
        item={item}
        onSave={handleUpdate}
        onClose={() => setIsModalOpen(false)}
      />
    );
    setIsModalOpen(true);
  };

  const handleSwapRequest = (swapRequestData) => {
    dispatch(createSwap(swapRequestData)).then((response) => {
      if (createSwap.fulfilled.match(response)) {
        alert("Swap request sent successfully");
      } else {
        alert("Failed to send swap request");
      }
      setIsModalOpen(false);
    });
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Helper function to truncate text
  const truncateText = (text, length) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + "...";
  };

  console.log("Item:", item.tags);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition duration-300 hover:shadow-xl flex flex-col h-auto w-72 mx-auto">
      <div className="w-full h-48 bg-gradient-to-b from-gray-100 to-gray-300 flex items-center justify-center">
        {item.images && item.images.length > 0 ? (
          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400">No Image Available</span>
        )}
      </div>
      <div className="p-5 flex flex-col justify-between flex-grow">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{item.title}</h2>
          <p className="text-sm text-gray-600 mt-2 mb-4">{truncateText(item.description, 50)}</p>
          <div className="mb-4">
            <h3 className="text-md font-semibold text-gray-800">Desired Items:</h3>
            <div className="flex flex-wrap gap-2">
              {item.desiredItems && item.desiredItems.length > 0 ? (
                item.desiredItems.map((desiredItem, index) => (
                  <span key={index} className="bg-teal-200 text-teal-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                    {desiredItem.trim()}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-600">No desired items listed.</p>
              )}
            </div>
          </div>
          <div className="mb-4">
            <h3 className="text-md font-semibold text-gray-800">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {item.tags && item.tags.length > 0 ? (
                item.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-200 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                    {tag.trim()}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-600">No tags listed.</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
            onClick={handleView}
          >
            View
          </button>
          {isProfilePage ? (
            <>
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors"
                onClick={handleEdit}
              >
                Edit
              </button>
              {handleDelete && (
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              )}
            </>
          ) : userId === ownerId ? (
            <h3 className="text-red-500 font-semibold">My Item</h3>
          ) : (
            <button
              className="bg-green-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition-colors"
              onClick={() => {
                setModalTitle("Send Swap Request");
                setModalContent(
                  <SwapRequestContent
                    item={item}
                    onSubmit={handleSwapRequest}
                    onClose={toggleModal}
                  />
                );
                setIsModalOpen(true);
              }}
            >
              Swap
            </button>
          )}
        </div>
      </div>
      {isModalOpen && (
        <Modal title={modalTitle} onClose={toggleModal}>
          {modalContent}
        </Modal>
      )}
    </div>
  );
};

export default ItemCard;
