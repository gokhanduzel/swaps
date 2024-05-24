import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
      dispatch(logout());
  };



  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-lg font-bold">Swaps</h1>
        <ul className="flex">
          <li>
            <Link to="/" className="px-4">
              Home
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/profile" className="px-4">
                  Profile
                </Link>
              </li>
              <li>
                <button className="px-4" onClick={handleLogout}>  
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="px-4">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="px-4">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;