import { useState } from "react";
import { useDispatch } from "react-redux";
import { createItem } from "../../features/item/itemSlice";
import TagInput from "./TagInput";
import DesiredItemInput from "./DesiredItemInput";
import ImageUpload from "./ImageUpload";
import FormField from "./FormField";
import ToggleSwitch from "./ToggleSwitch";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", JSON.stringify(tags));
    formData.append("desiredItems", JSON.stringify(desiredItems));
    formData.append("visible", visible);
    imageFiles.forEach((file) => formData.append("images", file));

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
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-5/6 md:w-1/2">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="*Title"
          type="text"
          id="title"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <hr />
        <TagInput tags={tags} setTags={setTags} />
        <hr />
        <DesiredItemInput
          desiredItems={desiredItems}
          setDesiredItems={setDesiredItems}
        />
        <hr />
        <div>
          <label
            className="block text-lg font-medium text-gray-700"
            htmlFor="description"
          >
            Description:
          </label>
          <div className="relative">
            <textarea
              className="border-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              id="description"
              required
              value={description}
              maxLength={100}
              onChange={(e) => setDescription(e.target.value)}
            />
            <span className="absolute right-2 bottom-2 text-gray-400 text-xs">
              {description.length}/100
            </span>
          </div>
        </div>
        <hr />
        <ImageUpload
          images={images}
          setImages={setImages}
          imageFiles={imageFiles}
          setImageFiles={setImageFiles}
        />
        <hr />
        <ToggleSwitch
          label="Visible"
          checked={visible}
          onChange={() => setVisible(!visible)}
        />
        <p className="text-sm text-gray-400">
          (* required field)
        </p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-center">
          <button
            type="submit"
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-teal-400 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? "cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Creating..." : "Create Item"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateItemForm;
