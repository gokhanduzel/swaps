import { useState } from "react";

const TagInput = ({ tags, setTags }) => {
  const [currentTag, setCurrentTag] = useState("");

  const addTag = () => {
    if (currentTag.trim() && tags.length < 6 && currentTag.length <= 15) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    } else {
      alert("Tag limit reached or tag length exceeded 15 characters");
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex flex-col space-x-2 my-2 items-center  md:flex-row md:space-x-2 md:my-0 md:mb-2 md:items-center">
        <label
          className="block text-lg font-medium text-gray-700"
          htmlFor="tags"
        >
          *Tags:
        </label>
        <div className="relative">
          <input
            className="border-2 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            type="text"
            id="tags"
            value={currentTag}
            required
            maxLength={15}
            onChange={(e) => setCurrentTag(e.target.value)}
          />
          <span className="absolute right-2 bottom-2 text-gray-400 text-xs">
            {currentTag.length}/15
          </span>
        </div>
        <button
          type="button"
          className="mt-4 md:mt-0 bg-teal-400 text-white px-2 py-1 rounded-xl shadow-sm hover:bg-blue-600"
          onClick={addTag}
        >
          Add Tag
        </button>
      </div>
      <p className="text-sm text-gray-400 pb-4">
        Enter a tag and click add. Maximum 6 tags, 15 characters each.
      </p>
      <div className="relative">
        <div className="flex flex-wrap gap-2 border-2 p-4 rounded">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-yellow-200 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded flex items-center"
            >
              {tag}
              <button
                type="button"
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => removeTag(index)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <span className="absolute right-2 bottom-2 text-gray-400 text-xs">
          {tags.length}/6
        </span>
      </div>
    </div>
  );
};

export default TagInput;
