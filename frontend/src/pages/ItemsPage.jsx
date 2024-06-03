import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ItemCard from "../components/ItemCard";
import { getVisibleItems } from "../features/item/itemSlice";
import { Link } from "react-router-dom";
import loginPanda from "../assets/loginPanda.png";
import "../index.css";

const ItemsPage = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.item.visibleItems);
  console.log("Items:", items);
  const userId = useSelector((state) => state.auth.user?.user?._id);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(getVisibleItems());
  }, [dispatch]);

  return (
    <section className="min-h-screen pt-32 pb-32 bg-gradient-to-r from-teal-400 via-blue-400 to-teal-400">
      <div className="container mx-auto flex flex-col justify-center">
        <h1 className="text-5xl font-bold mt-8 mb-16 mx-auto animate-fadeIn drop-shadow-orangeGlow text-white text-center bg-opacity-30 bg-black px-8 py-4 rounded-xl w-11/12">
          SWAPS
        </h1>
        {isAuthenticated ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8">
            {items.length > 0 ? (
              items.map((item) => (
                <ItemCard
                  key={item._id}
                  item={item}
                  isProfilePage={false}
                  userId={userId}
                  ownerId={item.ownerId}
                />
              ))
            ) : (
              <div className="w-full text-center text-gray-600 text-xl">
                <p>
                  No item listings found. Try adjusting your filters or check
                  back later.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-y-8 items-center justify-center">
            <p className="text-xl text-center text-white">
              You need to login to view the swaps.
            </p>
            <img
              src={loginPanda}
              alt="Login Panda"
              className="w-1/2 md:w-1/3 image"
            />
            <Link
              to="/login"
              className="py-2 px-11 bg-red-400 text-white rounded-2xl font-semibold shadow transition duration-300 hover:bg-red-500 hover:text-white border-2 border-gray-800"
            >
              LOGIN
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ItemsPage;
