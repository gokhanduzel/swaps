import React from "react";
import SwapCard from "../SwapCard";

const SwapRequests = ({ swaps, userId, activeTab }) => {
  const renderSwapRequests = (status) => {
    let filteredSwaps;
    if (status === "received") {
      filteredSwaps = swaps.filter(
        (swap) => swap.user2Id === userId && swap.status === "pending"
      );
    } else if (status === "sent") {
      filteredSwaps = swaps.filter(
        (swap) => swap.user1Id === userId && swap.status === "pending"
      );
    } else if (status === "accepted") {
      filteredSwaps = swaps.filter((swap) => swap.status === "accepted");
    }

    if (filteredSwaps.length > 0) {
      return filteredSwaps.map((request) => (
        <SwapCard key={request._id} request={request} />
      ));
    } else {
      return (
        <div className="w-full text-center text-gray-600 text-xl">
          <p>No swap requests found.</p>
        </div>
      );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-2 p-4">
      {activeTab === "received" && renderSwapRequests("received")}
      {activeTab === "sent" && renderSwapRequests("sent")}
      {activeTab === "accepted" && renderSwapRequests("accepted")}
    </div>
  );
};

export default SwapRequests;
