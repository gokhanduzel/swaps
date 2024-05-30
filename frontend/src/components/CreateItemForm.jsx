import { useState } from "react";
import { useDispatch } from "react-redux";
import { createItem } from "../features/item/itemSlice";

const CreateItemForm = () => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [desiredItems, setDesiredItems] = useState([]);
  const [visible, setVisible] = useState(true);
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files.map(file => URL.createObjectURL(file))]);
    setImageFiles([...imageFiles, ...files]);
  };

  const handleRemoveImage = (url) => {
    const index = images.indexOf(url);
    if (index > -1) {
      setImages(images.filter((_, i) => i !== index));
      setImageFiles(imageFiles.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags.join(','));
    formData.append('desiredItems', desiredItems.join(','));
    formData.append('visible', visible);
    imageFiles.forEach(file => formData.append('images', file));

    try {
      const response = await dispatch(createItem(formData));
      setIsLoading(false);
      if (createItem.fulfilled.match(response)) {
        alert("Item created successfully");
        setTitle("");
        setDescription("");
        setTags([]);
        setDesiredItems([]);
        setImages([]);
        setImageFiles([]);
      } else {
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
        <div className="mb-4">
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
            multiple
            onChange={handleImageChange}
          />
          <div className="image-preview mt-4">
            {images.map((url, index) => (
              <div key={index} className="image-container relative inline-block">
                <img src={url} alt={`Preview ${index}`} className="w-24 h-24 object-cover" />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1"
                  onClick={() => handleRemoveImage(url)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
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
