import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ItemCard from "../components/ItemCard";
import { getItemsByUser, deleteItem } from "../features/item/itemSlice";
import { getSwaps } from "../features/swaps/swapsSlice";
import SwapCard from "../components/SwapCard";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.item.userItems);
  const swaps = useSelector((state) => state.swaps.swaps);
  console.log(swaps);
  const user = useSelector((state) => state.auth.user?.user);
  const userId = user?._id;

  useEffect(() => {
    if (userId) {
      dispatch(getItemsByUser(userId));
      dispatch(getSwaps(userId));
    }
  }, [dispatch, userId]);

  const handleDelete = (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      dispatch(deleteItem(itemId)).then((response) => {
        if (deleteItem.fulfilled.match(response)) {
          alert("Item deleted successfully");
          dispatch(getItemsByUser(userId));
        } else {
          alert("Failed to delete item");
        }
      });
    }
  };

  const handleUpdate = () => {
    dispatch(getItemsByUser(userId));
  };

  return (
    <section className="pt-40">
      <div className="container mx-auto">
        {user.username && (
          <h1 className="text-3xl font-bold my-8">{user.username}'s Profile</h1>
        )}
        <div className="border-2">
        <h5>Profile Information:</h5>
          <div>
            <h6 className="text-xl font-semibold">Username:</h6>
            <p className="text-lg">{user.username}</p>
          </div>
          <div>
            <h6 className="text-xl font-semibold">Email:</h6>
            <p className="text-lg">{user.email}</p>
          </div>
        </div>
        <h1 className="text-3xl font-bold my-8">Items</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-2 p-4">
          {items.length > 0 ? (
            items.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                isProfilePage={true}
                handleDelete={handleDelete}
                handleUpdate={handleUpdate}
              />
            ))
          ) : (
            <div className="w-full text-center text-gray-600 text-xl">
              <p>
                No item listings found. Try adjusting your filters or check back
                later.
              </p>
            </div>
          )}
        </div>
        <h1 className="text-3xl font-bold my-8">Swap Requests</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-2 p-4">
          {swaps.length > 0 ? (
            swaps.map((request) => (
              <SwapCard key={request._id} request={request} />
            ))
          ) : (
            <div className="w-full text-center text-gray-600 text-xl">
              <p>No swap requests found.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
