import { useState } from "react";

const DesiredItemInput = ({ desiredItems, setDesiredItems }) => {
  const [currentDesiredItem, setCurrentDesiredItem] = useState("");

  const addDesiredItem = () => {
    if (
      currentDesiredItem.trim() &&
      desiredItems.length < 3 &&
      currentDesiredItem.length <= 20
    ) {
      setDesiredItems([...desiredItems, currentDesiredItem.trim()]);
      setCurrentDesiredItem("");
    } else {
      alert("Desired item limit reached or item length exceeded 20 characters");
    }
  };

  const removeDesiredItem = (index) => {
    setDesiredItems(desiredItems.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex flex-col space-x-2 my-2 items-center  md:flex-row md:space-x-2 md:my-0 md:mb-2 md:items-center">
        <label
          className="block text-lg font-medium text-gray-700"
          htmlFor="desiredItems"
        >
          Desired Items:
        </label>
        <div className="relative">
          <input
            className="border-2 mt-1 pr-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            type="text"
            id="desiredItems"
            maxLength={20}
            value={currentDesiredItem}
            onChange={(e) => setCurrentDesiredItem(e.target.value)}
          />
          <span className="absolute right-2 bottom-2 text-gray-400 text-xs">
            {currentDesiredItem.length}/20
          </span>
        </div>
        <button
          type="button"
          className="mt-4 md:mt-0 bg-teal-400 text-white px-2 py-1 rounded-xl shadow-sm hover:bg-blue-600"
          onClick={addDesiredItem}
        >
          Add Item
        </button>
      </div>
      <p className="text-sm text-gray-400 pb-4">
        Enter an item and click add. Maximum 3 items, 20 characters each.
      </p>
      <div className="relative">
        <div className="flex flex-wrap gap-2 border-2 p-4 rounded">
          {desiredItems.map((item, index) => (
            <span
              key={index}
              className="bg-teal-200 text-teal-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded flex items-center"
            >
              {item}
              <button
                type="button"
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => removeDesiredItem(index)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <span className="absolute right-2 bottom-2 text-gray-400 text-xs">
          {desiredItems.length}/3
        </span>
      </div>
    </div>
  );
};

export default DesiredItemInput;
