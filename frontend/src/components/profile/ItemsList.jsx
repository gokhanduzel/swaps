import React from "react";
import ItemCard from "../ItemCard";

const ItemsList = ({ items, handleDelete, handleUpdate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-2 p-4">
      {items.length > 0 ? (
        items.map((item) => (
          <ItemCard
            key={item._id}
            item={item}
            isProfilePage={true}
            handleDelete={handleDelete}
            handleUpdate={handleUpdate}
          />
        ))
      ) : (
        <div className="w-full text-center text-gray-600 text-xl">
          <p>
            No item listings found. Try adjusting your filters or check back
            later.
          </p>
        </div>
      )}
    </div>
  );
};

export default ItemsList;
