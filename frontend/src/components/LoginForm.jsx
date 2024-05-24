import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(login({ email, password }));
      if (login.fulfilled.match(resultAction)) {
        // Login was successful
        alert("Logged in successfully");
      } else {
        // Login failed
        console.log(resultAction);
        if (resultAction.payload) {
          // The server responded with a message
          alert(`Login failed: ${resultAction.payload.message}`);
        } else {
          // The server didn't respond with a message
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
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          className="mt-1 block w-full p-2 border border-gray-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="happyuser@email.com"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          className="mt-1 block w-full p-2 border border-gray-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password123"
        />
      </div>
      <button
        type="submit"
        className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
