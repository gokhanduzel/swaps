import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const handleLogout = () => {
    dispatch(logout());
  };

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, visible]);

  return (
    <>
      <nav
        className={`bg-gray-800 text-white p-4 inset-x-0 fixed top-0 transition-all duration-200 z-20 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-lg font-bold">Swaps</Link>
          <ul className="flex">
            <li>
              <Link to="/" className="px-4">
                Home
              </Link>
            </li>
            <li>
              <Link to="/swaps" className="px-4">
                Search Swaps
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link to="/createitem" className="px-4">
                    Create Item
                  </Link>
                </li>
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
      <div className="pt-16"></div>
    </>
  );
};

export default Navbar;
