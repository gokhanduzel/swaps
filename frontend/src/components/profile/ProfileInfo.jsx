import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../../features/user/userSlice";
import axios from "axios";

const ProfileInfo = ({ user }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.user?._id);
  const [editMode, setEditMode] = useState({
    username: false,
    email: false,
    location: false,
  });
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    location: user.location?.address,
  });
  const addressInputRef = useRef(null);
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

  useEffect(() => {
    const initializeAutocomplete = () => {
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
            setFormData((prevState) => ({
              ...prevState,
              location: place.formatted_address,
            }));
            setCoordinates({
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            });
          }
        });
      } else {
        console.error(
          "Google Maps API not loaded or address input ref not set."
        );
      }
    };

    const checkGoogleMapsLoaded = () => {
      if (window.google && window.google.maps) {
        initializeAutocomplete();
      } else {
        setTimeout(checkGoogleMapsLoaded, 100);
      }
    };

    checkGoogleMapsLoaded();
  }, []);

  const handleLocationDetection = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCoordinates({ lat, lng });
          try {
            const response = await axios.post(
              "http://localhost:5001/api/users/reverse-geocode",
              {
                lat,
                lng,
              }
            );
            const data = response.data;
            if (data.address) {
              setFormData((prevState) => ({
                ...prevState,
                location: data.address,
              }));
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

  const handleEdit = (field) => {
    setEditMode({ ...editMode, [field]: true });
  };

  const handleCancel = (field) => {
    setEditMode({ ...editMode, [field]: false });
    setFormData({ ...formData, [field]: user[field] });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (field) => {
    const profileData = { [field]: formData[field] };
    if (field === "location") {
      profileData.coordinates = [coordinates.lng, coordinates.lat];
    }
    dispatch(updateUserProfile({ userId, profileData })).then((response) => {
      if (updateUserProfile.fulfilled.match(response)) {
        setFormData((prevState) => ({
          ...prevState,
          [field]: response.payload[field],
        }));
      }
    });
    setEditMode({ ...editMode, [field]: false });
  };

  return (
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
              className="ml-2 bg-blue-500 text-white px-2 py-1 rounded"
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
              className="ml-2 bg-blue-500 text-white px-2 py-1 rounded"
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
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="ml-4 border rounded p-1"
              ref={addressInputRef}
            />
            <button
              onClick={handleLocationDetection}
              className="ml-2 bg-teal-500 text-white px-2 py-1 rounded"
            >
              Detect Location
            </button>
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
          </>
        ) : (
          <>
            <p className="text-lg ml-4">{user.location?.address}</p>
            <button
              onClick={() => handleEdit("location")}
              className="ml-2 bg-blue-500 text-white px-2 py-1 rounded"
            >
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;
