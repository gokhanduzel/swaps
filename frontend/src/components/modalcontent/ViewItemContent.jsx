import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel CSS

const ViewItemContent = ({ item }) => (
  <div className="p-4 max-w-2xl mx-auto">
    <h2 className="text-3xl font-bold mb-4 text-teal-800">
      Title: {item.title}
    </h2>
    <p className="text-lg mb-1 text-gray-800">Description:</p>
    <p className="text-lg mb-4 text-gray-800 whitespace-pre-line break-words bg-gray-200 p-4">
      {item.description}
    </p>
    <div className="mb-6 h-80 bg-gray-200 flex justify-center items-center">
      {item.images && item.images.length > 0 ? (
        <Carousel
          showArrows={true}
          showThumbs={false}
          className="w-full h-full"
          dynamicHeight={false}
        >
          {item.images.map((image, index) => (
            <div
              key={index}
              className="flex justify-center items-center w-full h-80"
            >
              <img
                src={image}
                alt={`Image ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </Carousel>
      ) : (
        <span className="text-gray-500">No Image Available</span>
      )}
    </div>
    <div className="bg-gray-100 p-4 rounded-lg mb-4">
      <p className="text-lg font-semibold text-gray-800">Tags:</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {item.tags && item.tags.length > 0 ? (
          item.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full"
            >
              {tag.trim()}
            </span>
          ))
        ) : (
          <p className="text-sm text-gray-600">No tags listed.</p>
        )}
      </div>
    </div>
    <div className="bg-gray-100 p-4 rounded-lg">
      <p className="text-lg font-semibold text-gray-800">
        Looking to swap with:
      </p>
      <div className="flex flex-wrap gap-2 mt-2">
        {item.desiredItems && item.desiredItems.length > 0 ? (
          item.desiredItems.map((desiredItem, index) => (
            <span
              key={index}
              className="bg-teal-200 text-teal-800 text-xs font-semibold px-2.5 py-0.5 rounded-full"
            >
              {desiredItem.trim()}
            </span>
          ))
        ) : (
          <p className="text-sm text-gray-600">No desired items listed.</p>
        )}
      </div>
    </div>
  </div>
);

export default ViewItemContent;
