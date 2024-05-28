import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ItemCard from "../components/ItemCard";
import { getItemsByUser, deleteItem } from "../features/item/itemSlice";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.item.userItems);
  const user = useSelector((state) => state.auth.user?.user); 
  console.log("User:", user);
  const userId = user?._id;

  useEffect(() => {
    if (userId) {
      dispatch(getItemsByUser(userId));
    }
  }, [dispatch, userId]);

  const handleDelete = (itemId) => {
    dispatch(deleteItem(itemId)).then(() => {
      dispatch(getItemsByUser(userId));
    });
  };

  const handleUpdate = () => {
    dispatch(getItemsByUser(userId));
  };

  return (
    <section>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold my-8">Items</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      </div>
    </section>
  );
};

export default ProfilePage;
