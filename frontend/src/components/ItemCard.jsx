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

  return (
    <div className="bg-white shadow-md rounded-lg p-4 relative">
      {item.images && item.images.length > 0 && (
        <img src={item.images[0]} alt={item.title} className="w-full h-48 object-cover rounded" />
      )}
      <h2 className="text-lg font-semibold text-gray-800">{item.title}</h2>
      <p className="text-sm text-gray-600 mt-2">{item.description}</p>
      <div className="flex justify-between items-center mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleView}
        >
          View
        </button>
        {isProfilePage ? (
          <>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleEdit}
            >
              Edit
            </button>
            {handleDelete && (
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            )}
          </>
        ) : userId === ownerId ? (
          <h3 className="text-red-500">My Item</h3>
        ) : (
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
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
      {isModalOpen && (
        <Modal title={modalTitle} onClose={toggleModal}>
          {modalContent}
        </Modal>
      )}
    </div>
  );
};

export default ItemCard;
