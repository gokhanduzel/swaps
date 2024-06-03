import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== repassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await dispatch(register({ username, email, password }));
      console.log(response);
      if (register.fulfilled.match(response)) {
        // Registration was successful
        alert("Registered successfully");
        navigate("/home");
      } else {
        // Registration failed
        console.log(response);
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-5/6 md:w-1/2">
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
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
        <div className="mb-6">
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
        <Link
          to="/login"
          className="text-teal-500 hover:underline"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default RegistrationForm;
