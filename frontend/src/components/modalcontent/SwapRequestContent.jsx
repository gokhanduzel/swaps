import React from "react";

const SwapRequestContent = ({ item, onSubmit }) => (
  <form onSubmit={onSubmit}>
    <label>
      Your Item:
      <input type="text" placeholder="Describe your item" />
    </label>
    <label>
      Message:
      <textarea placeholder="Your message"></textarea>
    </label>
    <button type="submit">Send Request</button>
  </form>
);

export default SwapRequestContent;
