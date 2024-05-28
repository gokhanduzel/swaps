import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateItem } from "../../features/item/itemSlice";

const EditItemContent = ({ item, onSave, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: item.title,
    description: item.description,
    tags: item.tags.join(","),
    desiredItems: item.desiredItems.join(","),
    visible: item.visible,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const data = {
      ...formData,
      tags: formData.tags.split(","),
      desiredItems: formData.desiredItems.split(","),
    };

    try {
      const response = await dispatch(
        updateItem({ itemId: item._id, itemData: data })
      );
      setIsLoading(false);
      if (updateItem.fulfilled.match(response)) {
        alert("Item updated successfully");
        onSave();
        onClose();
      } else {
        if (response.payload && response.payload !== undefined) {
          alert(`Item update failed: ${response.payload.message}`);
        } else {
          alert("Item update failed");
        }
      }
    } catch (error) {
      setError("An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700">Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-gray-700">Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>
      <div>
        <label className="block text-gray-700">Tags:</label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500">
          Please separate each tag with a comma ','.
        </p>
      </div>
      <div>
        <label className="block text-gray-700">Desired Items:</label>
        <input
          type="text"
          name="desiredItems"
          value={formData.desiredItems}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center">
        <label className="text-gray-700">Visible</label>
        <input
          type="checkbox"
          name="visible"
          checked={formData.visible}
          onChange={handleChange}
          className="ml-2"
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {isLoading ? "Loading..." : "Save Changes"}
      </button>
    </form>
  );
};

export default EditItemContent;
