import React, { useState } from "react";
import { FaTag, FaListUl } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal";
import ViewItemContent from "./modalcontent/ViewItemContent";
import EditItemContent from "./modalcontent/EditItemContent";
import SwapRequestContent from "./modalcontent/SwapRequestContent";
import { createSwap } from "../features/swaps/swapsSlice"; // Import the createSwap action
import GottaLoginBefore from "./modalcontent/GottaLoginBefore";

const ItemCard = ({
  item,
  isProfilePage,
  handleDelete,
  handleUpdate,
  userId,
  ownerId,
}) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Check if user is authenticated
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState("");

  const openModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    setModalTitle("");
  };

  const handleView = () => {
    if (isAuthenticated) {
      openModal("View Item Details", <ViewItemContent item={item} />);
    } else {
      openModal("Login Required", <GottaLoginBefore />);
    }
  };

  const handleEdit = () => {
    openModal(
      "Edit Item",
      <EditItemContent item={item} onSave={handleUpdate} />
    );
  };

  const handleSwapRequest = async (swapRequestData) => {
    try {
      await dispatch(createSwap(swapRequestData)).unwrap();
      alert("Swap request sent successfully");
      closeModal();
    } catch (error) {
      alert("Failed to send swap request");
    }
  };

  const handleSwapRequestOpen = () => {
    if (isAuthenticated) {
      openModal(
        "Send Swap Request",
        <SwapRequestContent
          item={item}
          onSubmit={handleSwapRequest}
          onClose={closeModal}
        />
      );
    } else {
      openModal("Login Required", <GottaLoginBefore />);
    }
  };

  // Helper function to truncate text
  const truncateText = (text, length) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + "...";
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition duration-300 hover:shadow-2xl flex flex-col h-auto w-80 mx-auto transform hover:-translate-y-1">
      <div className="w-full h-48 bg-gradient-to-b from-gray-100 to-gray-300 flex items-center justify-center overflow-hidden">
        {item.images && item.images.length > 0 ? (
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400">No Image Available</span>
        )}
      </div>
      <div className="p-6 flex flex-col justify-between flex-grow bg-gradient-to-r from-teal-50 via-white to-teal-50">
        <div>
          <h2 className="text-3xl font-bold text-teal-800 mb-4">
            {item.title}
          </h2>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-800">
              {truncateText(item.description, 20)}
            </p>
          </div>
          <div className="mb-4">
            <h3 className="text-md font-semibold text-gray-800 flex items-center">
              <FaListUl className="mr-2" /> Desired Items:
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {item.desiredItems && item.desiredItems.length > 0 ? (
                item.desiredItems.map((desiredItem, index) => (
                  <span
                    key={index}
                    className="bg-teal-200 text-teal-800 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  >
                    {desiredItem.trim()}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-600">
                  No desired items listed.
                </p>
              )}
            </div>
          </div>
          <div className="mb-4">
            <h3 className="text-md font-semibold text-gray-800 flex items-center">
              <FaTag className="mr-2" /> Tags:
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {item.tags && item.tags.length > 0 ? (
                item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  >
                    {tag.trim()}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-600">No tags listed.</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center space-x-4 mt-4">
          <button
            className="bg-teal-400 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105"
            onClick={handleView}
          >
            View
          </button>
          {isProfilePage ? (
            <>
              <button
                className="bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105"
                onClick={handleEdit}
              >
                Edit
              </button>
              {handleDelete && (
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              )}
            </>
          ) : userId === ownerId ? (
            <h3 className="text-red-500 font-semibold text-lg">My Item</h3>
          ) : (
            <button
              className="bg-indigo-400 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105"
              onClick={handleSwapRequestOpen}
            >
              Swap
            </button>
          )}
        </div>
      </div>
      {isModalOpen && (
        <Modal title={modalTitle} onClose={closeModal}>
          {modalContent}
        </Modal>
      )}
    </div>
  );
};

export default ItemCard;
