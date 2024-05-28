import React from "react";

const ViewItemContent = ({ item }) => (
  <>
    <h2>Title: {item.title}</h2>
    <p>Description: {item.description}</p>
    <p>Tags: {item.tags}</p>
    <p>Looking to swap with: {item.desiredItems}</p>
  </>
);

export default ViewItemContent;
