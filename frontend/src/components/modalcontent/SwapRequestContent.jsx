import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getItemsByUser } from "../../features/item/itemSlice";

const SwapRequestContent = ({ item, onSubmit, onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user?.user);
  const userId = user?._id;
  const userItems = useSelector((state) => state.item.userItems);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (userId) {
      dispatch(getItemsByUser(userId));
    }
  }, [dispatch, userId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedItemId) {
      alert("Please select an item to swap.");
      return;
    }
    const swapRequestData = {
      item1Id: selectedItemId,
      item2Id: item._id,
      user1Id: userId,
      user2Id: item.ownerId,
      message,
    };
    onSubmit(swapRequestData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Requested Item:</h2>
        <div className="flex items-center space-x-4">
          {item.images && item.images.length > 0 && (
            <img
              src={item.images[0]}
              alt="Requested Item"
              className="w-16 h-16 object-cover rounded"
            />
          )}
          <div>
            <h3 className="text-md font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        </div>
      </div>
      <div>
        <label className="block text-gray-700">Your Item:</label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userItems.map((userItem) => (
            <div
              key={userItem._id}
              className={`border p-2 rounded cursor-pointer ${
                selectedItemId === userItem._id ? "border-blue-500" : ""
              }`}
              onClick={() => setSelectedItemId(userItem._id)}
            >
              {userItem.images && userItem.images.length > 0 && (
                <img
                  src={userItem.images[0]}
                  alt="User Item"
                  className="w-full h-32 object-cover rounded"
                />
              )}
              <h2 className="text-lg font-semibold">{userItem.title}</h2>
              <p className="text-sm">{userItem.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-gray-700">Message:</label>
        <textarea
          placeholder="Your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Send Request
      </button>
    </form>
  );
};

export default SwapRequestContent;
