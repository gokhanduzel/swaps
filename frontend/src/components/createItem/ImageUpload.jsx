const ImageUpload = ({ images, setImages, imageFiles, setImageFiles }) => {
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFormats = ["image/png", "image/jpeg"];

    const validFiles = files.filter(file => validFormats.includes(file.type));
    if (validFiles.length !== files.length) {
      alert("Only PNG and JPEG formats are allowed.");
    }

    const totalImages = images.length + validFiles.length;
    if (totalImages > 5) {
      alert("You can upload a maximum of 5 images.");
      return;
    }

    setImages([...images, ...validFiles.map((file) => URL.createObjectURL(file))]);
    setImageFiles([...imageFiles, ...validFiles]);
  };

  const handleRemoveImage = (url) => {
    const index = images.indexOf(url);
    if (index > -1) {
      setImages(images.filter((_, i) => i !== index));
      setImageFiles(imageFiles.filter((_, i) => i !== index));
    }
  };

  return (
    <div>
      <label
        className="block text-lg font-medium text-gray-700"
        htmlFor="images"
      >
        *Images:
      </label>
      <p className="text-sm text-gray-400 pb-4">
        Maximum 5 images. Only PNG and JPEG formats are allowed.
      </p>
      <input
        className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        type="file"
        id="images"
        multiple
        required
        onChange={handleImageChange}
        accept="image/png, image/jpeg"
      />
      <div className="flex space-x-2 mt-3">
        {images.map((url, index) => (
          <div key={index} className="relative">
            <img
              src={url}
              alt={`Preview ${index}`}
              className="h-24 w-24 rounded-md object-cover"
            />
            <button
              type="button"
              className="absolute top-0 right-0 bg-red-600 p-1 rounded-full text-white"
              onClick={() => handleRemoveImage(url)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
