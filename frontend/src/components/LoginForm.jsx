import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(login({ email, password }));
      if (login.fulfilled.match(resultAction)) {
        alert("Logged in successfully");
        navigate("/");
      } else {
        console.log(resultAction);
        if (resultAction.payload) {
          alert(`Login failed: ${resultAction.payload.message}`);
        } else {
          alert("Login failed");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-5/6 md:w-1/2">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-lg font-medium text-gray-700"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="happyuser@email.com"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-lg font-medium text-gray-700"
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password123"
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="py-2 px-11 bg-red-400 text-white rounded-2xl font-semibold shadow transition duration-300 hover:bg-red-500 hover:text-white border-2 border-gray-800"
          >
            LOGIN
          </button>
        </div>
      </form>

      <div className="text-md font-medium text-gray-700 mt-6 text-center">
        Not registered?{" "}
        <Link
          to="/register"
          className="text-teal-500 hover:underline"
        >
          Create a new account
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
