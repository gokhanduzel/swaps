import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel CSS

const ViewItemContent = ({ item }) => (
  <>
    <h2>Title: {item.title}</h2>
    <p>Description: {item.description}</p>
    {item.images && item.images.length > 0 && (
      <Carousel showArrows={true} showThumbs={false}>
        {item.images.map((image, index) => (
          <div key={index}>
            <img src={image} alt={`Image ${index + 1}`} />
          </div>
        ))}
      </Carousel>
    )}
    <p>Tags: {item.tags}</p>
    <p>Looking to swap with: {item.desiredItems}</p>
  </>
);

export default ViewItemContent;
