import React from "react"; // Add the missing import statement for React

const ItemCard = ({ item, isProfilePage, userId, ownerId }) => {

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-800">{item.title}</h2>
      <p className="text-sm text-gray-600 mt-2">{item.description}</p>
      <div className="flex justify-between items-center mt-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          View
        </button>
        {isProfilePage ? (
          <>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Edit
            </button>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Delete
            </button>
          </>
        ) : ( userId === ownerId ? (
          <h3 className="text-red-500">My Item</h3>
        ) : (
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Swap
          </button>
        ))}
      </div>
    </div>
  );
};

export default ItemCard;
