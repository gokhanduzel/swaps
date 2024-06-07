import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ItemCard from "../components/ItemCard";
import { getItemsByUser, deleteItem } from "../features/item/itemSlice";
import { getSwaps } from "../features/swaps/swapsSlice";
import SwapCard from "../components/SwapCard";
import {
  fetchUserProfile,
  updateUserProfile,
} from "../features/user/userSlice";
import axios from "axios";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.item.userItems);
  const swaps = useSelector((state) => state.swaps.swaps);
  const user = useSelector((state) => state.user?.user);
  const userId = useSelector((state) => state.auth.user?.user?._id);
  const userStatus = useSelector((state) => state.user.status);

  const [activeParentTab, setActiveParentTab] = useState("items");
  const [activeTab, setActiveTab] = useState("received");
  const [editMode, setEditMode] = useState({
    username: false,
    email: false,
    location: false,
  });
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    location: "",
    coordinates: { lat: null, lng: null },
  });

  const addressInputRef = useRef(null);

  useEffect(() => {
    console.log("ProfilePage mounted or userId changed", userId);
    if (!userId) return;
    const fetchData = async () => {
      try {
        await dispatch(getItemsByUser(userId));
        await dispatch(getSwaps(userId));
        await dispatch(fetchUserProfile(userId));
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, [dispatch, userId]);

  useEffect(() => {
    console.log("User data loaded", user);
    if (!user) return;
    setFormData({
      username: user.username,
      email: user.email,
      location: user.location?.address,
      coordinates: {
        lat: user.location?.coordinates[1],
        lng: user.location?.coordinates[0],
      },
    });
  }, [user]);

  // Handling Google Maps API setup
  useEffect(() => {
    if (!window.google || !window.google.maps || !addressInputRef.current) {
      console.log("Google Maps API not loaded or address input ref not set.");
      return;
    }
    const autocomplete = new window.google.maps.places.Autocomplete(
      addressInputRef.current,
      { types: ["geocode"] }
    );
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        setFormData((prevData) => ({
          ...prevData,
          location: place.formatted_address,
          coordinates: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
        }));
      }
    });
  }, [user]);

  const handleLocationDetection = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          try {
            const response = await axios.post(
              "http://localhost:5001/api/users/reverse-geocode",
              { lat, lng }
            );
            const data = response.data;
            if (data.address) {
              setFormData({
                ...formData,
                location: data.address,
                coordinates: { lat, lng },
              });
            } else {
              alert("Unable to detect location. Please enter manually.");
            }
          } catch (error) {
            console.error("Error reverse geocoding:", error);
            alert("Unable to detect location. Please enter manually.");
          }
        },
        (error) => {
          console.error("Error detecting location:", error);
          alert("Unable to detect location. Please enter manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

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

  const handleEdit = (field) => {
    setEditMode({ ...editMode, [field]: true });
  };

  const handleCancel = (field) => {
    setEditMode({ ...editMode, [field]: false });
    setFormData((prevData) => ({ ...prevData, [field]: user[field] }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (field) => {
    if (!field) return;
    const updateData = async () => {
      try {
        const profileData = { [field]: formData[field] };
        if (field === "location") {
          profileData.location = {
            address: formData.location,
            coordinates: [formData.coordinates.lng, formData.coordinates.lat],
          };
        }
        const response = await dispatch(
          updateUserProfile({ userId, profileData })
        );
        if (!updateUserProfile.fulfilled.match(response)) {
          throw new Error("Failed to update user profile");
        }
        await dispatch(fetchUserProfile(userId));
      } catch (error) {
        console.error("Error updating user profile:", error);
      }
    };
    updateData();
    setEditMode({ ...editMode, [field]: false });
  };

  if (userStatus === "loading" || !userId) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-teal-400 to-blue-400 flex flex-col items-center pt-32 pb-32">
        <div role="status">
          <svg
            aria-hidden="true"
            className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-red-600 fill-red-400 drop-shadow-redGlow"
            viewBox="0 0 100 101"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (userStatus === "failed" || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-teal-400 to-blue-400 flex flex-col items-center pt-32 pb-32">
        <div role="status">
          <svg
            aria-hidden="true"
            className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-red-600 fill-red-400 drop-shadow-redGlow"
            viewBox="0 0 100 101"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-teal-400 to-blue-400 flex flex-col items-center pt-32 pb-32">
        No user data available.
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-r from-teal-400 to-blue-400 flex flex-col items-center pt-32 pb-32">
      {user.username && (
        <h1 className="text-center text-5xl font-bold mt-8 mb-16 animate-fadeIn drop-shadow-tealGlow text-white bg-opacity-30 bg-black px-8 py-4 rounded-xl w-5/">
          {user.username}'s Profile
        </h1>
      )}
      <div className="border-2 p-4 mb-8 bg-white bg-opacity-50">
        <h5 className="text-xl font-semibold">Profile Information:</h5>
        <div className="mt-2 flex items-center">
          <h6 className="text-xl font-semibold">Username:</h6>
          {editMode.username ? (
            <>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="ml-4 border rounded p-1"
              />
              <button
                onClick={() => handleSubmit("username")}
                className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
              >
                Submit
              </button>
              <button
                onClick={() => handleCancel("username")}
                className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <p className="text-lg ml-4">{user.username}</p>
              <button
                onClick={() => handleEdit("username")}
                className="ml-2 text-xs bg-orange-400 hover:bg-orange-200 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
            </>
          )}
        </div>
        <div className="mt-2 flex items-center">
          <h6 className="text-xl font-semibold">Email:</h6>
          {editMode.email ? (
            <>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="ml-4 border rounded p-1"
              />
              <button
                onClick={() => handleSubmit("email")}
                className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
              >
                Submit
              </button>
              <button
                onClick={() => handleCancel("email")}
                className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <p className="text-lg ml-4">{user.email}</p>
              <button
                onClick={() => handleEdit("email")}
                className="ml-2 text-xs bg-orange-400 hover:bg-orange-200 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
            </>
          )}
        </div>
        <div className="mt-2 flex items-center">
          <h6 className="text-xl font-semibold">Location:</h6>
          {editMode.location ? (
            <>
              <input
                ref={addressInputRef}
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="ml-4 border rounded p-1"
              />
              <button
                onClick={() => handleSubmit("location")}
                className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
              >
                Submit
              </button>
              <button
                onClick={() => handleCancel("location")}
                className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                className="ml-2 py-1 px-2 bg-teal-400 text-white rounded"
                onClick={handleLocationDetection}
              >
                Detect My Location
              </button>
            </>
          ) : (
            <>
              <p className="text-lg ml-4">{user.location?.address}</p>
              <button
                onClick={() => handleEdit("location")}
                className="ml-2 text-xs bg-orange-400 hover:bg-orange-200 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
            </>
          )}
        </div>
      </div>
      <div className="mb-2">
        <button
          className={`px-4 py-2 mr-2 rounded-lg ${
            activeParentTab === "items"
              ? "bg-orange-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveParentTab("items")}
        >
          My Items
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeParentTab === "swaps"
              ? "bg-orange-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveParentTab("swaps")}
        >
          Swap Requests
        </button>
      </div>
      <hr className="w-5/6 border-2 border-gray-300" />

      {activeParentTab === "items" && (
        <>
          <h1 className="text-3xl font-bold my-8 text-white drop-shadow-whiteGlow">
            My Items
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
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
                  No item listings found. Try adjusting your filters or check
                  back later.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {activeParentTab === "swaps" && (
        <>
          <h1 className="text-3xl font-bold my-8 text-white drop-shadow-whiteGlow">
            Swap Requests
          </h1>
          <div className="mb-8">
            <button
              className={`px-4 py-2 mr-2 rounded-lg ${
                activeTab === "received"
                  ? "bg-lime-400 text-black"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => handleTabChange("received")}
            >
              Received
            </button>
            <button
              className={`px-4 py-2 mr-2 rounded-lg ${
                activeTab === "sent"
                  ? "bg-lime-400 text-black"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => handleTabChange("sent")}
            >
              Sent
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                activeTab === "accepted"
                  ? "bg-lime-400 text-black"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => handleTabChange("accepted")}
            >
              Accepted
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeTab === "received" && renderSwapRequests("received")}
            {activeTab === "sent" && renderSwapRequests("sent")}
            {activeTab === "accepted" && renderSwapRequests("accepted")}
          </div>
        </>
      )}
    </section>
  );
};

export default ProfilePage;
