import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { register } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import loadGoogleMapsScript from "../utils/loadGoogleMapsScript";

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const addressInputRef = useRef(null);

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
            setAddress(place.formatted_address);
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
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== repassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await dispatch(
        register({
          username,
          email,
          password,
          location: {
            address,
            coordinates: [coordinates.lng, coordinates.lat],
          },
        })
      );
      if (register.fulfilled.match(response)) {
        // Registration was successful
        alert("Registered successfully");
        navigate("/");
      } else {
        // Registration failed
        if (response.payload && response.payload !== undefined) {
          // The server responded with a message
          alert(`Registration failed: ${response.payload.message}`);
        } else {
          // The server didn't respond with a message
          alert("Registration failed");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

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
              setAddress(data.address);
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-5/6 md:w-1/2">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Mighty Swapper"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="swappy@email.com"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="repassword"
          >
            Re-enter your password:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            id="repassword"
            name="repassword"
            value={repassword}
            onChange={(e) => setRepassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="address"
          >
            Address:
          </label>
          <p className="text-gray-400 text-sm ml-1 mb-2">
            You dont have to provide an address right now. You can update it
            later on your profile. The location you provide is used for swap
            search filtering.
          </p>

          <input
            ref={addressInputRef}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="address"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Main St, SwappyTown, CA ABC 123, Canada"
          />
          <button
            type="button"
            className="mt-2 py-1 px-2 bg-teal-400 text-white rounded"
            onClick={handleLocationDetection}
          >
            Detect My Location
          </button>
        </div>

        <div className="flex items-center justify-center">
          <button
            className="py-2 px-11 bg-purple-400 text-white rounded-2xl font-semibold shadow transition duration-300 hover:bg-purple-500 hover:text-white border-2 border-gray-800"
            type="submit"
          >
            Register
          </button>
        </div>
      </form>
      <div className="text-md font-medium text-gray-700 mt-6 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-teal-500 hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
};

export default RegistrationForm;
