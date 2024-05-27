import itemCard from "../components/ItemCard";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ItemCard from "../components/ItemCard";
import { getVisibleItems } from "../features/item/itemSlice";

const ItemsPage = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.item.visibleItems);

  useEffect(() => {
    dispatch(getVisibleItems());
  }, [dispatch]);

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

export default ItemsPage;
