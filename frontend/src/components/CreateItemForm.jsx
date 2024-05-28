import { useState } from "react";
import { useDispatch } from "react-redux";
import { createItem } from "../features/item/itemSlice";

const CreateItemForm = () => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [desiredItems, setDesiredItems] = useState([]);
  const [visible, setVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    const form = e.target;
    const data = {
      title: form.title.value,
      description: form.description.value,
      desiredItems: form.desiredItems.value.split(","),
      tags: form.tags.value.split(","),
      visible: form.visible.checked, 
    };
  
    console.log(data);
    try {
      const response = await dispatch(createItem(data));
      setIsLoading(false);
      console.log(response);
      if (createItem.fulfilled.match(response)) {
        alert("Item created successfully");
        setTitle("");
        setDescription("");
        setTags([]);
        setDesiredItems([]);
      } else {
        console.log(response);
        if (response.payload && response.payload !== undefined) {
          alert(`Item creation failed: ${response.payload.message}`);
        } else {
          alert("Item creation failed");
        }
      }
    } catch (error) {
      setError("An error occurred");
      setIsLoading(false);
    }
  }
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="mb-8 text-2xl font-bold text-gray-700">Create Item</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label htmlFor="title">Title</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="title"
            name="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            name="description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        {/* <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="images"
          >
            Images
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="file"
            id="images"
            name="images"
            value={images}
            multiple
            onChange={(e) => setImages(Array.from(e.target.files))}
          />
        </div> */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="tags"
          >
            Tags: please separate each tag with a comma ','
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="tags"
            name="tags"
            value={tags.join(",")}
            onChange={(e) => setTags(e.target.value.split(","))}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="desiredItems"
          >
            Desired Items
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="desiredItems"
            name="desiredItems"
            value={desiredItems.join(",")}
            onChange={(e) => setDesiredItems(e.target.value.split(","))}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="visible"
          >
            Visible
          </label>
          <input
            type="checkbox"
            id="visible"
            name="visible"
            checked={visible}
            onChange={(e) => setVisible(e.target.checked)}
          />
        </div>
        {error && <p>{error}</p>}
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {isLoading ? "Loading..." : "Create Item"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateItemForm;
