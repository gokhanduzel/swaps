import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ItemCard from "../components/ItemCard";
import { getVisibleItems, searchItems } from "../features/item/itemSlice";
import "../index.css";
import { FaArrowAltCircleUp } from "react-icons/fa";
import loadGoogleMapsScript from "../utils/loadGoogleMapsScript";

const ItemsPage = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.item.visibleItems); // Ensure 'items' matches the slice name
  const userId = useSelector((state) => state.auth.user?.user?._id);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [range, setRange] = useState(10); // Default range is 10 km
  const [showScroll, setShowScroll] = useState(false);
  const addressInputRef = useRef(null);

  useEffect(() => {
    dispatch(getVisibleItems());
  }, [dispatch]);

  useEffect(() => {
    loadGoogleMapsScript(() => {
      if (window.google && window.google.maps && addressInputRef.current) {
        const autocomplete = new window.google.maps.places.Autocomplete(
          addressInputRef.current,
          {
            types: ["geocode"],
          }
        );
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place.geometry) {
            setLocation({
              address: place.formatted_address,
              coordinates: [
                place.geometry.location.lng(),
                place.geometry.location.lat(),
              ],
            });
          }
        });
      } else {
        console.error(
          "Google Maps API not loaded or address input ref not set."
        );
      }
    });
  }, []);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.pageYOffset > 300) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 300) {
        setShowScroll(false);
      }
    };
    window.addEventListener("scroll", checkScrollTop);
    return () => {
      window.removeEventListener("scroll", checkScrollTop);
    };
  }, [showScroll]);

  const handleSearch = () => {
    const searchCriteria = {
      keyword: searchQuery,
      location: location.coordinates
        ? {
            address: location.address,
            coordinates: location.coordinates,
          }
        : undefined,
      range: range * 1000, // Convert km to meters
    };
    dispatch(searchItems(searchCriteria));
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setLocation("");
    setRange(10); // Reset to default range
    dispatch(getVisibleItems());
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="min-h-screen pt-32 pb-32 bg-gradient-to-r from-teal-400 via-blue-400 to-teal-400">
      <div className="container mx-auto flex flex-col justify-center">
        <h1 className="text-5xl font-bold mt-8 mb-16 mx-auto animate-fadeIn drop-shadow-redGlow text-white text-center bg-opacity-30 bg-black px-8 py-4 rounded-xl w-5/">
          SWAPS
        </h1>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8 border p-4 rounded-xl bg-black bg-opacity-50">
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="shadow appearance-none border rounded w-full md:w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <input
            type="text"
            placeholder="Location"
            value={location.address || ""}
            onChange={(e) =>
              setLocation({ ...location, address: e.target.value })
            }
            ref={addressInputRef}
            className="shadow appearance-none border rounded w-full md:w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <div className="flex items-center gap-2 w-full md:w-1/3">
            <label htmlFor="range" className="text-white">
              Range:
            </label>
            <input
              type="range"
              id="range"
              min="0"
              max="200"
              step="10"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="w-full"
            />
            <span className="text-white">{range} km</span>
          </div>
          <button
            onClick={handleSearch}
            className="py-2 px-4 bg-teal-400 text-white rounded-xl font-semibold shadow transition duration-300 hover:bg-teal-200"
          >
            Search
          </button>
          <button
            onClick={handleClearFilters}
            className="py-2 px-4 bg-gray-400 text-white rounded-xl font-semibold shadow transition duration-300 hover:bg-gray-500"
          >
            Clear
          </button>
        </div>
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8">
            {items.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                isProfilePage={false}
                userId={userId}
                ownerId={item.ownerId}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-full text-center text-gray-600 text-xl">
            <p>
              No item listings found. Try adjusting your filters or check back
              later.
            </p>
          </div>
        )}
      </div>
      {showScroll && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-32 right-5 md:right-6 lg:right-10 bg-indigo-400 text-white p-3 rounded-full shadow-lg hover:bg-indigo-600 transition duration-300 ${
            showScroll ? "animate-rise" : "animate-sink"
          }`}
        >
          <FaArrowAltCircleUp size={30} />
        </button>
      )}
    </section>
  );
};

export default ItemsPage;
